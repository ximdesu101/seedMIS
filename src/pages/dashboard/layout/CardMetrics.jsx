import { useEffect, useState } from "react";
import inventoryService from "@/services/inventoryService";
import requestService from "@/services/requestService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Sprout,
    PackageCheck,
    Clock,
    Truck,
    AlertTriangle,
} from "lucide-react";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState([
        {
            title: "Total Seedlings",
            value: 0,
            icon: Sprout,
            iconClass: "text-green-600",
        },
        {
            title: "Available Stock",
            value: 0,
            icon: PackageCheck,
            iconClass: "text-blue-600",
        },
        {
            title: "Pending Request",
            value: 0,
            icon: Clock,
            iconClass: "text-amber-500",
        },
        {
            title: "Distributed",
            value: 0,
            icon: Truck,
            iconClass: "text-purple-600",
        },
        {
            title: "Low Stock",
            value: 0,
            icon: AlertTriangle,
            iconClass: "text-red-600",
        },
    ]);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const [inventoryResponse, requestResponse] = await Promise.all([
                inventoryService.getMetrics(),
                requestService.getMetrics()
            ]);
            
            if (inventoryResponse.success && requestResponse.success) {
                const invData = inventoryResponse.data;
                const reqData = requestResponse.data;
                
                setMetrics([
                    { title: "Total Seedlings", value: invData.total_stock || 0, icon: Sprout, iconClass: "text-green-600" },
                    { title: "Available Stock", value: invData.total_stock || 0, icon: PackageCheck, iconClass: "text-blue-600" },
                    { title: "Pending Request", value: reqData.pending || 0, icon: Clock, iconClass: "text-amber-500" },
                    { title: "Distributed", value: reqData.released || 0, icon: Truck, iconClass: "text-purple-600" },
                    { title: "Low Stock", value: invData.low_stock || 0, icon: AlertTriangle, iconClass: "text-red-600" }
                ]);
            }
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
        }
    };

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