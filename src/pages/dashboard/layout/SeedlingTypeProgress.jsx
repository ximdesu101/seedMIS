import { useEffect, useState } from "react";
import targetService from "@/services/targetService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sprout, Loader2 } from "lucide-react";

const SeedlingTypeProgress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await targetService.getProgress();
            if (response.success && response.data.seedling_types) {
                setProgress(response.data.seedling_types);
            }
        } catch (error) {
            console.error('Error fetching seedling type progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 100) return 'text-green-600';
        if (percentage >= 75) return 'text-blue-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return '[&>*]:bg-green-600';
        if (percentage >= 75) return '[&>*]:bg-blue-600';
        if (percentage >= 50) return '[&>*]:bg-yellow-600';
        return '[&>*]:bg-red-600';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'achieved': '✓ Target Achieved!',
            'on-track': '→ On Track',
            'needs-attention': '⚠ Needs Attention',
            'behind': '✗ Behind Schedule'
        };
        return statusMap[status] || '';
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (!progress || progress.length === 0) {
        return null; // Don't show if no seedling type targets set
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Target by Seedling Type
                </CardTitle>
                <CardDescription>
                    Track production progress for each seedling species
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {progress.map((item) => (
                        <div key={item.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{item.seedling_type}</span>
                                    <span className={`text-xs ${
                                        item.status === 'achieved' ? 'text-green-600' : 
                                        item.status === 'on-track' ? 'text-blue-600' : 
                                        item.status === 'needs-attention' ? 'text-yellow-600' : 
                                        'text-red-600'
                                    }`}>
                                        {getStatusText(item.status)}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-lg font-bold ${getStatusColor(item.percentage)}`}>
                                        {item.percentage.toFixed(1)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.current.toLocaleString()} / {item.target.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <Progress 
                                value={Math.min(item.percentage, 100)} 
                                className={`h-2 ${getProgressColor(item.percentage)}`}
                            />
                            {item.percentage < 100 && (
                                <p className="text-xs text-muted-foreground">
                                    {item.remaining.toLocaleString()} seedlings remaining to reach target
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default SeedlingTypeProgress;
