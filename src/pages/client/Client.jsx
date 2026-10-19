import { useState, useEffect } from "react";
import ClientTable from "./layout/ClientTable";
import CardMetrics from "./layout/CardMetrics";
import clientService from "@/services/clientService";
import { toast } from "sonner";

const Client = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchClients();
    }, [refreshTrigger]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAllClients();
            if (response.success) {
                setClients(response.data);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid gap-4">
            <CardMetrics clients={clients} loading={loading} />
            <ClientTable clients={clients} loading={loading} onRefresh={handleRefresh} />
        </div>
    );
};

export default Client;