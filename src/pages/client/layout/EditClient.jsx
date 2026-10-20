import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PasswordStrength } from "@/components/ui/password-strength";
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
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import clientService from "@/services/clientService";
import { toast } from "sonner";

const EditClient = ({ client, onClientUpdated }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    
    const [formData, setFormData] = React.useState({
        client_id: "",
        organization: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        email: "",
        contact_number: "",
        purok: "",
        barangay: "",
        municipality: "",
        province: "",
        region: "",
        status: "",
        password: "",
        password_confirmation: "",
    });

    // Load client data when dialog opens
    React.useEffect(() => {
        if (isOpen && client) {
            setFormData({
                client_id: client.client_id || "",
                organization: client.organization || "",
                first_name: client.first_name || "",
                middle_name: client.middle_name || "",
                last_name: client.last_name || "",
                suffix: client.suffix || "",
                email: client.email || "",
                contact_number: client.contact_number || "",
                purok: client.purok || "",
                barangay: client.barangay || "",
                municipality: client.municipality || "",
                province: client.province || "",
                region: client.region || "",
                status: client.status || "Active",
                password: "",
                password_confirmation: "",
            });
        }
    }, [isOpen, client]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        const fieldMapping = {
            'client-id': 'client_id',
            'organization': 'organization',
            'first-name': 'first_name',
            'middle-name': 'middle_name',
            'last-name': 'last_name',
            'suffix': 'suffix',
            'email': 'email',
            'contact-number': 'contact_number',
            'purok': 'purok',
            'brgy': 'barangay',
            'municipality': 'municipality',
            'province': 'province',
            'region': 'region',
            'status': 'status',
            'password': 'password',
            'confirm-password': 'password_confirmation'
        };
        
        const stateKey = fieldMapping[id] || id;
        
        let processedValue = value;
        
        // For name fields, only allow letters and spaces
        if (id === 'first-name' || id === 'middle-name' || id === 'last-name') {
            processedValue = value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
        }
        // For contact number, format Philippine phone number
        else if (id === 'contact-number') {
            let cleaned = value.replace(/[^\d+]/g, '');
            
            if (cleaned.startsWith('+63')) {
                cleaned = cleaned.substring(0, 13);
            } else if (cleaned.startsWith('09')) {
                cleaned = cleaned.substring(0, 11);
            } else if (cleaned.startsWith('9')) {
                cleaned = '0' + cleaned;
                cleaned = cleaned.substring(0, 11);
            } else if (cleaned.startsWith('+6')) {
                cleaned = cleaned.substring(0, 13);
            } else if (cleaned.startsWith('63') && cleaned.length > 2) {
                cleaned = '+' + cleaned;
                cleaned = cleaned.substring(0, 13);
            } else {
                cleaned = cleaned.substring(0, 11);
            }
            
            processedValue = cleaned;
        }
        else if (id === 'purok') {
            processedValue = value.toUpperCase();
        }
        else if (id === 'password' || id === 'confirm-password' || id === 'email' || id === 'status') {
            // Don't uppercase password, email, or status fields
            processedValue = value;
        }
        else {
            processedValue = value.toUpperCase();
        }
        
        setFormData(prev => ({
            ...prev,
            [stateKey]: processedValue
        }));
        
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
        if (!formData.last_name) newErrors['last-name'] = "Last name is required";
        if (!formData.email) newErrors['email'] = "Email is required";
        
        // Phone validation
        if (!formData.contact_number) {
            newErrors['contact-number'] = "Contact number is required";
        } else {
            const phone = formData.contact_number;
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
        
        // Password complexity validation (only if password is provided)
        if (formData.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;
            
            if (formData.password.length < 8) {
                newErrors['password'] = "Password must be at least 8 characters";
            } else if (!passwordRegex.test(formData.password)) {
                newErrors['password'] = "Password must contain uppercase, lowercase, number, and special character";
            }
            
            if (formData.password !== formData.password_confirmation) {
                newErrors['confirm-password'] = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare update data (exclude password if empty)
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.password_confirmation;
            }

            const response = await clientService.updateClient(client.id, updateData);
            
            if (response.success) {
                toast.success("Client updated successfully!", {
                    description: `${formData.first_name} ${formData.last_name} has been updated.`
                });
                resetForm();
                setIsOpen(false);
                
                if (onClientUpdated) {
                    onClientUpdated();
                }
            }
        } catch (error) {
            console.error("Error updating client:", error);
            
            if (error.response?.data?.errors) {
                const backendErrors = {};
                const errorMessages = [];
                
                Object.keys(error.response.data.errors).forEach(key => {
                    const formattedKey = key.replace(/_/g, '-');
                    backendErrors[formattedKey] = error.response.data.errors[key][0];
                    errorMessages.push(error.response.data.errors[key][0]);
                });
                
                setErrors(backendErrors);
                toast.error("Validation Error", {
                    description: errorMessages[0]
                });
            } else if (error.response?.data?.message) {
                toast.error("Error", {
                    description: error.response.data.message
                });
            } else {
                toast.error("Failed to update client. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription>
                        Update client information. Leave password empty to keep current password.
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
                                Client ID cannot be changed
                            </p>
                            {errors['client-id'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['client-id']}</p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="organization">Organization</FieldLabel>
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
                                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="first-name"
                                        type="text"
                                        placeholder="Enter First Name"
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
                                        placeholder="Enter Middle Name"
                                        value={formData.middle_name}
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="last-name"
                                        type="text"
                                        placeholder="Enter Last Name"
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
                                <FieldLabel htmlFor="suffix">
                                    Suffix (Optional)
                                </FieldLabel>
                                <Select
                                    value={formData.suffix}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            suffix: value === "none" ? "" : value
                                        }));
                                    }}
                                >
                                    <SelectTrigger id="suffix">
                                        <SelectValue placeholder="Select suffix" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="Jr.">Jr.</SelectItem>
                                        <SelectItem value="Sr.">Sr.</SelectItem>
                                        <SelectItem value="II">II</SelectItem>
                                        <SelectItem value="III">III</SelectItem>
                                        <SelectItem value="IV">IV</SelectItem>
                                        <SelectItem value="V">V</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select name suffix if applicable
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="email"
                                        type="email"
                                        placeholder="Enter Email"
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

                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="contact-number">Contact Number</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="contact-number"
                                        type="tel"
                                        placeholder="+63 or 09 format"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        maxLength={13}
                                        required
                                    />
                                </InputGroup>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Format: +63XXXXXXXXXX or 09XXXXXXXXX
                                </p>
                                {errors['contact-number'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['contact-number']}</p>
                                )}
                            </Field>
                        </FieldGroup>

                        {/* Address Selector */}
                        <AddressSelector
                            values={{
                                region: formData.region,
                                province: formData.province,
                                municipality: formData.municipality,
                                barangay: formData.barangay
                            }}
                            onChange={({region, province, municipality, barangay}) => {
                                setFormData(prev => ({
                                    ...prev,
                                    region,
                                    province,
                                    municipality,
                                    barangay
                                }));
                                setErrors(prev => ({
                                    ...prev,
                                    region: undefined,
                                    province: undefined,
                                    municipality: undefined,
                                    barangay: undefined
                                }));
                            }}
                            errors={{
                                region: errors['region'],
                                province: errors['province'],
                                municipality: errors['municipality'],
                                barangay: errors['brgy']
                            }}
                        />

                        <Field>
                            <FieldLabel htmlFor="purok">
                                Purok/Street (Optional)
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="purok"
                                    type="text"
                                    placeholder="PUROK 1 or STREET NAME"
                                    value={formData.purok}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter purok or street address
                            </p>
                        </Field>

                        {/* Status Field */}
                        <Field>
                            <FieldLabel htmlFor="status">Account Status</FieldLabel>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#016146] focus:border-transparent"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Inactive clients cannot make new requests
                            </p>
                            {errors['status'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['status']}</p>
                            )}
                        </Field>

                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="bg-[#016146] hover:bg-[#014d38]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Pencil />
                                    Update Client
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditClient;
