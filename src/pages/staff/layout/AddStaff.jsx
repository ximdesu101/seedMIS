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
    CirclePlus,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import staffService from "@/services/staffService";
import { toast } from "sonner";

const AddStaff = ({ onStaffAdded }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    
    const [formData, setFormData] = React.useState({
        staff_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        position: "",
        contact_number: "",
        barangay: "",
        municipality: "",
        province: "",
        password: "",
        password_confirmation: "",
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        
        // Map field IDs to state keys
        const fieldMapping = {
            'staff-id': 'staff_id',
            'first-name': 'first_name',
            'middle-name': 'middle_name',
            'last-name': 'last_name',
            'email': 'email',
            'position': 'position',
            'contact-number': 'contact_number',
            'brgy': 'barangay',
            'municipality': 'municipality',
            'province': 'province',
            'password': 'password',
            'confirm-password': 'password_confirmation'
        };
        
        const stateKey = fieldMapping[id] || id;
        
        let processedValue = value;
        
        // For contact number, only allow numbers
        if (id === 'contact-number') {
            processedValue = value.replace(/\D/g, '');
        } 
        // For password fields and email, keep as is (case-sensitive)
        else if (id === 'password' || id === 'confirm-password' || id === 'email') {
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
        
        if (!formData.staff_id) newErrors['staff-id'] = "Staff ID is required";
        if (!formData.first_name) newErrors['first-name'] = "First name is required";
        // middle_name is optional - no validation needed
        if (!formData.last_name) newErrors['last-name'] = "Last name is required";
        if (!formData.email) newErrors['email'] = "Email is required";
        if (!formData.position) newErrors['position'] = "Position is required";
        if (!formData.contact_number) newErrors['contact-number'] = "Contact number is required";
        if (!formData.barangay) newErrors['brgy'] = "Barangay is required";
        if (!formData.municipality) newErrors['municipality'] = "Municipality is required";
        if (!formData.province) newErrors['province'] = "Province is required";
        if (!formData.password) newErrors['password'] = "Password is required";
        if (formData.password.length < 8) newErrors['password'] = "Password must be at least 8 characters";
        if (!formData.password_confirmation) newErrors['confirm-password'] = "Confirm password is required";
        if (formData.password !== formData.password_confirmation) {
            newErrors['confirm-password'] = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            staff_id: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            position: "",
            contact_number: "",
            barangay: "",
            municipality: "",
            province: "",
            password: "",
            password_confirmation: "",
        });
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
            const response = await staffService.createStaff(formData);
            
            if (response.success) {
                toast.success("Staff added successfully!", {
                    description: `${formData.first_name} ${formData.last_name} has been added to the system.`
                });
                resetForm();
                setIsOpen(false);
                
                // Call the callback to refresh the staff list
                if (onStaffAdded) {
                    onStaffAdded();
                }
            }
        } catch (error) {
            console.error("Error adding staff:", error);
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
                toast.error("Failed to add staff. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#016146]">
                    <CirclePlus />
                    Add Staff
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>New Staff Member</DialogTitle>
                    <DialogDescription>
                        Add a new staff member and enter their details.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="staff-id">Staff ID</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="staff-id"
                                    type="text"
                                    placeholder="STF-0001"
                                    value={formData.staff_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
                            {errors['staff-id'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['staff-id']}</p>
                            )}
                        </Field>

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </FieldGroup>

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="position">
                                    Position
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="position"
                                        type="text"
                                        placeholder="SALES ASSOCIATE"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </InputGroup>
                                {errors['position'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['position']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="contact-number">
                                    Contact Number
                                </FieldLabel>
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
                        </FieldGroup>

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <FieldLabel htmlFor="municipality">
                                    Municipality
                                </FieldLabel>
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
                                <FieldLabel htmlFor="province">
                                    Province
                                </FieldLabel>
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

                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((value) => !value)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors['password'] && (
                                    <p className="text-red-500 text-sm mt-1">{errors['password']}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (value) => !value
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
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
                            className="bg-[#016146]"
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
                                    Add Staff
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddStaff;    