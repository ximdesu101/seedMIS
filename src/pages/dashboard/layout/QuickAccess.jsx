import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Zap,
    Users,
    Sprout,
    FileBox,
    ClipboardList,
    Truck
} from "lucide-react";

const actions = [
    {
        label: "Manage Users",
        icon: Users,
        path: "/client"
    },
    {
        label: "Seedling Inventory",
        icon: FileBox,
        path: "/seedling-invertory"
    },
    {
        label: "Seedling Production",
        icon: Sprout,
        path: "/seedling-production"
    },
    {
        label: "Distribution",
        icon: Truck,
        path: "#"
    },
    {
        label: "Request",
        icon: ClipboardList,
        path: "/requests"
    },
];

function QuickAction() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex gap-1">
                    <Zap className="w-4 h-4 my-auto" /> Quick Actions
                </CardTitle>
            </CardHeader>

            <CardContent className="flex gap-2">
                {actions.map(({ label, icon: Icon, path }) => (
                    <Link
                        key={label}
                        to={path}
                        className="flex-1 flex flex-col items-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-sm font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors text-center"
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

export default QuickAction;