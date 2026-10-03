import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar, RefreshCw, TrendingUp, Package, DollarSign } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const SummaryReport = () => {
    const [data, setData] = useState(null);
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
            const response = await reportService.getSummaryReport(dateRange);
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to load summary report");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!data) {
            toast.error("No data to export");
            return;
        }

        const workbook = XLSX.utils.book_new();

        // Summary Sheet
        const summaryData = [
            ['SEEDMIS SUMMARY REPORT'],
            [`Period: ${dateRange.start_date} to ${dateRange.end_date}`],
            [''],
            ['PRODUCTION'],
            ['Total Produced', data.production.total_produced],
            ['Total Ready', data.production.total_ready],
            [''],
            ['DISTRIBUTION'],
            ['Total Distributed', data.distribution.total_distributed],
            ['Total Revenue', `₱${data.distribution.total_revenue.toFixed(2)}`],
            [''],
            ['INVENTORY'],
            ['Total Stock', data.inventory.total_stock],
            ['Low Stock Items', data.inventory.low_stock_items],
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

        // By Seedling Type Sheet
        if (data.by_seedling_type && data.by_seedling_type.length > 0) {
            const typeData = data.by_seedling_type.map((item, index) => ({
                'No.': index + 1,
                'Seedling Type': item.seedling_type,
                'Total Distributed': item.total,
            }));
            const typeSheet = XLSX.utils.json_to_sheet(typeData);
            XLSX.utils.book_append_sheet(workbook, typeSheet, "By Seedling Type");
        }

        const fileName = `Summary_Report_${dateRange.start_date}_to_${dateRange.end_date}.xlsx`;
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

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Summary Report</CardTitle>
                            <CardDescription>Overall system statistics</CardDescription>
                        </div>
                        <Button onClick={exportToExcel} disabled={loading || !data}>
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
                </CardContent>
            </Card>

            {/* Statistics Cards */}
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : data ? (
                <>
                    {/* Production Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Production Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Produced</p>
                                    <p className="text-3xl font-bold">{data.production.total_produced.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Ready</p>
                                    <p className="text-3xl font-bold">{data.production.total_ready.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribution Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Distribution Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Distributed</p>
                                    <p className="text-3xl font-bold">{data.distribution.total_distributed.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-3xl font-bold">₱{data.distribution.total_revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Inventory Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-teal-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Stock</p>
                                    <p className="text-3xl font-bold">{data.inventory.total_stock.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Low Stock Items</p>
                                    <p className="text-3xl font-bold">{data.inventory.low_stock_items}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* By Seedling Type */}
                    {data.by_seedling_type && data.by_seedling_type.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribution by Seedling Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.by_seedling_type.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{item.seedling_type}</span>
                                            <span className="text-xl font-bold">{item.total.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <div className="text-center py-10">No data available</div>
            )}
        </div>
    );
};

export default SummaryReport;
