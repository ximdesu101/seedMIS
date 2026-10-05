import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddressSelector } from "@/components/ui/address-selector";
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
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    CirclePlus,
    Loader2,
} from "lucide-react";
import clientService from "@/services/clientService";
import { toast } from "sonner";

const AddWalkinClient = ({ onClientAdded }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    
    const [formData, setFormData] = React.useState({
        client_id: "",
        organization: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        barangay: "",
        municipality: "",
        province: "",
    });

    // Fetch next client ID when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            fetchNextClientId();
        }
    }, [isOpen]);

    const fetchNextClientId = async () => {
        try {
            const response = await clientService.getNextClientId();
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    client_id: response.data.client_id
                }));
            }
        } catch (error) {
            console.error('Error fetching client ID:', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        // Map field IDs to state keys
        const fieldMapping = {
            'client-id': 'client_id',
            'organization': 'organization',
            'first-name': 'first_name',
            'middle-name': 'middle_name',
            'last-name': 'last_name',
            'email': 'email',
            'contact-number': 'contact_number',
            'brgy': 'barangay',
            'municipality': 'municipality',
            'province': 'province',
        };
        
        const stateKey = fieldMapping[id] || id;
        
        let processedValue = value;
        
        // For name fields, only allow letters and spaces
        if (id === 'first-name' || id === 'middle-name' || id === 'last-name') {
            // Remove any characters that are not letters or spaces
            processedValue = value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
        }
        // For contact number, format Philippine phone number
        else if (id === 'contact-number') {
            // Remove all non-digit characters except +
            let cleaned = value.replace(/[^\d+]/g, '');
            
            // If starts with +63, limit to 13 characters (+63 + 10 digits)
            if (cleaned.startsWith('+63')) {
                cleaned = cleaned.substring(0, 13);
            } 
            // If starts with 09, limit to 11 characters
            else if (cleaned.startsWith('09')) {
                cleaned = cleaned.substring(0, 11);
            }
            // If starts with 9 (user typing 09), allow it
            else if (cleaned.startsWith('9')) {
                cleaned = '0' + cleaned;
                cleaned = cleaned.substring(0, 11);
            }
            // If starts with +6, allow it (user typing +63)
            else if (cleaned.startsWith('+6')) {
                cleaned = cleaned.substring(0, 13);
            }
            // If starts with 63, convert to +63
            else if (cleaned.startsWith('63') && cleaned.length > 2) {
                cleaned = '+' + cleaned;
                cleaned = cleaned.substring(0, 13);
            }
            // Otherwise, limit to 11 digits
            else {
                cleaned = cleaned.substring(0, 11);
            }
            
            processedValue = cleaned;
        } 
        // For email, keep as is (case-sensitive)
        else if (id === 'email') {
            processedValue = value;
        }
        // For all other text fields, convert to uppercase
        else {
            processedValue = value.toUpperCase();
        }
        
        setFormData(prev => ({
            ...prev,
            [stateKey]: processedValue
        }));
        
        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.client_id) newErrors['client-id'] = "Client ID is required";
        if (!formData.organization) newErrors['organization'] = "Organization is required";
        if (!formData.first_name) newErrors['first-name'] = "First name is required";
        if (!formData.middle_name) newErrors['middle-name'] = "Middle name is required";
        if (!formData.last_name) newErrors['last-name'] = "Last name is required";
        if (!formData.email) newErrors['email'] = "Email is required";
        
        // Validate phone number format
        if (!formData.contact_number) {
            newErrors['contact-number'] = "Contact number is required";
        } else {
            const phone = formData.contact_number;
            // Check if valid Philippine format
            if (phone.startsWith('+63')) {
                if (phone.length !== 13) {
                    newErrors['contact-number'] = "Invalid format. Should be +63XXXXXXXXXX (13 digits)";
                }
            } else if (phone.startsWith('09')) {
                if (phone.length !== 11) {
                    newErrors['contact-number'] = "Invalid format. Should be 09XXXXXXXXX (11 digits)";
                }
            } else {
                newErrors['contact-number'] = "Must start with +63 or 09";
            }
        }
        if (!formData.barangay) newErrors['brgy'] = "Barangay is required";
        if (!formData.municipality) newErrors['municipality'] = "Municipality is required";
        if (!formData.province) newErrors['province'] = "Province is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            client_id: "",
            organization: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            contact_number: "",
            barangay: "",
            municipality: "",
            province: "",
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        setIsSubmitting(true);

        try {
            // Don't send password fields - walk-in clients don't have passwords
            const response = await clientService.createClient(formData);
            
            if (response.success) {
                toast.success("Walk-in Client added successfully!", {
                    description: `${formData.first_name} ${formData.last_name} from ${formData.organization} has been added.`
                });
                resetForm();
                setIsOpen(false);
                
                // Call the callback to refresh the client list
                if (onClientAdded) {
                    onClientAdded();
                }
            }
        } catch (error) {
            console.error("Error adding client:", error);
            console.error("Error response:", error.response);
            
            if (error.response?.data?.errors) {
                // Handle validation errors from backend
                const backendErrors = {};
                const errorMessages = [];
                
                Object.keys(error.response.data.errors).forEach(key => {
                    const formattedKey = key.replace(/_/g, '-');
                    backendErrors[formattedKey] = error.response.data.errors[key][0];
                    errorMessages.push(error.response.data.errors[key][0]);
                });
                
                setErrors(backendErrors);
                
                // Show first error in toast
                toast.error("Validation Error", {
                    description: errorMessages[0]
                });
            } else if (error.response?.data?.message) {
                toast.error("Error", {
                    description: error.response.data.message
                });
            } else if (error.message) {
                toast.error("Network Error", {
                    description: "Make sure the backend server is running at http://localhost:8000"
                });
            } else {
                toast.error("Failed to add client. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#016146] hover:bg-[#014d38]">
                    <CirclePlus />
                    Add Walk-in Client
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Add Walk-in Client</DialogTitle>
                    <DialogDescription>
                        Add a new walk-in client without creating an account (no password required).
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-4">
                        <Field>
                            <FieldLabel htmlFor="client-id">Client ID</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="client-id"
                                    type="text"
                                    placeholder="CLT-0001"
                                    value={formData.client_id}
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    required
                                />
                            </InputGroup>
                            <p className="text-xs text-muted-foreground mt-1">
                                Auto-generated client ID
                            </p>
                            {errors['client-id'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['client-id']}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="organization">
                                Organization
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="organization"
                                    type="text"
                                    placeholder="ORGANIZATION NAME"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
                            {errors['organization'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['organization']}</p>
                            )}
                        </Field>

                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="first-name">
                                    First Name
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="first-name"
                                        type="text"
                                        placeholder="JOHN"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['first-name'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['first-name']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="middle-name">
                                    Middle Name
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="middle-name"
                                        type="text"
                                        placeholder="JANE"
                                        value={formData.middle_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Enter "NA" if no middle name
                                </p>
                                {errors['middle-name'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['middle-name']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="last-name">
                                    Last Name
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="last-name"
                                        type="text"
                                        placeholder="DOE"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['last-name'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['last-name']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['email'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['email']}</p>
                                )}
                            </Field>
                        </FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="contact-number">
                                Contact Number
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="contact-number"
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    maxLength={13}
                                    required
                                />
                            </InputGroup>
                            <p className="text-xs text-muted-foreground mt-1">
                                Format: +63XXXXXXXXXX (13 digits) or 09XXXXXXXXX (11 digits)
                            </p>
                            {errors['contact-number'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['contact-number']}</p>
                            )}
                        </Field>

                        {/* Address Selector */}
                        <AddressSelector
                            values={{
                                province: formData.province,
                                municipality: formData.municipality,
                                barangay: formData.barangay
                            }}
                            onChange={({province, municipality, barangay}) => {
                                setFormData(prev => ({
                                    ...prev,
                                    province,
                                    municipality,
                                    barangay
                                }));
                                // Clear errors when changed
                                setErrors(prev => ({
                                    ...prev,
                                    province: undefined,
                                    municipality: undefined,
                                    barangay: undefined
                                }));
                            }}
                            errors={{
                                province: errors['province'],
                                municipality: errors['municipality'],
                                barangay: errors['brgy']
                            }}
                        />
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={resetForm}
                            >
                                Close
                            </Button>
                        </DialogClose>

                        <Button 
                            type="submit" 
                            className="bg-[#016146] hover:bg-[#014d38]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <CirclePlus />
                                    Add Client
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddWalkinClient;
