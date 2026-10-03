import { Check, X } from "lucide-react";
import { cn } from "cn";

export const PasswordStrength = ({ password }) => {
    const requirements = [
        {
            label: "At least 8 characters",
            test: (pwd) => pwd.length >= 8,
        },
        {
            label: "One uppercase letter (A-Z)",
            test: (pwd) => /[A-Z]/.test(pwd),
        },
        {
            label: "One lowercase letter (a-z)",
            test: (pwd) => /[a-z]/.test(pwd),
        },
        {
            label: "One number (0-9)",
            test: (pwd) => /\d/.test(pwd),
        },
        {
            label: "One special character (@$!%*?&#)",
            test: (pwd) => /[@$!%*?&#]/.test(pwd),
        },
    ];

    const passedCount = requirements.filter((req) => req.test(password)).length;
    const strength = passedCount === 0 ? 0 : (passedCount / requirements.length) * 100;

    const getStrengthColor = () => {
        if (strength === 0) return "bg-gray-200";
        if (strength < 40) return "bg-red-500";
        if (strength < 60) return "bg-orange-500";
        if (strength < 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = () => {
        if (strength === 0) return "";
        if (strength < 40) return "Weak";
        if (strength < 60) return "Fair";
        if (strength < 80) return "Good";
        return "Strong";
    };

    return (
        <div className="space-y-3">
            {/* Strength Bar */}
            {password && (
                <div className="space-y-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300", getStrengthColor())}
                            style={{ width: `${strength}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        {getStrengthText()}
                    </p>
                </div>
            )}

            {/* Requirements Checklist */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                <ul className="space-y-1.5">
                    {requirements.map((req, index) => {
                        const passed = req.test(password);
                        return (
                            <li key={index} className="flex items-center gap-2 text-sm">
                                {passed ? (
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                ) : (
                                    <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                                )}
                                <span
                                    className={cn(
                                        "transition-colors",
                                        passed ? "text-green-700" : "text-gray-500"
                                    )}
                                >
                                    {req.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
