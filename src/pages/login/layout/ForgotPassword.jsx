import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import authService from "@/services/authService";
import { toast } from "sonner";
import VerifyOTP from "./VerifyOTP";
import bgLogs from "@/assets/bg-logs.png";
import logo from "@/assets/logo.png";

const ForgotPassword = ({ onBack, onBackToLogin }) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVerifyOTP, setShowVerifyOTP] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authService.forgotPassword(email);
            
            if (response.success) {
                toast.success("OTP Sent!", {
                    description: "Check your email for the verification code"
                });
                setShowVerifyOTP(true);
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            
            if (error.response?.status === 404) {
                toast.error("Email Not Found", {
                    description: "This email is not registered in the system"
                });
            } else if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                toast.error("Validation Error", {
                    description: firstError
                });
            } else {
                toast.error("Request Failed", {
                    description: "Please check your connection and try again"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showVerifyOTP) {
        return <VerifyOTP email={email} onBack={() => setShowVerifyOTP(false)} onBackToLogin={onBackToLogin} />;
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${bgLogs})` }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            
            <Card className="w-full max-w-md shadow-2xl relative z-10 border-none bg-white/95 backdrop-blur-md">
                <CardHeader className="space-y-4 pb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-[#016146] hover:text-[#014d38] transition-colors group w-fit"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Login</span>
                    </button>

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
                                Forgot Password?
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600">
                                We'll send you a verification code
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Mail className="w-4 h-4 text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 border-gray-300 focus:border-[#016146] focus:ring-[#016146]"
                                    />
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
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Verification Code
                                </>
                            )}
                        </Button>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <p className="text-sm text-blue-800 font-medium">
                                OTP will be sent to your registered email
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                {email ? `Email: ${email}` : "Enter your email address above"}
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
