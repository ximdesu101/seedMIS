import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Archive } from "lucide-react";
import productionService from "@/services/productionService";

const TransferToInventory = ({ production, onUpdate, needsPriceInput }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pricePerUnit, setPricePerUnit] = useState("");

    const handleTransfer = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const transferData = needsPriceInput ? { price_per_unit: pricePerUnit } : {};
            const response = await productionService.transferToInventory(production.id, transferData);

            if (response.success) {
                alert('Batch transferred to inventory successfully!');
                setDialogOpen(false);
                if (onUpdate) {
                    onUpdate();
                }
            }
        } catch (error) {
            console.error('Error transferring to inventory:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors 
                    ? Object.values(error.response.data.errors).flat().join('\n')
                    : error.response.data.message;
                alert(`Error: ${errorMessage}`);
            } else {
                alert('Failed to transfer to inventory. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Archive className="mr-2 h-4 w-4" />
                    Transfer to Inventory
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-md sm:!max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleTransfer}>
                    <DialogHeader>
                        <DialogTitle>Transfer to Inventory</DialogTitle>
                        <DialogDescription>
                            {needsPriceInput 
                                ? "Set the price before transferring to inventory" 
                                : "Confirm transfer to inventory"}
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="py-4">
                        <FieldGroup className="space-y-4">
                            <Field>
                                <FieldLabel>Seedling Type</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                    {production.seedling_type} ({production.classification})
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel>Quantity to Transfer</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm font-semibold">
                                    {production.current_quantity?.toLocaleString()} pieces
                                </div>
                            </Field>

                            {needsPriceInput && (
                                <Field>
                                    <FieldLabel htmlFor="price_per_unit">Price per Unit (₱) *</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="price_per_unit"
                                            type="number"
                                            placeholder="Enter price per unit"
                                            value={pricePerUnit}
                                            onChange={(e) => setPricePerUnit(e.target.value)}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        <InputGroupAddon>₱</InputGroupAddon>
                                    </InputGroup>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        This seedling type doesn't exist in inventory yet. Please set a price.
                                    </p>
                                </Field>
                            )}

                            {!needsPriceInput && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <p className="text-xs text-blue-800">
                                        <strong>Note:</strong> This seedling already exists in inventory. 
                                        The quantity will be added to existing stock. Price remains unchanged.
                                    </p>
                                </div>
                            )}
                        </FieldGroup>
                    </div>
                    <Separator />
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="bg-[#016146]" disabled={isSubmitting}>
                            <Archive className="mr-1 h-4 w-4" />
                            {isSubmitting ? 'Transferring...' : 'Transfer to Inventory'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransferToInventory;
