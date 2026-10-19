import { useState, useEffect } from "react";
import StaffTable from "./layout/StaffTable";
import CardMetrics from "./layout/CardMetrics";
import staffService from "@/services/staffService";
import { toast } from "sonner";

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchStaff();
    }, [refreshTrigger]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffService.getAllStaff();
            if (response.success) {
                setStaff(response.data);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid gap-4">
            <CardMetrics staff={staff} loading={loading} />
            <StaffTable staff={staff} loading={loading} onRefresh={handleRefresh} />
        </div>
    );
};

export default Staff;