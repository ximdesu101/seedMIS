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
    BanknoteArrowUp,
    Weight,
    Truck,
    PhilippinePeso,
} from "lucide-react";

const metrics = [
    {
        title: "Total Income",
        value: 2001,
        subtitle: "September 2026",
        icon: BanknoteArrowUp,
        valueIcon: PhilippinePeso,
        iconClass: "text-blue-600",
        chartKey: "income",
    },
    {
        title: "Total Distribution",
        value: 1240,
        subtitle: "September 2026",
        icon: Truck,
        iconClass: "text-green-600",
        chartKey: "distribution",
    },
    {
        title: "Monthly Sales",
        value: 58,
        subtitle: "September 2026",
        icon: Weight,
        valueIcon: PhilippinePeso,
        iconClass: "text-amber-600",
        chartKey: "Monthly",
    },
];

const chartData = [
    { week: "Week 1", income: 42, distribution: 1126, Monthly: 41 },
    { week: "Week 2", income: 80, distribution: 1154, Monthly: 44 },
    { week: "Week 3", income: 150, distribution: 189, Monthly: 51 },
    { week: "Week 4", income: 250, distribution: 1217, Monthly: 5 },
];

const chartConfig = {
    income: {
        label: "Total Income",
        color: "var(--chart-1)",
    },
    distribution: {
        label: "Total Distribution",
        color: "var(--chart-2)",
    },
    Monthly: {
        label: "Monthly Sales",
        color: "var(--chart-3)",
    },
};

const CardMetrics = () => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {metrics.map(
                ({
                    title,
                    value,
                    subtitle,
                    icon: Icon,
                    valueIcon: ValueIcon,
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
                                        {ValueIcon && (
                                            <ValueIcon className="mr-1 h-6 w-6" />
                                        )}
                                        {value.toLocaleString()}
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {subtitle}
                                    </p>
                                </div>

                                <div className="h-[70px] w-[150px]">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-full w-full"
                                    >
                                        <AreaChart
                                            accessibilityLayer
                                            data={chartData}
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