import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Sprout,
    PackageCheck,
    Layers,
    OctagonX,
    AlertTriangle,
} from "lucide-react";

const metrics = [
    {
        title: "Total Seedlings",
        value: 2001,
        icon: Sprout,
        iconClass: "text-green-600",
    },
    {
        title: "Seedling Type",
        value: 58,
        icon: Layers,
        iconClass: "text-amber-500",
    },
    {
        title: "Available Stock",
        value: 1240,
        icon: PackageCheck,
        iconClass: "text-blue-600",
    },
    {
        title: "Low Stock",
        value: 12,
        icon: AlertTriangle,
        iconClass: "text-purple-600",
    },
    {
        title: "Out of Stock",
        value: 1,
        icon: OctagonX,
        iconClass: "text-red-600",
    },
];

const CardMetrics = () => {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map(({ title, value, icon: Icon, iconClass }) => (
                <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardMetrics;