import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const DistributionReport = () => {
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
            const response = await reportService.getDistributionReport(dateRange);
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to load distribution report");
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
            'Date': item.date,
            'Client Name': item.client_name,
            'Organization': item.organization,
            'Contact': item.contact,
            'Various Type': item.seedling_type,
            'Quantity': item.quantity,
            'Price per Unit': `₱${parseFloat(item.price_per_unit).toFixed(2)}`,
            'Total Price': `₱${parseFloat(item.total_price).toFixed(2)}`,
            'Purpose': item.purpose,
            'Status': item.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Distribution Report");

        // Set column widths
        worksheet['!cols'] = [
            { wch: 5 },  // No
            { wch: 12 }, // Date
            { wch: 20 }, // Client Name
            { wch: 25 }, // Organization
            { wch: 15 }, // Contact
            { wch: 20 }, // Various Type
            { wch: 10 }, // Quantity
            { wch: 12 }, // Price per Unit
            { wch: 12 }, // Total Price
            { wch: 30 }, // Purpose
            { wch: 10 }, // Status
        ];

        const fileName = `Distribution_Report_${dateRange.start_date}_to_${dateRange.end_date}.xlsx`;
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

    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Distribution Report</CardTitle>
                        <CardDescription>Released seedling records</CardDescription>
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
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-2xl font-bold">{totalQuantity.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">₱{totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-md overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Various Type</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Total Price</TableHead>
                                <TableHead>Purpose</TableHead>
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
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.client_name}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{item.organization}</TableCell>
                                        <TableCell>{item.seedling_type}</TableCell>
                                        <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₱{parseFloat(item.total_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{item.purpose}</TableCell>
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

export default DistributionReport;
