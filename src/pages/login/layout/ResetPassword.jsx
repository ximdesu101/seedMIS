import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, KeyRound, Loader2, Lock, CheckCircle2 } from "lucide-react";
import authService from "@/services/authService";
import { toast } from "sonner";
import bgLogs from "@/assets/bg-logs.png";
import logo from "@/assets/logo.png";

const ResetPassword = ({ email, otp, onBackToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.password || !formData.password_confirmation) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authService.resetPassword({
                email,
                otp,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });
            
            if (response.success) {
                toast.success("Password Reset Successful!", {
                    description: "You can now login with your new password"
                });
                
                setTimeout(() => {
                    onBackToLogin();
                }, 1500);
            }
        } catch (error) {
            console.error("Reset password error:", error);
            
            if (error.response?.status === 401) {
                toast.error("Invalid or Expired OTP", {
                    description: "Please request a new OTP"
                });
            } else if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                toast.error("Validation Error", {
                    description: firstError
                });
            } else {
                toast.error("Reset Failed", {
                    description: "Please try again later"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${bgLogs})` }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            
            <Card className="w-full max-w-md shadow-2xl relative z-10 border-none bg-white/95 backdrop-blur-md">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl p-2 ring-4 ring-[#016146]/20">
                            <img
                                src={logo}
                                alt="SeedMIS Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        
                        <div className="text-center space-y-2">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#016146] to-[#014d38] bg-clip-text text-transparent">
                                Reset Password
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600">
                                Create a new strong password
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="password" className="text-gray-700 font-medium">
                                    New Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength="8"
                                        className="pl-10 pr-10 border-gray-300 focus:border-[#016146] focus:ring-[#016146]"
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="hover:text-[#016146] transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters long
                                </p>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password_confirmation" className="text-gray-700 font-medium">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter new password"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        required
                                        minLength="8"
                                        className="pl-10 pr-10 border-gray-300 focus:border-[#016146] focus:ring-[#016146]"
                                    />
                                    <InputGroupAddon align="end">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="hover:text-[#016146] transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#016146] to-[#014d38] hover:from-[#014d38] hover:to-[#013d2a] text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Reset Password
                                </>
                            )}
                        </Button>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <p className="text-xs text-green-700">
                                After resetting, you'll be redirected to login
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
