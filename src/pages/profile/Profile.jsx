import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordStrength } from "@/components/ui/password-strength";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    User,
    Mail,
    Phone,
    Building2,
    Shield,
    Calendar,
    Edit,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
    MapPin,
    Loader2,
} from "lucide-react";
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
import { toast } from "sonner";
import authService from "@/services/authService";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [profileForm, setProfileForm] = useState({
        // Admin fields
        name: '',
        email: '',
        
        // Staff fields
        first_name: '',
        middle_name: '',
        last_name: '',
        position: '',
        contact_number: '',
        barangay: '',
        municipality: '',
        province: '',
    });
    
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoadingProfile(true);
            const storedUser = localStorage.getItem('user');
            const userType = localStorage.getItem('userType');
            
            if (!storedUser || !userType) {
                toast.error("Session Error", {
                    description: "Please login again."
                });
                return;
            }

            const userData = JSON.parse(storedUser);
            const response = await authService.getProfile(userData.id, userType);
            
            if (response.success) {
                const profileData = response.data;
                setUser(profileData);
                
                // Set form data based on user type
                if (profileData.user_type === 'admin') {
                    setProfileForm({
                        name: profileData.name || '',
                        email: profileData.email || '',
                        first_name: '',
                        middle_name: '',
                        last_name: '',
                        position: '',
                        contact_number: '',
                        barangay: '',
                        municipality: '',
                        province: '',
                    });
                } else {
                    setProfileForm({
                        name: '',
                        email: profileData.email || '',
                        first_name: profileData.first_name || '',
                        middle_name: profileData.middle_name || '',
                        last_name: profileData.last_name || '',
                        position: profileData.position || '',
                        contact_number: profileData.contact_number || '',
                        barangay: profileData.barangay || '',
                        municipality: profileData.municipality || '',
                        province: profileData.province || '',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error("Failed to load profile", {
                description: "Could not fetch your profile data."
            });
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleProfileInputChange = (e) => {
        const { id, value } = e.target;
        
        let processedValue = value;
        
        // For contact number, only allow numbers
        if (id === 'contact_number') {
            processedValue = value.replace(/\D/g, '');
        } 
        // For email, keep as is (case-sensitive)
        else if (id === 'email') {
            processedValue = value;
        }
        // For all other text fields, convert to uppercase
        else {
            processedValue = value.toUpperCase();
        }
        
        setProfileForm(prev => ({
            ...prev,
            [id]: processedValue
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { id, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setIsSavingProfile(true);
            
            const updateData = user.user_type === 'admin' 
                ? { name: profileForm.name, email: profileForm.email }
                : {
                    first_name: profileForm.first_name,
                    middle_name: profileForm.middle_name,
                    last_name: profileForm.last_name,
                    email: profileForm.email,
                    position: profileForm.position,
                    contact_number: profileForm.contact_number,
                    barangay: profileForm.barangay,
                    municipality: profileForm.municipality,
                    province: profileForm.province,
                };
            
            const response = await authService.updateProfile(user.id, user.user_type, updateData);
            
            if (response.success) {
                setUser(response.data);
                
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                
                setIsEditDialogOpen(false);
                toast.success("Profile Updated", {
                    description: "Your profile information has been updated successfully."
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Update Failed", {
                description: error.response?.data?.message || "Failed to update profile. Please try again."
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset form to current user data
        if (user.user_type === 'admin') {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                first_name: '',
                middle_name: '',
                last_name: '',
                position: '',
                contact_number: '',
                barangay: '',
                municipality: '',
                province: '',
            });
        } else {
            setProfileForm({
                name: '',
                email: user.email || '',
                first_name: user.first_name || '',
                middle_name: user.middle_name || '',
                last_name: user.last_name || '',
                position: user.position || '',
                contact_number: user.contact_number || '',
                barangay: user.barangay || '',
                municipality: user.municipality || '',
                province: user.province || '',
            });
        }
        setIsEditDialogOpen(false);
    };

    const handleOpenEditDialog = () => {
        // Load current user data into form
        if (user.user_type === 'admin') {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                first_name: '',
                middle_name: '',
                last_name: '',
                position: '',
                contact_number: '',
                barangay: '',
                municipality: '',
                province: '',
            });
        } else {
            setProfileForm({
                name: '',
                email: user.email || '',
                first_name: user.first_name || '',
                middle_name: user.middle_name || '',
                last_name: user.last_name || '',
                position: user.position || '',
                contact_number: user.contact_number || '',
                barangay: user.barangay || '',
                municipality: user.municipality || '',
                province: user.province || '',
            });
        }
        setIsEditDialogOpen(true);
    };

    const handleChangePassword = async () => {
        // Validation
        if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
            toast.error("Validation Error", {
                description: "Please fill in all password fields."
            });
            return;
        }

        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            toast.error("Password Mismatch", {
                description: "New password and confirm password do not match."
            });
            return;
        }

        // Password complexity validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;
        
        if (passwordForm.new_password.length < 8) {
            toast.error("Weak Password", {
                description: "Password must be at least 8 characters long."
            });
            return;
        }

        if (!passwordRegex.test(passwordForm.new_password)) {
            toast.error("Password Complexity Required", {
                description: "Password must contain uppercase, lowercase, number, and special character (@$!%*?&#)."
            });
            return;
        }

        try {
            setIsChangingPassword(true);
            
            const response = await authService.changePassword(
                user.id,
                user.user_type,
                {
                    current_password: passwordForm.current_password,
                    new_password: passwordForm.new_password,
                    new_password_confirmation: passwordForm.new_password_confirmation
                }
            );
            
            if (response.success) {
                toast.success("Password Changed", {
                    description: "Your password has been changed successfully."
                });
                
                // Reset form
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error("Change Password Failed", {
                description: error.response?.data?.message || "Failed to change password. Please try again."
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'admin': 'bg-purple-50 text-purple-700 ring-purple-600/20',
            'staff': 'bg-blue-50 text-blue-700 ring-blue-600/20',
        };
        
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${roleColors[role?.toLowerCase()] || 'bg-gray-50 text-gray-700'}`}>
                <Shield className="h-3 w-3 mr-1" />
                {role?.toUpperCase() || 'USER'}
            </span>
        );
    };

    if (isLoadingProfile) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#016146] mx-auto" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <p className="text-muted-foreground">No profile data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information and security</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    {/* Profile Overview Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Profile Overview</CardTitle>
                                    <CardDescription>Your personal information and role</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getRoleBadge(user.user_type)}
                                    <Button onClick={handleOpenEditDialog} className="bg-[#016146]">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <p className="text-muted-foreground">{user.email}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        {user.user_type === 'staff' && user.staff_id && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Staff ID:</span>
                                                <span className="font-semibold">{user.staff_id}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600">Type:</span>
                                            <span className="font-semibold capitalize">{user.user_type}</span>
                                        </div>
                                        
                                        {user.contact_number && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Contact:</span>
                                                <span className="font-semibold">{user.contact_number}</span>
                                            </div>
                                        )}

                                        {user.position && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Position:</span>
                                                <span className="font-semibold">{user.position}</span>
                                            </div>
                                        )}

                                        {user.role && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Role:</span>
                                                <span className="font-semibold capitalize">{user.role}</span>
                                            </div>
                                        )}

                                        {user.user_type === 'staff' && user.status && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        )}

                                        {(user.barangay || user.municipality || user.province) && (
                                            <div className="flex items-center gap-2 text-sm col-span-2">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Address:</span>
                                                <span className="font-semibold">
                                                    {[user.barangay, user.municipality, user.province].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600">Member Since:</span>
                                            <span className="font-semibold">{formatDate(user.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Profile Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent 
                            className="w-[90vw] !max-w-4xl sm:!max-w-4xl max-h-[90vh] overflow-y-auto"
                            onInteractOutside={(e) => e.preventDefault()}
                        >
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Update your personal information
                                </DialogDescription>
                            </DialogHeader>

                            <Separator />

                            <div className="py-2">
                                {user.user_type === 'admin' ? (
                                    <FieldGroup className="gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="name"
                                                    type="text"
                                                    placeholder="JOHN DOE"
                                                    value={profileForm.name}
                                                    onChange={handleProfileInputChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="email"
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={profileForm.email}
                                                    onChange={handleProfileInputChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Field>
                                    </FieldGroup>
                                ) : (
                                    <FieldGroup className="gap-4">
                                        <FieldGroup className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="first_name"
                                                        type="text"
                                                        placeholder="JOHN"
                                                        value={profileForm.first_name}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="middle_name">
                                                    Middle Name <span className="text-gray-400 text-sm">(Optional)</span>
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="middle_name"
                                                        type="text"
                                                        placeholder="MICHAEL"
                                                        value={profileForm.middle_name}
                                                        onChange={handleProfileInputChange}
                                                    />
                                                </InputGroup>
                                            </Field>
                                        </FieldGroup>

                                        <Field>
                                            <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="last_name"
                                                    type="text"
                                                    placeholder="DOE"
                                                    value={profileForm.last_name}
                                                    onChange={handleProfileInputChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="email"
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={profileForm.email}
                                                    onChange={handleProfileInputChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Field>

                                        <FieldGroup className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="position">Position</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="position"
                                                        type="text"
                                                        placeholder="MANAGER"
                                                        value={profileForm.position}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="contact_number">Contact Number</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="contact_number"
                                                        type="tel"
                                                        inputMode="numeric"
                                                        placeholder="09123456789"
                                                        value={profileForm.contact_number}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>
                                        </FieldGroup>

                                        {/* Status Field - Readonly for Staff */}
                                        <Field>
                                            <FieldLabel htmlFor="status">Account Status</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="status"
                                                    type="text"
                                                    value={user?.status || 'Active'}
                                                    readOnly
                                                    className="bg-gray-50 cursor-not-allowed"
                                                />
                                            </InputGroup>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Contact administrator to change account status
                                            </p>
                                        </Field>

                                        <Separator className="my-2" />

                                        <div className="space-y-1 mb-3">
                                            <h4 className="text-sm font-semibold">Address Information</h4>
                                            <p className="text-xs text-muted-foreground">Complete address details</p>
                                        </div>

                                        <FieldGroup className="grid grid-cols-3 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="barangay">Barangay</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="barangay"
                                                        type="text"
                                                        placeholder="BARANGAY"
                                                        value={profileForm.barangay}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="municipality">Municipality</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="municipality"
                                                        type="text"
                                                        placeholder="MUNICIPALITY"
                                                        value={profileForm.municipality}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="province">Province</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="province"
                                                        type="text"
                                                        placeholder="PROVINCE"
                                                        value={profileForm.province}
                                                        onChange={handleProfileInputChange}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Field>
                                        </FieldGroup>
                                    </FieldGroup>
                                )}
                            </div>

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleCancelEdit}
                                        disabled={isSavingProfile}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button 
                                    onClick={handleSaveProfile} 
                                    className="bg-[#016146] hover:bg-[#014d38]" 
                                    disabled={isSavingProfile}
                                >
                                    {isSavingProfile ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password to keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="current_password"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordForm.current_password}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Enter current password"
                                        />
                                        <InputGroupAddon 
                                            className="cursor-pointer"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPasswords.current ? <EyeOff /> : <Eye />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>

                                <Separator />

                                <Field>
                                    <FieldLabel htmlFor="new_password">New Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="new_password"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordForm.new_password}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Enter new password"
                                        />
                                        <InputGroupAddon 
                                            className="cursor-pointer"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPasswords.new ? <EyeOff /> : <Eye />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>

                                {/* Password Strength Indicator */}
                                {passwordForm.new_password && (
                                    <div className="p-4 bg-gray-50 rounded-md border">
                                        <PasswordStrength password={passwordForm.new_password} />
                                    </div>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="new_password_confirmation">Confirm New Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id="new_password_confirmation"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordForm.new_password_confirmation}
                                            onChange={handlePasswordInputChange}
                                            placeholder="Confirm new password"
                                        />
                                        <InputGroupAddon 
                                            className="cursor-pointer"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPasswords.confirm ? <EyeOff /> : <Eye />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>

                                <div className="pt-4">
                                    <Button 
                                        onClick={handleChangePassword} 
                                        className="bg-[#016146]"
                                        disabled={isChangingPassword}
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Changing...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Change Password
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Security Tips */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Security Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-800 space-y-2">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Use a strong password with at least 6 characters</li>
                                <li>Include uppercase, lowercase, numbers, and special characters</li>
                                <li>Don't use the same password for multiple accounts</li>
                                <li>Change your password regularly</li>
                                <li>Never share your password with anyone</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;
