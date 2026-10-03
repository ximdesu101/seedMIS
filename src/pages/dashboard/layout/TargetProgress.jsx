import { useEffect, useState } from "react";
import targetService from "@/services/targetService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, DollarSign, Loader2 } from "lucide-react";

const TargetProgress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await targetService.getProgress();
            if (response.success) {
                setProgress(response.data);
            }
        } catch (error) {
            console.error('Error fetching target progress:', error);
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

    if (!progress || (!progress.annual_production && !progress.monthly_distribution && !progress.revenue)) {
        return null; // Don't show if no targets set
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Annual Production */}
            {progress.annual_production && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Production Progress
                        </CardTitle>
                        <CardDescription>Annual target for {progress.annual_production.period}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className={`text-2xl font-bold ${getStatusColor(progress.annual_production.percentage)}`}>
                                    {progress.annual_production.percentage.toFixed(1)}%
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {progress.annual_production.current.toLocaleString()} / {progress.annual_production.target.toLocaleString()}
                                </span>
                            </div>
                            <Progress 
                                value={progress.annual_production.percentage} 
                                className={`h-2 ${getProgressColor(progress.annual_production.percentage)}`}
                            />
                            <p className="text-xs text-muted-foreground">
                                {progress.annual_production.remaining.toLocaleString()} seedlings remaining
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Monthly Distribution */}
            {progress.monthly_distribution && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Distribution Target
                        </CardTitle>
                        <CardDescription>
                            {new Date(progress.monthly_distribution.period).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className={`text-2xl font-bold ${getStatusColor(progress.monthly_distribution.percentage)}`}>
                                    {progress.monthly_distribution.percentage.toFixed(1)}%
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {progress.monthly_distribution.current.toLocaleString()} / {progress.monthly_distribution.target.toLocaleString()}
                                </span>
                            </div>
                            <Progress 
                                value={progress.monthly_distribution.percentage} 
                                className={`h-2 ${getProgressColor(progress.monthly_distribution.percentage)}`}
                            />
                            <p className="text-xs text-muted-foreground">
                                {progress.monthly_distribution.remaining.toLocaleString()} seedlings to go
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Revenue Target */}
            {progress.revenue && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Revenue Goal
                        </CardTitle>
                        <CardDescription>Annual target for {progress.revenue.period}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className={`text-2xl font-bold ${getStatusColor(progress.revenue.percentage)}`}>
                                    {progress.revenue.percentage.toFixed(1)}%
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ₱{progress.revenue.current.toLocaleString()} / ₱{progress.revenue.target.toLocaleString()}
                                </span>
                            </div>
                            <Progress 
                                value={progress.revenue.percentage} 
                                className={`h-2 ${getProgressColor(progress.revenue.percentage)}`}
                            />
                            <p className="text-xs text-muted-foreground">
                                ₱{progress.revenue.remaining.toLocaleString()} remaining
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TargetProgress;
