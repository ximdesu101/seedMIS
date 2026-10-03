import TargetSettings from "./layout/TargetSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Target</h1>
                    <p className="text-muted-foreground">
                        Manage system configuration and targets
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Target Management</CardTitle>
                    <CardDescription>
                        Configure production, distribution, and revenue targets to track progress across the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TargetSettings />
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
