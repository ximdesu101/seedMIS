import { useEffect, useState } from "react";
import requestService from "@/services/requestService";
import targetService from "@/services/targetService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { Area, AreaChart, XAxis } from "recharts";

import {
    Target,
    Weight,
    Truck,
} from "lucide-react";

const chartConfig = {
    target: {
        label: "Monthly Target",
        color: "var(--chart-1)",
    },
    distribution: {
        label: "Total Distribution",
        color: "var(--chart-2)",
    },
    quantity: {
        label: "Total Quantity",
        color: "var(--chart-3)",
    },
};

const CardMetrics = () => {
    const [metrics, setMetrics] = useState([
        {
            title: "Monthly Target",
            value: 0,
            subtitle: "Distribution Goal",
            icon: Target,
            iconClass: "text-blue-600",
            chartKey: "target",
        },
        {
            title: "Total Distribution",
            value: 0,
            subtitle: "Released Seedlings",
            icon: Truck,
            iconClass: "text-green-600",
            chartKey: "distribution",
        },
        {
            title: "Total Quantity",
            value: 0,
            subtitle: "Seedlings Distributed",
            icon: Weight,
            iconClass: "text-amber-600",
            chartKey: "quantity",
        },
    ]);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await requestService.getMetrics();
            if (response.success) {
                const data = response.data;
                
                // Get all released requests for quantity calculation
                const requestsResponse = await requestService.getAllRequests();
                let totalQuantity = 0;
                let monthlySales = 0;
                
                if (requestsResponse.success) {
                    const releasedRequests = requestsResponse.data.filter(
                        req => req.status === 'Released'
                    );
                    totalQuantity = releasedRequests.reduce(
                        (sum, req) => sum + (req.quantity || 0), 
                        0
                    );

                    // Calculate monthly sales (current month only)
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    monthlySales = releasedRequests
                        .filter(req => {
                            const reqDate = new Date(req.updated_at);
                            return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
                        })
                        .reduce((sum, req) => sum + (req.total_price || 0), 0);
                }

                // Get monthly target
                const targetResponse = await targetService.getProgress();
                let monthlyTarget = 0;
                if (targetResponse.success && targetResponse.data.monthly_distribution) {
                    monthlyTarget = targetResponse.data.monthly_distribution.target;
                }

                setMetrics([
                    {
                        title: "Monthly Target",
                        value: monthlyTarget,
                        subtitle: "Distribution Goal",
                        icon: Target,
                        iconClass: "text-blue-600",
                        chartKey: "target",
                    },
                    {
                        title: "Total Distribution",
                        value: data.released || 0,
                        subtitle: "Released Seedlings",
                        icon: Truck,
                        iconClass: "text-green-600",
                        chartKey: "distribution",
                    },
                    {
                        title: "Total Quantity",
                        value: totalQuantity,
                        subtitle: "Seedlings Distributed",
                        icon: Weight,
                        iconClass: "text-amber-600",
                        chartKey: "quantity",
                        monthlySales: monthlySales,
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {metrics.map(
                ({
                    title,
                    value,
                    subtitle,
                    icon: Icon,
                    iconClass,
                    chartKey,
                }) => (
                    <Card key={title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {title}
                            </CardTitle>

                            <Icon className={`h-5 w-5 ${iconClass}`} />
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center text-3xl font-bold">
                                        {value.toLocaleString()}
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {subtitle}
                                    </p>

                                    {chartKey === "quantity" && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            ₱{metrics[2]?.monthlySales?.toLocaleString() || 0} monthly sales
                                        </p>
                                    )}
                                </div>

                                <div className="h-[70px] w-[150px]">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-full w-full"
                                    >
                                        <AreaChart
                                            accessibilityLayer
                                            data={[
                                                { week: "Week 1", [chartKey]: Math.floor(value * 0.6) },
                                                { week: "Week 2", [chartKey]: Math.floor(value * 0.7) },
                                                { week: "Week 3", [chartKey]: Math.floor(value * 0.85) },
                                                { week: "Week 4", [chartKey]: value },
                                            ]}
                                            margin={{
                                                left: 0,
                                                right: 0,
                                                top: 5,
                                                bottom: 0,
                                            }}
                                        >
                                            <XAxis dataKey="week" hide />

                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent indicator="line" />
                                                }
                                            />

                                            <Area
                                                dataKey={chartKey}
                                                type="natural"
                                                fill={`var(--color-${chartKey})`}
                                                fillOpacity={0.2}
                                                stroke={`var(--color-${chartKey})`}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
};

export default CardMetrics;