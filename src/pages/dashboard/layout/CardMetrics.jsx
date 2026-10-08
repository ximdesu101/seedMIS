import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import {
    Sprout,
    Clock,
    Truck,
    Factory,
    Warehouse,
} from "lucide-react";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState([
        {
            title: "In Production",
            description: "Currently growing",
            value: 0,
            icon: Factory,
            iconClass: "text-orange-600",
        },
        {
            title: "In Inventory",
            description: "Ready for distribution",
            value: 0,
            icon: Warehouse,
            iconClass: "text-blue-600",
        },
        {
            title: "Total Seedlings",
            description: "Production + Inventory",
            value: 0,
            icon: Sprout,
            iconClass: "text-green-600",
        },
        {
            title: "Pending Request",
            description: "Awaiting processing",
            value: 0,
            icon: Clock,
            iconClass: "text-amber-500",
        },
        {
            title: "Distributed",
            description: "This month",
            value: 0,
            icon: Truck,
            iconClass: "text-purple-600",
        },
    ]);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await dashboardService.getDashboardData();
            
            if (response.success) {
                const data = response.data.card_metrics;
                
                setMetrics([
                    { 
                        title: "In Production", 
                        description: "Currently growing",
                        value: data.in_production || 0, 
                        icon: Factory, 
                        iconClass: "text-orange-600",
                    },
                    { 
                        title: "In Inventory", 
                        description: "Ready for distribution",
                        value: data.in_inventory || 0, 
                        icon: Warehouse, 
                        iconClass: "text-blue-600",
                    },
                    { 
                        title: "Total Seedlings", 
                        description: "Production + Inventory",
                        value: data.total_seedlings || 0, 
                        icon: Sprout, 
                        iconClass: "text-green-600",
                    },
                    { 
                        title: "Pending Request", 
                        description: "Awaiting processing",
                        value: data.pending_requests || 0, 
                        icon: Clock, 
                        iconClass: "text-amber-500",
                    },
                    { 
                        title: "Distributed", 
                        description: "This month",
                        value: data.distributed || 0, 
                        icon: Truck, 
                        iconClass: "text-purple-600",
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map(({ title, description, value, icon: Icon, iconClass }) => (
                <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-medium">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {description}
                            </CardDescription>
                        </div>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardMetrics;
