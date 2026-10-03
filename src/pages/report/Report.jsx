import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistributionReport from "./layout/DistributionReport";
import ProductionReport from "./layout/ProductionReport";
import InventoryReport from "./layout/InventoryReport";
import SummaryReport from "./layout/SummaryReport";

const Report = () => {
    const [activeTab, setActiveTab] = useState("distribution");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">
                        Generate and export system reports
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="distribution">Distribution</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="distribution" className="space-y-4">
                    <DistributionReport />
                </TabsContent>

                <TabsContent value="production" className="space-y-4">
                    <ProductionReport />
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                    <InventoryReport />
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                    <SummaryReport />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Report;
