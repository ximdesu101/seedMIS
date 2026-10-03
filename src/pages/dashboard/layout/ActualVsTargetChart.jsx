"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import dashboardService from "@/services/dashboardService";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
    actual: {
        label: "Actual Production",
        color: "var(--chart-2)",
    },
    target: {
        label: "Target",
        color: "var(--chart-1)",
    },
};

const ActualVsTargetChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboardData();

            if (response.success && response.data.actual_vs_target) {
                setChartData(response.data.actual_vs_target);
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Actual vs Target Production</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
                <CardContent className="h-[325px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading chart data...</p>
                </CardContent>
            </Card>
        );
    }

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Actual vs Target Production</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent className="h-[325px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                        Set targets in Settings to see comparison
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actual vs Target Production</CardTitle>
                <CardDescription>
                    Compare actual production with targets
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[325px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="seedling"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        
                        <Bar
                            dataKey="actual"
                            fill="var(--color-actual)"
                            radius={4}
                        />

                        <Bar
                            dataKey="target"
                            fill="var(--color-target)"
                            radius={4}
                        />
                        
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ActualVsTargetChart;
