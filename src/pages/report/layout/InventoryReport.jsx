import { useState, useEffect } from "react";
import reportService from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const InventoryReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await reportService.getInventoryReport();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to load inventory report");
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
            'Various Type': item.seedling_type,
            'Classification': item.classification,
            'Total Quantity': item.total_quantity,
            'Status': item.status,
            'Price per Unit': `₱${parseFloat(item.price_per_unit).toFixed(2)}`,
            'Location': item.location || 'N/A',
            'Min Stock Level': item.min_stock_level,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

        worksheet['!cols'] = [
            { wch: 5 },  // No
            { wch: 25 }, // Various Type
            { wch: 15 }, // Classification
            { wch: 15 }, // Total Quantity
            { wch: 12 }, // Status
            { wch: 15 }, // Price per Unit
            { wch: 20 }, // Location
            { wch: 15 }, // Min Stock Level
        ];

        const fileName = `Inventory_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast.success("Report exported successfully!");
    };

    const totalStock = data.reduce((sum, item) => sum + item.total_quantity, 0);
    const lowStockItems = data.filter(item => item.total_quantity <= item.min_stock_level).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Inventory Report</CardTitle>
                        <CardDescription>Current seedling stock levels</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={exportToExcel} disabled={loading || data.length === 0}>
                            <Download className="h-4 w-4 mr-2" />
                            Export to Excel
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Types</p>
                        <p className="text-2xl font-bold">{data.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Stock</p>
                        <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Low Stock Items</p>
                        <p className="text-2xl font-bold">{lowStockItems}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-md overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Various Type</TableHead>
                                <TableHead>Classification</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Price/Unit</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.seedling_type}</TableCell>
                                        <TableCell>{item.classification}</TableCell>
                                        <TableCell className="text-right">{item.total_quantity.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                item.status === 'Available' 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">₱{parseFloat(item.price_per_unit).toFixed(2)}</TableCell>
                                        <TableCell>{item.location || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">No records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default InventoryReport;
