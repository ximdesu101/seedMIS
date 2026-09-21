import { useState } from "react";
import { cn } from "cn";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
    Pencil,
    Sprout,
    Calendar as CalendarIcon,
    Upload,
    X,
} from "lucide-react";
import productionService from "@/services/productionService";

const EditProduction = ({ production, onUpdate }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dateSown, setDateSown] = useState(production.date_sown ? new Date(production.date_sown) : undefined);
    const [expectedReadyDate, setExpectedReadyDate] = useState(production.expected_ready ? new Date(production.expected_ready) : undefined);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(production.image_url ? `http://localhost:8000/${production.image_url}` : null);

    const [formData, setFormData] = useState({
        seedling_type: production.seedling_type || '',
        classification: production.classification || '',
        location: production.location || '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(production.image_url ? `http://localhost:8000/${production.image_url}` : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const productionData = {
                ...formData,
                date_sown: dateSown ? format(dateSown, 'yyyy-MM-dd') : production.date_sown,
                expected_ready: expectedReadyDate ? format(expectedReadyDate, 'yyyy-MM-dd') : production.expected_ready,
            };

            // Only add image if new one was uploaded
            if (imageFile) {
                productionData.image = imageFile;
            }

            const response = await productionService.updateProduction(production.id, productionData);

            if (response.success) {
                alert('Production batch updated successfully!');
                setDialogOpen(false);
                if (onUpdate) {
                    onUpdate();
                } else {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error updating production:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors 
                    ? Object.values(error.response.data.errors).flat().join('\n')
                    : error.response.data.message;
                alert(`Error: ${errorMessage}`);
            } else {
                alert('Failed to update production. Please try again.');
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
                    Edit Batch Info
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-3xl sm:!max-w-3xl max-h-[90vh] flex flex-col gap-0" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <DialogTitle>Edit Production Batch</DialogTitle>
                        <DialogDescription>
                            Update batch information for {production.batch_id}
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="overflow-y-auto flex-1 px-6 py-4 max-h-[60vh]">
                        <FieldGroup className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="batch_id">Batch ID</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                                    {production.batch_id} (Cannot be changed)
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="seedling-image">Seedling Image (Optional)</FieldLabel>
                                <div className="flex items-start gap-4">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Seedling preview"
                                                className="w-24 h-28 object-cover rounded-md border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-28 flex items-center justify-center bg-gray-100 rounded-md border border-dashed">
                                            <span className="text-gray-400 text-sm">Photo</span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="seedling-image"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <label htmlFor="seedling-image">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="cursor-pointer"
                                                asChild
                                            >
                                                <span>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                                </span>
                                            </Button>
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Optional: Upload a new photo of the seedling
                                        </p>
                                    </div>
                                </div>
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="seedling_type">Seedling Type</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="seedling_type"
                                            type="text"
                                            placeholder="Mahogany"
                                            value={formData.seedling_type}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <InputGroupAddon><Sprout /></InputGroupAddon>
                                    </InputGroup>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="classification">Classification</FieldLabel>
                                    <Select value={formData.classification} onValueChange={(value) => handleSelectChange('classification', value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select classification" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="Crafted">Crafted</SelectItem>
                                            <SelectItem value="Seedling">Seedling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="date-sown">Date Sown</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date-sown"
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-between text-left font-normal",
                                                    !dateSown && "text-muted-foreground"
                                                )}
                                            >
                                                {dateSown ? format(dateSown, "PPP") : "Pick a date"}
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateSown}
                                                onSelect={setDateSown}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="expected-ready-date">Expected Ready</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="expected-ready-date"
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-between text-left font-normal",
                                                    !expectedReadyDate && "text-muted-foreground"
                                                )}
                                            >
                                                {expectedReadyDate ? format(expectedReadyDate, "PPP") : "Pick a date"}
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={expectedReadyDate}
                                                onSelect={setExpectedReadyDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="quantity_sown">Quantity Sown</FieldLabel>
                                <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                                    {production.quantity_sown?.toLocaleString()} (Cannot be changed)
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="location">Location</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="location"
                                        type="text"
                                        placeholder="Greenhouse A"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputGroupAddon><Sprout /></InputGroupAddon>
                                </InputGroup>
                            </Field>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> Use "Update Stage" to change the production stage or current quantity.
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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProduction;
