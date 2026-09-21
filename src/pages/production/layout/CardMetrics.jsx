import { useState, useEffect } from "react";
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
    AlertTriangle,
} from "lucide-react";
import productionService from "@/services/productionService";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState({
        seedlings_sown: 0,
        seedling_types: 0,
        average_survivability: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await productionService.getMetrics();
                if (response.success) {
                    setMetrics(response.data);
                }
            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const metricsData = [
        {
            title: "Seedling Sown",
            value: loading ? "..." : metrics.seedlings_sown.toLocaleString(),
            icon: Sprout,
            iconClass: "text-green-600",
        },
        {
            title: "Seedling Type",
            value: loading ? "..." : metrics.seedling_types,
            icon: Layers,
            iconClass: "text-amber-500",
        },
        {
            title: "Average Survivability",
            value: loading ? "..." : `${metrics.average_survivability}%`,
            icon: PackageCheck,
            iconClass: "text-blue-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {metricsData.map(({ title, value, icon: Icon, iconClass }) => (
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