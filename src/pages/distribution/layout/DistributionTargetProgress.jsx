import { useEffect, useState } from "react";
import targetService from "@/services/targetService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Loader2 } from "lucide-react";

const DistributionTargetProgress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await targetService.getProgress();
            if (response.success && response.data.monthly_distribution) {
                setProgress(response.data.monthly_distribution);
            }
        } catch (error) {
            console.error('Error fetching distribution target progress:', error);
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

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (!progress) {
        return null; // Don't show if no target set
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Monthly Distribution Target
                </CardTitle>
                <CardDescription>
                    {new Date(progress.period).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <span className={`text-2xl font-bold ${getStatusColor(progress.percentage)}`}>
                            {progress.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {progress.current.toLocaleString()} / {progress.target.toLocaleString()}
                        </span>
                    </div>
                    <Progress 
                        value={progress.percentage} 
                        className={`h-2 ${getProgressColor(progress.percentage)}`}
                    />
                    <p className="text-xs text-muted-foreground">
                        {progress.remaining.toLocaleString()} seedlings to go
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DistributionTargetProgress;
