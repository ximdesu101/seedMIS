import * as React from "react";
import { useState } from "react";
import { cn } from "cn";
import { format } from "date-fns";
import productionService from "@/services/productionService";
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
    CirclePlus,
    Sprout,
    Calendar as CalendarIcon,
    Upload,
    X,
} from "lucide-react";

const AddSeedlings = () => {
    const [dateSown, setDateSown] = useState();
    const [expectedReadyDate, setExpectedReadyDate] = useState();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        batch_id: '',
        seedling_type: '',
        classification: '',
        quantity_sown: '',
        current_quantity: '',
        stage: '',
        location: '',
    });

    // Fetch next batch ID when dialog opens
    React.useEffect(() => {
        if (dialogOpen) {
            fetchNextBatchId();
        }
    }, [dialogOpen]);

    const fetchNextBatchId = async () => {
        try {
            const response = await productionService.getNextBatchId();
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    batch_id: response.data.batch_id
                }));
            }
        } catch (error) {
            console.error('Error fetching batch ID:', error);
        }
    };

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

        // Reset stage when classification changes
        if (field === 'classification') {
            // If switching to Grafted and current stage is Germination or Seedling, reset stage
            if (value === 'Grafted' && (formData.stage === 'Germination' || formData.stage === 'Seedling')) {
                setFormData(prev => ({
                    ...prev,
                    classification: value,
                    stage: '' // Reset stage
                }));
            }
            // If switching to Seedling, allow any stage
        }
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
        setImagePreview(null);
    };

    const resetForm = () => {
        setFormData({
            batch_id: '',
            seedling_type: '',
            classification: '',
            quantity_sown: '',
            current_quantity: '',
            stage: '',
            location: '',
        });
        setDateSown(undefined);
        setExpectedReadyDate(undefined);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get user data from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const userType = localStorage.getItem('userType');

            const productionData = {
                ...formData,
                date_sown: dateSown ? format(dateSown, 'yyyy-MM-dd') : null,
                expected_ready: expectedReadyDate ? format(expectedReadyDate, 'yyyy-MM-dd') : null,
                image: imageFile,
                user_id: user?.id || null,
                user_type: userType || null,
            };

            const response = await productionService.createProduction(productionData);

            if (response.success) {
                alert('Production batch created successfully!');
                resetForm();
                setDialogOpen(false);
                // Optionally refresh the production table
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating production batch:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors 
                    ? Object.values(error.response.data.errors).flat().join('\n')
                    : error.response.data.message;
                alert(`Error: ${errorMessage}`);
            } else {
                alert('Failed to create production batch. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#016146]">
                    <CirclePlus />
                    Add Seedlings
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] flex flex-col gap-0" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <DialogTitle>New Production Batch</DialogTitle>
                        <DialogDescription>
                            Add a new production batch and enter its details.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className="overflow-y-auto flex-1 px-6 py-4 max-h-[60vh]">
                        <FieldGroup className="space-y-6">
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
                                                    Upload Image
                                                </span>
                                            </Button>
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Optional: Upload a photo of the seedling (PNG, JPG, or JPEG)
                                        </p>
                                    </div>
                                </div>
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="batch_id">Batch ID</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="batch_id"
                                            type="text"
                                            placeholder="BAT-0001"
                                            value={formData.batch_id}
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                            required
                                        />
                                        <InputGroupAddon><Sprout /></InputGroupAddon>
                                    </InputGroup>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Auto-generated based on inventory records
                                    </p>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="seedling_type">Various of Seedling</FieldLabel>
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
                            </div>

                            <Field>
                                <FieldLabel htmlFor="classification">Classification</FieldLabel>
                                <Select value={formData.classification} onValueChange={(value) => handleSelectChange('classification', value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select classification" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Grafted">Grafted</SelectItem>
                                        <SelectItem value="Seedling">Seedling</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

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
                                                {dateSown
                                                    ? format(dateSown, "PPP")
                                                    : "Pick a date"}
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateSown}
                                                onSelect={setDateSown}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                                                {expectedReadyDate
                                                    ? format(expectedReadyDate, "PPP")
                                                    : "Pick a date"}
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={expectedReadyDate}
                                                onSelect={setExpectedReadyDate}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="quantity_sown">Quantity Sown</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="quantity_sown"
                                            type="number"
                                            min="0"
                                            placeholder="800"
                                            value={formData.quantity_sown}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            required
                                        />
                                        <InputGroupAddon><Sprout /></InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="current_quantity">Current Quantity</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="current_quantity"
                                            type="number"
                                            min="0"
                                            placeholder="750"
                                            value={formData.current_quantity}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            required
                                        />
                                        <InputGroupAddon><Sprout /></InputGroupAddon>
                                    </InputGroup>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="stage">Stage</FieldLabel>
                                    <Select value={formData.stage} onValueChange={(value) => handleSelectChange('stage', value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Production stage" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {/* Show all stages for Seedling classification */}
                                            {formData.classification === 'Seedling' && (
                                                <>
                                                    <SelectItem value="Germination">Germination</SelectItem>
                                                    <SelectItem value="Seedling">Seedling</SelectItem>
                                                </>
                                            )}
                                            {/* Show only Hardening and Ready for Grafted classification */}
                                            <SelectItem value="Hardening">Hardening</SelectItem>
                                            <SelectItem value="Ready">Ready</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            </div>
                        </FieldGroup>
                    </div>
                    <Separator />
                    <DialogFooter className="px-6 py-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="bg-[#016146]" disabled={isSubmitting}>
                            <CirclePlus />
                            {isSubmitting ? 'Adding...' : 'Add Seedling'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSeedlings;
