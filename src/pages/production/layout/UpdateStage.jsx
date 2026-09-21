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
import { ArrowRight, Sprout } from "lucide-react";
import productionService from "@/services/productionService";

const UpdateStage = ({ production, onUpdate }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        stage: production.stage || '',
        current_quantity: production.current_quantity || 0,
        notes: '',
    });

    const handleSelectChange = (value) => {
        setFormData(prev => ({
            ...prev,
            stage: value
        }));
    };

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
            const response = await productionService.updateStage(production.id, formData);

            if (response.success) {
                alert('Production stage updated successfully!');
                setDialogOpen(false);
                if (onUpdate) {
                    onUpdate();
                } else {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error updating stage:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors 
                    ? Object.values(error.response.data.errors).flat().join('\n')
                    : error.response.data.message;
                alert(`Error: ${errorMessage}`);
            } else {
                alert('Failed to update stage. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Update Stage
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-xl sm:!max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Production Stage</DialogTitle>
                        <DialogDescription>
                            Update the growth stage and current quantity for {production.seedling_type} ({production.batch_id})
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="py-4">
                        <FieldGroup className="space-y-4">
                            <Field>
                                <FieldLabel>Current Stage</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                                    {production.stage}
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="stage">New Stage *</FieldLabel>
                                <Select value={formData.stage} onValueChange={handleSelectChange} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new stage" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Germination">Germination</SelectItem>
                                        <SelectItem value="Seedling">Seedling</SelectItem>
                                        <SelectItem value="Hardening">Hardening</SelectItem>
                                        <SelectItem value="Ready">Ready</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="current_quantity">Current Quantity *</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="current_quantity"
                                        type="number"
                                        placeholder="Enter current quantity"
                                        value={formData.current_quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        max={production.quantity_sown}
                                        required
                                    />
                                    <InputGroupAddon><Sprout /></InputGroupAddon>
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Previous: {production.current_quantity?.toLocaleString()} | 
                                    Sown: {production.quantity_sown?.toLocaleString()}
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="notes"
                                        type="text"
                                        placeholder="Any observations or notes..."
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                    <InputGroupAddon><Sprout /></InputGroupAddon>
                                </InputGroup>
                            </Field>
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
                            <ArrowRight className="mr-1 h-4 w-4" />
                            {isSubmitting ? 'Updating...' : 'Update Stage'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStage;
