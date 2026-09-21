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
import { Pencil, Sprout } from "lucide-react";
import inventoryService from "@/services/inventoryService";

const UpdateInventory = ({ inventory, onUpdate }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        price_per_unit: inventory.price_per_unit || 0,
        total_quantity: inventory.total_quantity || 0,
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await inventoryService.updateInventory(inventory.id, formData);

            if (response.success) {
                alert('Inventory updated successfully!');
                setDialogOpen(false);
                if (onUpdate) {
                    onUpdate();
                }
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors 
                    ? Object.values(error.response.data.errors).flat().join('\n')
                    : error.response.data.message;
                alert(`Error: ${errorMessage}`);
            } else {
                alert('Failed to update inventory. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Inventory
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-xl sm:!max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Inventory</DialogTitle>
                        <DialogDescription>
                            Update price and quantity for {inventory.seedling_type}
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="py-4">
                        <FieldGroup className="space-y-4">
                            <Field>
                                <FieldLabel>Seedling Type</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                    {inventory.seedling_type} ({inventory.classification})
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="price_per_unit">Price per Unit (₱) *</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="price_per_unit"
                                        type="number"
                                        placeholder="Enter price"
                                        value={formData.price_per_unit}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <InputGroupAddon>₱</InputGroupAddon>
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Current Price: ₱{parseFloat(inventory.price_per_unit).toFixed(2)}
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="total_quantity">Total Quantity *</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="total_quantity"
                                        type="number"
                                        placeholder="Enter total quantity"
                                        value={formData.total_quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                    <InputGroupAddon><Sprout /></InputGroupAddon>
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Current: {inventory.total_quantity.toLocaleString()} pieces
                                </p>
                            </Field>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> This is the actual physical count of seedlings in your inventory.
                                </p>
                            </div>
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
                            <Pencil className="mr-1 h-4 w-4" />
                            {isSubmitting ? 'Updating...' : 'Update Inventory'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateInventory;
