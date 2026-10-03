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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Sprout } from "lucide-react";
import inventoryService from "@/services/inventoryService";

const UpdateInventory = ({ inventory, onUpdate }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        price_per_unit: inventory.price_per_unit || 0,
        total_quantity: inventory.total_quantity || 0,
        status: inventory.status || 'Available',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({
            ...prev,
            status: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get user data from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const userType = localStorage.getItem('userType');

            const updateData = {
                ...formData,
                user_id: user?.id || null,
                user_type: userType || null,
            };

            const response = await inventoryService.updateInventory(inventory.id, updateData);

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
            <DialogContent 
                className="w-[90vw] !max-w-xl sm:!max-w-xl max-h-[90vh] flex flex-col gap-0" 
                onInteractOutside={(e) => e.preventDefault()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <DialogTitle>Update Inventory</DialogTitle>
                        <DialogDescription>
                            Update price, quantity, and status for {inventory.seedling_type}
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="overflow-y-auto flex-1 px-6 py-4 max-h-[60vh]">
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
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
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
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="0"
                                        required
                                    />
                                    <InputGroupAddon><Sprout /></InputGroupAddon>
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Current: {inventory.total_quantity.toLocaleString()} pieces
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="status">Status *</FieldLabel>
                                <Select 
                                    value={formData.status} 
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Not Available">Not Available</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Current Status: {inventory.status || 'Available'}
                                </p>
                            </Field>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> Update the status to control inventory availability. "Not Available" prevents distribution.
                                </p>
                            </div>
                        </FieldGroup>
                    </div>
                    <Separator />
                    <DialogFooter className="px-6 py-4">
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
