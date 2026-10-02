import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";
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
    TrendingUp,
    TrendingDown,
} from "lucide-react";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState([
        {
            title: "Total Seedlings",
            value: 0,
            icon: Sprout,
            iconClass: "text-green-600",
            trend: null,
        },
        {
            title: "Available Stock",
            value: 0,
            icon: PackageCheck,
            iconClass: "text-blue-600",
            trend: null,
        },
        {
            title: "Pending Request",
            value: 0,
            icon: Clock,
            iconClass: "text-amber-500",
            trend: null,
        },
        {
            title: "Distributed",
            value: 0,
            icon: Truck,
            iconClass: "text-purple-600",
            trend: null,
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
                        title: "Total Seedlings", 
                        value: data.total_seedlings?.value || 0, 
                        icon: Sprout, 
                        iconClass: "text-green-600",
                        trend: data.total_seedlings?.trend,
                    },
                    { 
                        title: "Available Stock", 
                        value: data.available_stock?.value || 0, 
                        icon: PackageCheck, 
                        iconClass: "text-blue-600",
                        trend: data.available_stock?.trend,
                    },
                    { 
                        title: "Pending Request", 
                        value: data.pending_requests?.value || 0, 
                        icon: Clock, 
                        iconClass: "text-amber-500",
                        trend: data.pending_requests?.trend,
                    },
                    { 
                        title: "Distributed", 
                        value: data.distributed?.value || 0, 
                        icon: Truck, 
                        iconClass: "text-purple-600",
                        trend: data.distributed?.trend,
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {metrics.map(({ title, value, icon: Icon, iconClass, trend }) => (
                <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                        {trend && (
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend.direction === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                <span>{trend.percentage}% {trend.label}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardMetrics;