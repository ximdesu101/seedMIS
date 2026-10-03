"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
    sown: {
        label: "Sown",
        color: "var(--chart-1)",
    },
    ready: {
        label: "Ready",
        color: "var(--chart-4)",
    },
};

const ProductionReadyChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboardData();

            if (response.success && response.data.production_chart) {
                setChartData(response.data.production_chart);
            }
        } catch (error) {
            console.error('Error fetching production chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Seedling Production vs Ready</CardTitle>
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
                    <CardTitle>Seedling Production vs Ready</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent className="h-[325px] flex items-center justify-center">
                    <p className="text-muted-foreground">No production data for current year</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Seedling Production vs Ready</CardTitle>
                <CardDescription>
                    Monthly sown and ready seedlings for {new Date().getFullYear()}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[325px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        
                        <Bar
                            dataKey="sown"
                            fill="var(--color-sown)"
                            radius={4}
                        />

                        <Bar
                            dataKey="ready"
                            fill="var(--color-ready)"
                            radius={4}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default ProductionReadyChart