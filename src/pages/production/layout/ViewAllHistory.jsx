import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewAllHistory = () => {
    const navigate = useNavigate();

    return (
        <Button 
            variant="outline"
            onClick={() => navigate('/production-history')}
        >
            <History className="mr-2 h-4 w-4" />
            View History
        </Button>
    );
};

export default ViewAllHistory;
