import { useMemo } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Sprout,
    PackageCheck,
    Layers,
} from "lucide-react";

const CardMetrics = ({ productions, loading }) => {
    // Calculate metrics from productions data
    const metrics = useMemo(() => {
        if (!productions || productions.length === 0) {
            return {
                seedlings_sown: 0,
                seedling_types: 0,
                average_survivability: 0,
                sown_breakdown: { grafted: 0, seedling: 0 },
            };
        }

        // Total seedlings sown with breakdown
        let grafted_sown = 0;
        let seedling_sown = 0;
        
        const seedlings_sown = productions.reduce((sum, batch) => {
            const quantity = batch.quantity_sown || 0;
            const classification = batch.classification?.toLowerCase();
            
            if (classification === 'grafted' || classification === 'crafted') {
                grafted_sown += quantity;
            } else {
                seedling_sown += quantity;
            }
            
            return sum + quantity;
        }, 0);

        // Unique seedling types
        const uniqueTypes = new Set(
            productions.map(batch => `${batch.seedling_type}-${batch.classification}`)
        );
        const seedling_types = uniqueTypes.size;

        // Average survivability
        const totalSurvivability = productions.reduce((sum, batch) => {
            const survivability = batch.survivability_rate || 0;
            return sum + parseFloat(survivability);
        }, 0);
        const average_survivability = productions.length > 0 
            ? (totalSurvivability / productions.length).toFixed(2)
            : 0;

        return {
            seedlings_sown,
            seedling_types,
            average_survivability,
            sown_breakdown: { 
                grafted: grafted_sown, 
                seedling: seedling_sown 
            },
        };
    }, [productions]);

    const metricsData = [
        {
            title: "Seedling Sown",
            value: loading ? "..." : metrics.seedlings_sown.toLocaleString(),
            icon: Sprout,
            iconClass: "text-green-600",
            breakdown: !loading && metrics.sown_breakdown,
        },
        {
            title: "Seedling Type",
            value: loading ? "..." : metrics.seedling_types,
            icon: Layers,
            iconClass: "text-amber-500",
        },
        {
            title: "Average Survivability",
            value: loading ? "..." : `${metrics.average_survivability}%`,
            icon: PackageCheck,
            iconClass: "text-blue-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {metricsData.map(({ title, value, icon: Icon, iconClass, breakdown }) => (
                <Card key={title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <Icon className={`h-5 w-5 ${iconClass}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                        {breakdown && (
                            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                    <span>Grafted: {breakdown.grafted.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span>Seedling: {breakdown.seedling.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardMetrics;