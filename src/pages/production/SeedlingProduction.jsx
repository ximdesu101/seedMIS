import { useState, useEffect } from "react";
import CardMetrics from "./layout/CardMetrics";
import ProductionTable from "./layout/ProductionTable";
import productionService from "@/services/productionService";
import { toast } from "sonner";

const SeedlingProduction = () => {
    const [productions, setProductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchProductions();
    }, [refreshTrigger]);

    const fetchProductions = async () => {
        try {
            console.log('🔄 Fetching productions...');
            setLoading(true);
            const response = await productionService.getAllProductions();
            if (response.success) {
                console.log('✅ Productions fetched:', response.data.length, 'batches');
                setProductions(response.data);
            }
        } catch (error) {
            console.error("Error fetching productions:", error);
            toast.error("Failed to load productions");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        console.log('🔄 handleRefresh called');
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid gap-4">
            <CardMetrics productions={productions} loading={loading} />
            <ProductionTable productions={productions} loading={loading} onRefresh={handleRefresh} />
        </div>
    );
};

export default SeedlingProduction;