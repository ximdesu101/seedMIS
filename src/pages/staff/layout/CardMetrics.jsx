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

import {
    Area,
    AreaChart,
    XAxis,
} from "recharts";

import {
    Users,
    UserRoundCheck,
    UserRoundX,
} from "lucide-react";

const metrics = [
    {
        title: "Total Users",
        value: 2001,
        subtitle: "September 2026",
        icon: Users,
        iconClass: "text-blue-600",
        chartKey: "users",
        chartColor: "var(--chart-1)",
    },
    {
        title: "Active Users",
        value: 1240,
        subtitle: "September 2026",
        icon: UserRoundCheck,
        iconClass: "text-green-600",
        chartKey: "active",
        chartColor: "var(--chart-2)",
    },
    {
        title: "Deactivated Accounts",
        value: 58,
        subtitle: "September 2026",
        icon: UserRoundX,
        iconClass: "text-red-500",
        chartKey: "deactivated",
        chartColor: "var(--chart-3)",
    },
];

const chartData = [
    {
        week: "Week 1",
        users: 42,
        active: 1126,
        deactivated: 41,
    },
    {
        week: "Week 2",
        users: 80,
        active: 1154,
        deactivated: 44,
    },
    {
        week: "Week 3",
        users: 150,
        active: 189,
        deactivated: 51,
    },
    {
        week: "Week 4",
        users: 250,
        active: 1217,
        deactivated: 5,
    },
];

const chartConfig = {
    users: {
        label: "Total Users",
        color: "var(--chart-1)",
    },
    active: {
        label: "Active Users",
        color: "var(--chart-2)",
    },
    deactivated: {
        label: "Deactivated Accounts",
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
                                {/* Metric */}
                                <div className="shrink-0">
                                    <div className="text-3xl font-bold">
                                        {value.toLocaleString()}
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {subtitle}
                                    </p>
                                </div>

                                {/* Mini Chart */}
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
                                            <XAxis
                                                dataKey="week"
                                                hide
                                            />

                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        indicator="line"
                                                    />
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