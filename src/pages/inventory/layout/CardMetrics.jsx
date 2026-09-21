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
    OctagonX,
} from "lucide-react";
import inventoryService from "@/services/inventoryService";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState({
        total_stock: 0,
        total_value: 0,
        total_types: 0,
        low_stock: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await inventoryService.getMetrics();
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
            title: "Total Seedlings",
            value: loading ? "..." : metrics.total_stock.toLocaleString(),
            icon: Sprout,
            iconClass: "text-green-600",
        },
        {
            title: "Seedling Type",
            value: loading ? "..." : metrics.total_types,
            icon: Layers,
            iconClass: "text-amber-500",
        },
        {
            title: "Available Stock",
            value: loading ? "..." : metrics.total_stock.toLocaleString(),
            icon: PackageCheck,
            iconClass: "text-blue-600",
        },
        {
            title: "Low Stock",
            value: loading ? "..." : metrics.low_stock,
            icon: AlertTriangle,
            iconClass: "text-purple-600",
        },
        {
            title: "Out of Stock",
            value: loading ? "..." : "0",
            icon: OctagonX,
            iconClass: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
