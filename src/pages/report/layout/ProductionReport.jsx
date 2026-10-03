import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const ProductionReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            start_date: start.toISOString().slice(0, 10),
            end_date: end.toISOString().slice(0, 10)
        };
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await reportService.getProductionReport(dateRange);
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to load production report");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (data.length === 0) {
            toast.error("No data to export");
            return;
        }

        const exportData = data.map((item, index) => ({
            'No.': index + 1,
            'Batch ID': item.batch_id,
            'Various Type': item.seedling_type,
            'Scientific Name': item.scientific_name || 'N/A',
            'Date Sown': item.date_sown,
            'Action Type': item.action_type,
            'Previous Stage': item.previous_stage || 'N/A',
            'New Stage': item.new_stage || 'N/A',
            'Previous Qty': item.previous_quantity || 0,
            'New Qty': item.new_quantity || 0,
            'Qty Change': item.quantity_change || 0,
            'Location': item.location,
            'Assigned Staff': item.assigned_staff || 'N/A',
            'Changed At': new Date(item.changed_at).toLocaleString(),
            'Notes': item.notes || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Production History");

        worksheet['!cols'] = [
            { wch: 5 },  // No
            { wch: 15 }, // Batch ID
            { wch: 20 }, // Various Type
            { wch: 25 }, // Scientific Name
            { wch: 12 }, // Date Sown
            { wch: 15 }, // Action Type
            { wch: 15 }, // Previous Stage
            { wch: 15 }, // New Stage
            { wch: 12 }, // Previous Qty
            { wch: 12 }, // New Qty
            { wch: 12 }, // Qty Change
            { wch: 15 }, // Location
            { wch: 20 }, // Assigned Staff
            { wch: 20 }, // Changed At
            { wch: 30 }, // Notes
        ];

        const fileName = `Production_History_${dateRange.start_date}_to_${dateRange.end_date}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast.success("Report exported successfully!");
    };

    const handleApply = () => {
        fetchData();
    };

    const handleReset = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setDateRange({
            start_date: start.toISOString().slice(0, 10),
            end_date: end.toISOString().slice(0, 10)
        });
    };

    const totalRecords = data.length;
    const totalCreated = data.filter(item => item.action_type === 'created').reduce((sum, item) => sum + (item.new_quantity || 0), 0);
    const totalTransferred = data.filter(item => item.action_type === 'transferred').reduce((sum, item) => sum + (item.new_quantity || 0), 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Production History Report</CardTitle>
                        <CardDescription>Seedling production activity records</CardDescription>
                    </div>
                    <Button onClick={exportToExcel} disabled={loading || data.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Export to Excel
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Date Filter */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium">From:</label>
                    <input
                        type="date"
                        value={dateRange.start_date}
                        onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                        className="px-3 py-1.5 border rounded-md text-sm"
                    />
                    <label className="text-sm font-medium">To:</label>
                    <input
                        type="date"
                        value={dateRange.end_date}
                        onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                        className="px-3 py-1.5 border rounded-md text-sm"
                    />
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button size="sm" variant="ghost" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Records</p>
                        <p className="text-2xl font-bold">{totalRecords}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Created</p>
                        <p className="text-2xl font-bold">{totalCreated.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Transferred</p>
                        <p className="text-2xl font-bold">{totalTransferred.toLocaleString()}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-md overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Batch ID</TableHead>
                                <TableHead>Various Type</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Stage Change</TableHead>
                                <TableHead className="text-right">Qty Change</TableHead>
                                <TableHead>Changed At</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.batch_id}</TableCell>
                                        <TableCell>{item.seedling_type}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                item.action_type === 'created' ? 'bg-green-50 text-green-700' :
                                                item.action_type === 'transferred' ? 'bg-blue-50 text-blue-700' :
                                                item.action_type === 'stage_update' ? 'bg-yellow-50 text-yellow-700' :
                                                'bg-gray-50 text-gray-700'
                                            }`}>
                                                {item.action_type}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.previous_stage && item.new_stage 
                                                ? `${item.previous_stage} → ${item.new_stage}`
                                                : item.new_stage || '-'
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.quantity_change !== null && item.quantity_change !== 0 ? (
                                                <span className={item.quantity_change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                    {item.quantity_change > 0 ? '+' : ''}{item.quantity_change.toLocaleString()}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.changed_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>{item.location}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductionReport;
