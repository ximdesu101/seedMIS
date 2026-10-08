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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pencil,
    Loader2,
} from "lucide-react";
import customerService from "@/services/customerService";
import { toast } from "sonner";

const EditCustomer = ({ customer, onCustomerUpdated, trigger }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    
    const [formData, setFormData] = React.useState({
        customer_id: "",
        organization: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        barangay: "",
        municipality: "",
        province: "",
        status: "",
    });

    // Load customer data when dialog opens
    React.useEffect(() => {
        if (isOpen && customer) {
            setFormData({
                customer_id: customer.customer_id || "",
                organization: customer.organization || "",
                first_name: customer.first_name || "",
                middle_name: customer.middle_name || "",
                last_name: customer.last_name || "",
                email: customer.email || "",
                contact_number: customer.contact_number || "",
                barangay: customer.barangay || "",
                municipality: customer.municipality || "",
                province: customer.province || "",
                status: customer.status || "Active",
            });
        }
    }, [isOpen, customer]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        const fieldMapping = {
            'customer-id': 'customer_id',
            'organization': 'organization',
            'first-name': 'first_name',
            'middle-name': 'middle_name',
            'last-name': 'last_name',
            'email': 'email',
            'contact-number': 'contact_number',
            'brgy': 'barangay',
            'municipality': 'municipality',
            'province': 'province',
            'status': 'status',
        };
        
        const stateKey = fieldMapping[id] || id;
        
        let processedValue = value;
        
        if (id === 'first-name' || id === 'middle-name' || id === 'last-name') {
            processedValue = value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
        } else if (id === 'contact-number') {
            let cleaned = value.replace(/[^\d+]/g, '');
            
            if (cleaned.startsWith('+63')) {
                cleaned = cleaned.substring(0, 13);
            } else if (cleaned.startsWith('09')) {
                cleaned = cleaned.substring(0, 11);
            } else if (cleaned.startsWith('9')) {
                cleaned = '0' + cleaned;
                cleaned = cleaned.substring(0, 11);
            } else {
                cleaned = cleaned.substring(0, 11);
            }
            
            processedValue = cleaned;
        } else if (id === 'email' || id === 'status') {
            processedValue = value;
        } else {
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
        
        if (!formData.customer_id) newErrors['customer-id'] = "Customer ID is required";
        if (!formData.first_name) newErrors['first-name'] = "First name is required";
        if (!formData.last_name) newErrors['last-name'] = "Last name is required";
        if (!formData.email) newErrors['email'] = "Email is required";
        
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
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
            const response = await customerService.updateCustomer(customer.id, formData);
            
            if (response.success) {
                toast.success("Customer updated successfully!", {
                    description: `${formData.first_name} ${formData.last_name} has been updated.`
                });
                resetForm();
                setIsOpen(false);
                
                if (onCustomerUpdated) {
                    onCustomerUpdated();
                }
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            
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
                toast.error("Failed to update customer. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent
                className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                    <DialogDescription>
                        Update customer information.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="customer-id">Customer ID</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="customer-id"
                                    type="text"
                                    placeholder="CUST-0001"
                                    value={formData.customer_id}
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    required
                                />
                            </InputGroup>
                            <p className="text-xs text-muted-foreground mt-1">
                                Customer ID cannot be changed
                            </p>
                            {errors['customer-id'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['customer-id']}</p>
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
                                />
                            </InputGroup>
                        </Field>

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    Middle Name
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
                        </FieldGroup>

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <Field>
                                <FieldLabel htmlFor="status">Account Status</FieldLabel>
                                <Select value={formData.status} onValueChange={(value) => {
                                    setFormData(prev => ({...prev, status: value}));
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

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
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="bg-[#016146]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Pencil />
                                    Update Customer
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCustomer;
