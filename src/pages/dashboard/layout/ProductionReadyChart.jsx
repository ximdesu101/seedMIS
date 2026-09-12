"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

const chartData = [
    { month: "January", sown: 186, ready: 80 },
    { month: "February", sown: 305, ready: 200 },
    { month: "March", sown: 237, ready: 120 },
    { month: "April", sown: 273, ready: 190 },
    { month: "May", sown: 209, ready: 130 },
    { month: "June", sown: 214, ready: 140 },
    { month: "July", sown: 286, ready: 180 },
    { month: "August", sown: 325, ready: 220 },
    { month: "September", sown: 298, ready: 210 },
    { month: "October", sown: 352, ready: 245 },
    { month: "November", sown: 315, ready: 230 },
    { month: "December", sown: 380, ready: 270 },
];

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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Seedling Production vs Ready</CardTitle>
                <CardDescription>
                    Monthly sown and ready seedlings for 2026
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