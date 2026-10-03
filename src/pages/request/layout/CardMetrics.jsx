import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import requestService from "@/services/requestService";

const CardMetrics = () => {
    const [metrics, setMetrics] = useState({
        total_requests: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        released: 0,
        total_revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const response = await requestService.getMetrics();
            if (response.success) {
                setMetrics(response.data);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const metricsCards = [
        {
            title: "Total Requests",
            value: metrics.total_requests,
            icon: FileText,
            iconClass: "text-blue-600",
        },
        {
            title: "Pending Requests",
            value: metrics.pending,
            icon: Clock,
            iconClass: "text-yellow-600",
        },
        {
            title: "Approved Requests",
            value: metrics.approved,
            icon: CheckCircle,
            iconClass: "text-green-600",
        },
        {
            title: "Rejected Requests",
            value: metrics.rejected,
            icon: XCircle,
            iconClass: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {metricsCards.map(({ title, value, icon: Icon, iconClass }) => (
                <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardMetrics;