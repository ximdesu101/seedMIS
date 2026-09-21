import { useState, useEffect } from "react";
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
    Loader2,
} from "lucide-react";

import staffService from "@/services/staffService";
import { toast } from "sonner";

const chartConfig = {
    users: {
        label: "Total Staff",
        color: "var(--chart-1)",
    },
    active: {
        label: "Active Staff",
        color: "var(--chart-2)",
    },
    deactivated: {
        label: "Deactivated Accounts",
        color: "var(--chart-3)",
    },
};

const CardMetrics = () => {
    const [loading, setLoading] = useState(true);
    const [totalStaff, setTotalStaff] = useState(0);
    const [activeStaff, setActiveStaff] = useState(0);
    const [deactivatedStaff, setDeactivatedStaff] = useState(0);
    const [chartData, setChartData] = useState([
        { week: "Week 1", users: 0, active: 0, deactivated: 0 },
        { week: "Week 2", users: 0, active: 0, deactivated: 0 },
        { week: "Week 3", users: 0, active: 0, deactivated: 0 },
        { week: "Week 4", users: 0, active: 0, deactivated: 0 },
    ]);

    useEffect(() => {
        fetchStaffStats();
    }, []);

    const fetchStaffStats = async () => {
        try {
            setLoading(true);
            const response = await staffService.getAllStaff();
            
            if (response.success) {
                const staff = response.data;
                const total = staff.length;
                
                // For now, all staff are active
                const active = total;
                const deactivated = 0;
                
                setTotalStaff(total);
                setActiveStaff(active);
                setDeactivatedStaff(deactivated);
                
                // Generate chart data based on created dates
                generateChartData(staff);
            }
        } catch (error) {
            console.error("Error fetching staff stats:", error);
            toast.error("Failed to load staff statistics");
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (staff) => {
        // Get current date and calculate weeks
        const now = new Date();
        
        // Initialize weeks
        const weeks = [
            { week: "Week 1", users: 0, active: 0, deactivated: 0 },
            { week: "Week 2", users: 0, active: 0, deactivated: 0 },
            { week: "Week 3", users: 0, active: 0, deactivated: 0 },
            { week: "Week 4", users: 0, active: 0, deactivated: 0 },
        ];
        
        // Count staff by week
        staff.forEach(member => {
            const createdDate = new Date(member.created_at);
            const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 7) {
                weeks[3].users++;
                weeks[3].active++;
            } else if (daysDiff <= 14) {
                weeks[2].users++;
                weeks[2].active++;
            } else if (daysDiff <= 21) {
                weeks[1].users++;
                weeks[1].active++;
            } else if (daysDiff <= 28) {
                weeks[0].users++;
                weeks[0].active++;
            }
        });
        
        // Calculate cumulative totals
        let cumulativeUsers = 0;
        let cumulativeActive = 0;
        
        const cumulativeData = weeks.map(week => {
            cumulativeUsers += week.users;
            cumulativeActive += week.active;
            
            return {
                week: week.week,
                users: cumulativeUsers,
                active: cumulativeActive,
                deactivated: week.deactivated,
            };
        });
        
        setChartData(cumulativeData);
    };

    const getCurrentMonth = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const now = new Date();
        return `${months[now.getMonth()]} ${now.getFullYear()}`;
    };

    const metrics = [
        {
            title: "Total Staff",
            value: totalStaff,
            subtitle: getCurrentMonth(),
            icon: Users,
            iconClass: "text-blue-600",
            chartKey: "users",
            chartColor: "var(--chart-1)",
        },
        {
            title: "Active Staff",
            value: activeStaff,
            subtitle: getCurrentMonth(),
            icon: UserRoundCheck,
            iconClass: "text-green-600",
            chartKey: "active",
            chartColor: "var(--chart-2)",
        },
        {
            title: "Deactivated Accounts",
            value: deactivatedStaff,
            subtitle: getCurrentMonth(),
            icon: UserRoundX,
            iconClass: "text-red-500",
            chartKey: "deactivated",
            chartColor: "var(--chart-3)",
        },
    ];
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
                            {loading ? (
                                <div className="flex items-center justify-center h-[70px]">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
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
                            )}
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
};

export default CardMetrics;