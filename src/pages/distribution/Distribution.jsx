import { useState } from "react";
import DistributeTable from "./layout/DistributeTable";
import CardMetrics from "./layout/CardMatrics";
import DistributionTargetProgress from "./layout/DistributionTargetProgress";

const Distribute = () => {
    // Initialize date range to current month
    const [dateRange, setDateRange] = useState(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            startDate: start.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10)
        };
    });

    // Pending inputs before applying
    const [pendingRange, setPendingRange] = useState(dateRange);

    const handleApply = () => {
        setDateRange(pendingRange);
    };

    const handleReset = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const defaultRange = {
            startDate: start.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10)
        };
        setPendingRange(defaultRange);
        setDateRange(defaultRange);
    };

    return (
        <div className="grid gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                    type="date"
                    value={pendingRange.startDate}
                    onChange={(e) => setPendingRange({ ...pendingRange, startDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                    type="date"
                    value={pendingRange.endDate}
                    onChange={(e) => setPendingRange({ ...pendingRange, endDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                    Apply
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                >
                    Reset
                </button>
            </div>

            <CardMetrics dateRange={dateRange} />
            <DistributionTargetProgress />
            <DistributeTable dateRange={dateRange} />
        </div>
    );
};

export default Distribute;