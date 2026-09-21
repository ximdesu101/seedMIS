import * as React from "react";
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
        email: "",
        contact_number: "",
        barangay: "",
        municipality: "",
        province: "",
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
                email: client.email || "",
                contact_number: client.contact_number || "",
                barangay: client.barangay || "",
                municipality: client.municipality || "",
                province: client.province || "",
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
            'email': 'email',
            'contact-number': 'contact_number',
            'brgy': 'barangay',
            'municipality': 'municipality',
            'province': 'province',
            'password': 'password',
            'confirm-password': 'password_confirmation'
        };
        
        const stateKey = fieldMapping[id] || id;
        
        let processedValue = value;
        
        if (id === 'contact-number') {
            processedValue = value.replace(/\D/g, '');
        } 
        else if (id === 'password' || id === 'confirm-password' || id === 'email') {
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
        if (!formData.contact_number) newErrors['contact-number'] = "Contact number is required";
        if (!formData.barangay) newErrors['brgy'] = "Barangay is required";
        if (!formData.municipality) newErrors['municipality'] = "Municipality is required";
        if (!formData.province) newErrors['province'] = "Province is required";
        
        // Password is optional for update
        if (formData.password && formData.password.length < 8) {
            newErrors['password'] = "Password must be at least 8 characters";
        }
        if (formData.password && formData.password !== formData.password_confirmation) {
            newErrors['confirm-password'] = "Passwords do not match";
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
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
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
                                    Middle Name <span className="text-gray-400 text-sm">(Optional)</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="middle-name"
                                        type="text"
                                        placeholder="JANE"
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

                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="contact-number">Contact Number</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="contact-number"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="09123456789"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['contact-number'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['contact-number']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="brgy">Barangay</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="brgy"
                                        type="text"
                                        placeholder="SAMPLE BARANGAY"
                                        value={formData.barangay}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['brgy'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['brgy']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="municipality">Municipality</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="municipality"
                                        type="text"
                                        placeholder="SAMPLE MUNICIPALITY"
                                        value={formData.municipality}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['municipality'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['municipality']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="province">Province</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="province"
                                        type="text"
                                        placeholder="SAMPLE PROVINCE"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['province'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['province']}</p>
                                )}
                            </Field>
                        </FieldGroup>

                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password <span className="text-gray-400 text-sm">(Leave empty to keep current)</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors['password'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['password']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((value) => !value)}
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors['confirm-password'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['confirm-password']}</p>
                                )}
                            </Field>
                        </FieldGroup>
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
