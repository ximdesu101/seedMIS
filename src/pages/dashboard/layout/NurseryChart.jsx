"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";

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
} from "@/components/ui/chart";

const chartData = [
    {
        nursery: "Nursery A",
        seedlings: 186,
    },
    {
        nursery: "Nursery B",
        seedlings: 305,
    },
    {
        nursery: "Nursery C",
        seedlings: 237,
    },
];

const chartConfig = {
    seedlings: {
        label: "Seedlings",
        color: "var(--chart-1)",
    },
    label: {
        color: "var(--background)",
    },
};

const NurseryChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Seedlings by Nursery</CardTitle>
                <CardDescription>
                    Current seedling inventory across nursery areas
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[325px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 40,
                        }}
                    >
                        <CartesianGrid horizontal={false} />

                        <YAxis
                            dataKey="nursery"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            hide
                        />

                        <XAxis
                            dataKey="seedlings"
                            type="number"
                            hide
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />

                        <Bar
                            dataKey="seedlings"
                            fill="var(--color-seedlings)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="nursery"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />

                            <LabelList
                                dataKey="seedlings"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default NurseryChart