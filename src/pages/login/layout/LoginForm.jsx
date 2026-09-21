import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import authService from "@/services/authService";
import { toast } from "sonner";
import ForgotPassword from "./ForgotPassword";
import { useEffect } from "react";
import bgLogs from "@/assets/bg-logs.png";
import logo from "@/assets/logo.png";

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        
        if (user && userType) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authService.login(formData);
            
            if (response.success) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('userType', response.data.user_type);
                
                toast.success("Login successful!", {
                    description: `Welcome back, ${response.data.user.name}!`
                });
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response?.status === 401) {
                toast.error("Invalid Credentials", {
                    description: "Email or password is incorrect"
                });
            } else if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                toast.error("Validation Error", {
                    description: firstError
                });
            } else {
                toast.error("Login Failed", {
                    description: "Please check your connection and try again"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showForgotPassword) {
        return <ForgotPassword onBack={() => setShowForgotPassword(false)} onBackToLogin={() => setShowForgotPassword(false)} />;
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
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600">
                                Sign in to SeedMIS System
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                        placeholder="admin@nwssu.edu.ph"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="pl-10 border-gray-300 focus:border-[#016146] focus:ring-[#016146]"
                                    />
                                </InputGroup>
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between mb-2">
                                    <FieldLabel htmlFor="password" className="text-gray-700 font-medium">
                                        Password
                                    </FieldLabel>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-[#016146] hover:text-[#014d38] font-medium transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
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
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="text-center pt-4">
                            <p className="text-xs text-gray-500">
                                San Jorge Experiment Station
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Seedling Management Information System
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;
