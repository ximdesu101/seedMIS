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
        title: "Seedling Sown",
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
        title: "Average Survivability",
        value: 1240,
        icon: PackageCheck,
        iconClass: "text-blue-600",
    },
    {
        title: "Ready for Distribution",
        value: 12,
        icon: AlertTriangle,
        iconClass: "text-purple-600",
    },
];

const CardMetrics = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
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