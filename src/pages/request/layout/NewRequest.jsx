import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "cn";
import { format } from "date-fns";
import requestService from "@/services/requestService";
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
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    CirclePlus,
    Calendar as CalendarIcon,
    Loader2,
    Search,
    User,
} from "lucide-react";
import { toast } from "sonner";

const NewRequest = ({ onRequestAdded }) => {
    const [requestedDate, setRequestedDate] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    
    // User search states
    const [userSearch, setUserSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showResults, setShowResults] = useState(false);
    
    // Available seedlings from inventory
    const [availableSeedlings, setAvailableSeedlings] = useState([]);
    const [selectedSeedling, setSelectedSeedling] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    const [formData, setFormData] = useState({
        client_id: "",
        seedling_type: "",
        quantity: "",
        purpose: "",
    });
    
    // Fetch available seedlings when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchAvailableSeedlings();
        }
    }, [isOpen]);

    // Fetch available seedlings from inventory
    const fetchAvailableSeedlings = async () => {
        try {
            const response = await requestService.getAvailableSeedlings();
            if (response.success) {
                setAvailableSeedlings(response.data);
            }
        } catch (error) {
            console.error("Error fetching available seedlings:", error);
            toast.error("Error loading available seedlings");
        }
    };

    // Search users from database
    const searchUsers = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await requestService.searchUsers(searchTerm);
            setSearchResults(response.data || []);
            setShowResults(true);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
            toast.error("Error searching users. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce search
    useEffect(() => {
        // Don't search if user is already selected
        if (selectedUser) {
            return;
        }

        const timer = setTimeout(() => {
            searchUsers(userSearch);
        }, 500);

        return () => clearTimeout(timer);
    }, [userSearch, selectedUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUserSearch(`${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`);
        setFormData(prev => ({
            ...prev,
            client_id: user.id
        }));
        setShowResults(false);
        setSearchResults([]); // Clear search results after selection
        
        // Recalculate price if seedling and quantity are already selected
        if (selectedSeedling && formData.quantity) {
            calculatePrice(user.organization, selectedSeedling.price_per_unit, formData.quantity);
        }
        
        // Clear error if exists
        if (errors.client_id) {
            setErrors(prev => ({
                ...prev,
                client_id: undefined
            }));
        }
    };

    // Handle when user types in search (clear selected user if they're editing)
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setUserSearch(value);
        
        // If user is editing the search, clear the selected user
        if (selectedUser && value !== `${selectedUser.first_name} ${selectedUser.middle_name ? selectedUser.middle_name + ' ' : ''}${selectedUser.last_name}`) {
            setSelectedUser(null);
            setFormData(prev => ({
                ...prev,
                client_id: ""
            }));
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        let processedValue = value;

        // For quantity, handled separately
        if (id === "quantity") {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [id]: processedValue,
        }));

        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: undefined,
            }));
        }
    };

    // Calculate price based on organization type
    const calculatePrice = (organization, pricePerUnit, quantity) => {
        if (!organization || !pricePerUnit || !quantity) {
            setCalculatedPrice(0);
            return;
        }

        // Check if organization is LGU (case insensitive)
        const isLGU = organization.toUpperCase().includes('LGU');
        
        if (isLGU) {
            setCalculatedPrice(0); // Free for LGU
        } else {
            const total = parseFloat(pricePerUnit) * parseInt(quantity);
            setCalculatedPrice(total);
        }
    };

    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        
        // If seedling type changes, find the seedling and calculate price
        if (field === 'seedling_type') {
            const seedling = availableSeedlings.find(s => s.seedling_type === value);
            setSelectedSeedling(seedling);
            
            // Recalculate price if quantity and user exists
            if (formData.quantity && seedling && selectedUser) {
                calculatePrice(selectedUser.organization, seedling.price_per_unit, formData.quantity);
            }
        }

        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };
    
    const handleQuantityChange = (e) => {
        const { value } = e.target;
        // Only allow positive numbers
        const processedValue = value.replace(/\D/g, "");
        
        setFormData((prev) => ({
            ...prev,
            quantity: processedValue,
        }));
        
        // Recalculate price when quantity changes
        if (selectedSeedling && processedValue && selectedUser) {
            calculatePrice(selectedUser.organization, selectedSeedling.price_per_unit, processedValue);
        } else {
            setCalculatedPrice(0);
        }
        
        // Clear error
        if (errors.quantity) {
            setErrors((prev) => ({
                ...prev,
                quantity: undefined,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.client_id) newErrors.client_id = "Please select a user";
        if (!formData.seedling_type) newErrors.seedling_type = "Seedling type is required";
        if (!formData.quantity) newErrors.quantity = "Quantity is required";
        if (parseInt(formData.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0";
        
        // Check if quantity exceeds available stock
        if (selectedSeedling && parseInt(formData.quantity) > selectedSeedling.total_quantity) {
            newErrors.quantity = `Only ${selectedSeedling.total_quantity} available in stock`;
        }
        
        if (!formData.purpose) newErrors.purpose = "Purpose is required";
        if (!requestedDate) newErrors.requested_date = "Requested date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            client_id: "",
            seedling_type: "",
            quantity: "",
            purpose: "",
        });
        setRequestedDate(undefined);
        setErrors({});
        setUserSearch("");
        setSelectedUser(null);
        setSearchResults([]);
        setShowResults(false);
        setSelectedSeedling(null);
        setCalculatedPrice(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get logged-in user info
            const userType = localStorage.getItem('userType');
            const user = JSON.parse(localStorage.getItem('user'));

            // Prepare request data
            const requestData = {
                client_id: formData.client_id,
                seedling_type: formData.seedling_type,
                quantity: parseInt(formData.quantity),
                purpose: formData.purpose,
                contact_number: selectedUser?.contact_number || "",
                requested_date: requestedDate ? format(requestedDate, "yyyy-MM-dd") : null,
                created_by_user_type: userType,
                created_by_user_id: String(user.id), // Convert to string (admin: number, staff: varchar)
            };

            const response = await requestService.createRequest(requestData);

            if (response.success) {
                const isAutoApproved = userType === 'admin' || userType === 'staff';
                
                toast.success(
                    isAutoApproved ? "Request created and auto-approved!" : "Request submitted successfully!",
                    {
                        description: isAutoApproved 
                            ? `Request for ${formData.quantity} ${formData.seedling_type} seedlings has been automatically approved.`
                            : `Request for ${formData.quantity} ${formData.seedling_type} seedlings has been submitted.`,
                    }
                );

                resetForm();
                setIsOpen(false);

                // Call the callback to refresh the request list
                if (onRequestAdded) {
                    onRequestAdded();
                }
            }
        } catch (error) {
            console.error("Error submitting request:", error);

            if (error.response?.data?.errors) {
                // Handle validation errors from backend
                const backendErrors = {};
                const errorMessages = [];

                Object.keys(error.response.data.errors).forEach((key) => {
                    backendErrors[key] = error.response.data.errors[key][0];
                    errorMessages.push(error.response.data.errors[key][0]);
                });

                setErrors(backendErrors);

                // Show first error in toast
                toast.error("Validation Error", {
                    description: errorMessages[0],
                });
            } else if (error.response?.data?.message) {
                toast.error("Error", {
                    description: error.response.data.message,
                });
            } else if (error.message) {
                toast.error("Network Error", {
                    description: "Unable to submit request. Please try again.",
                });
            } else {
                toast.error("Failed to submit request. Please try again.");
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
                    New Request
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-[90vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>New Seedling Request</DialogTitle>
                    <DialogDescription>
                        Submit a new seedling request and provide the required details.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-4">
                        {/* User Search Field */}
                        <Field>
                            <FieldLabel htmlFor="user_search">
                                Search User <span className="text-red-500">*</span>
                            </FieldLabel>
                            <div className="relative">
                                <InputGroup>
                                    <InputGroupInput
                                        id="user_search"
                                        type="text"
                                        placeholder="Search by name..."
                                        value={userSearch}
                                        onChange={handleSearchInputChange}
                                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                        autoComplete="off"
                                    />
                                    <InputGroupAddon>
                                        {isSearching ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Search className="h-4 w-4" />
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>
                                
                                {/* Search Results Dropdown */}
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user.id}
                                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {user.first_name} {user.middle_name ? user.middle_name + ' ' : ''}{user.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                        {user.organization && (
                                                            <p className="text-xs text-gray-400">{user.organization}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {showResults && searchResults.length === 0 && userSearch.length >= 2 && !isSearching && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg p-4">
                                        <p className="text-sm text-gray-500 text-center">No users found</p>
                                    </div>
                                )}
                            </div>
                            {errors.client_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.client_id}
                                </p>
                            )}
                        </Field>

                        {/* Selected User Display - Client Information */}
                        {selectedUser && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <h3 className="text-sm font-semibold text-green-900 mb-3">Client Information</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-green-600 mb-1">Full Name</p>
                                        <p className="text-sm font-medium text-green-900">
                                            {selectedUser.first_name} {selectedUser.middle_name ? selectedUser.middle_name + ' ' : ''}{selectedUser.last_name}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-green-600 mb-1">Email Address</p>
                                        <p className="text-sm font-medium text-green-900">{selectedUser.email}</p>
                                    </div>
                                    
                                    {selectedUser.organization && (
                                        <div>
                                            <p className="text-xs text-green-600 mb-1">Organization</p>
                                            <p className="text-sm font-medium text-green-900">{selectedUser.organization}</p>
                                        </div>
                                    )}
                                    
                                    {selectedUser.contact_number && (
                                        <div>
                                            <p className="text-xs text-green-600 mb-1">Contact Number</p>
                                            <p className="text-sm font-medium text-green-900">{selectedUser.contact_number}</p>
                                        </div>
                                    )}
                                    
                                    {selectedUser.barangay && (
                                        <>
                                            <div>
                                                <p className="text-xs text-green-600 mb-1">Barangay</p>
                                                <p className="text-sm font-medium text-green-900">{selectedUser.barangay}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs text-green-600 mb-1">Municipality</p>
                                                <p className="text-sm font-medium text-green-900">{selectedUser.municipality || 'N/A'}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs text-green-600 mb-1">Province</p>
                                                <p className="text-sm font-medium text-green-900">{selectedUser.province || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="seedling_type">
                                    Seedling Type <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                    value={formData.seedling_type}
                                    onValueChange={(value) =>
                                        handleSelectChange("seedling_type", value)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select seedling type" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {availableSeedlings.length > 0 ? (
                                            availableSeedlings.map((seedling) => (
                                                <SelectItem key={seedling.id} value={seedling.seedling_type}>
                                                    {seedling.seedling_type} - ₱{parseFloat(seedling.price_per_unit).toFixed(2)} ({seedling.total_quantity} available)
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>
                                                No seedlings available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.seedling_type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.seedling_type}
                                    </p>
                                )}
                                {selectedSeedling && (
                                    <p className="text-xs text-green-600 mt-1">
                                        Price per unit: ₱{parseFloat(selectedSeedling.price_per_unit).toFixed(2)} | Available: {selectedSeedling.total_quantity}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="quantity">
                                    Quantity <span className="text-red-500">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="quantity"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={handleQuantityChange}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                                                e.preventDefault();
                                            }
                                        }}
                                        required
                                    />
                                </InputGroup>
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.quantity}
                                    </p>
                                )}
                            </Field>
                        </FieldGroup>

                        {/* Total Price Display */}
                        {selectedUser && formData.quantity && selectedSeedling && (
                            <div className={`p-4 border rounded-md ${
                                selectedUser.organization?.toUpperCase().includes('LGU')
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-green-50 border-green-200'
                            }`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-medium ${
                                        selectedUser.organization?.toUpperCase().includes('LGU')
                                            ? 'text-blue-900'
                                            : 'text-green-900'
                                    }`}>
                                        Total Price to Pay:
                                    </span>
                                    <span className={`text-2xl font-bold ${
                                        selectedUser.organization?.toUpperCase().includes('LGU')
                                            ? 'text-blue-700'
                                            : 'text-green-700'
                                    }`}>
                                        {selectedUser.organization?.toUpperCase().includes('LGU') ? (
                                            <span className="flex items-center gap-2">
                                                <span className="text-lg">FREE</span>
                                                <span className="text-sm font-normal">(LGU)</span>
                                            </span>
                                        ) : (
                                            `₱${calculatedPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        )}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 ${
                                    selectedUser.organization?.toUpperCase().includes('LGU')
                                        ? 'text-blue-600'
                                        : 'text-green-600'
                                }`}>
                                    {selectedUser.organization?.toUpperCase().includes('LGU') ? (
                                        `${formData.quantity} pcs - Free for LGU organizations`
                                    ) : (
                                        `${formData.quantity} pcs × ₱${selectedSeedling?.price_per_unit}`
                                    )}
                                </p>
                            </div>
                        )}

                        <Field>
                            <FieldLabel htmlFor="purpose">
                                Purpose <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Textarea
                                id="purpose"
                                placeholder="Describe the purpose of this request (e.g., Community Reforestation, School Greening Program)"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                className="min-h-[100px]"
                                required
                            />
                            {errors.purpose && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.purpose}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="requested_date">
                                Requested Date <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="requested_date"
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between text-left font-normal",
                                            !requestedDate && "text-muted-foreground"
                                        )}
                                    >
                                        {requestedDate
                                            ? format(requestedDate, "PPP")
                                            : "Pick a date"}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={requestedDate}
                                        onSelect={setRequestedDate}
                                        disabled={(date) => {
                                            // Disable past dates (before today)
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            if (date < today) return true;
                                            
                                            // Disable weekends (Saturday = 6, Sunday = 0)
                                            const dayOfWeek = date.getDay();
                                            return dayOfWeek === 0 || dayOfWeek === 6;
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.requested_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.requested_date}
                                </p>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                disabled={isSubmitting}
                            >
                                Cancel
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
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CirclePlus />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewRequest;
