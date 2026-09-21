import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import productionService from "@/services/productionService";

const ProductionHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllHistory();
    }, []);

    const fetchAllHistory = async () => {
        try {
            setLoading(true);
            const response = await productionService.getAllProductionHistory();
            if (response.success) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching production history:', error);
            alert('Failed to load production history');
        } finally {
            setLoading(false);
        }
    };

    const getStageColor = (stage) => {
        switch (stage) {
            case 'Germination':
                return 'bg-yellow-100 text-yellow-800';
            case 'Seedling':
                return 'bg-blue-100 text-blue-800';
            case 'Hardening':
                return 'bg-purple-100 text-purple-800';
            case 'Ready':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getActionTypeColor = (actionType) => {
        switch (actionType) {
            case 'created':
                return 'bg-blue-100 text-blue-800';
            case 'stage_update':
                return 'bg-purple-100 text-purple-800';
            case 'quantity_update':
                return 'bg-orange-100 text-orange-800';
            case 'edited':
                return 'bg-indigo-100 text-indigo-800';
            case 'transferred':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatActionType = (actionType) => {
        switch (actionType) {
            case 'created':
                return 'Created';
            case 'stage_update':
                return 'Stage Update';
            case 'quantity_update':
                return 'Quantity Update';
            case 'edited':
                return 'Edited';
            case 'transferred':
                return 'Transferred';
            default:
                return actionType;
        }
    };

    const totalChanges = history.length;
    const uniqueBatches = new Set(history.map(h => h.batch_id)).size;
    const stageUpdates = history.filter(h => h.action_type === 'stage_update').length;
    const quantityUpdates = history.filter(h => h.action_type === 'quantity_update').length;

    return (
        <div className="grid gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/seedling-production')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Production History</h1>
                        <p className="text-sm text-muted-foreground">
                            Complete timeline of all changes and stage transitions across all production batches
                        </p>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            {!loading && history.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-blue-600 font-medium">Total Changes</CardDescription>
                            <CardTitle className="text-3xl text-blue-900">{totalChanges}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-green-600 font-medium">Batches Tracked</CardDescription>
                            <CardTitle className="text-3xl text-green-900">{uniqueBatches}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-purple-600 font-medium">Stage Updates</CardDescription>
                            <CardTitle className="text-3xl text-purple-900">{stageUpdates}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-orange-600 font-medium">Quantity Updates</CardDescription>
                            <CardTitle className="text-3xl text-orange-900">{quantityUpdates}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {/* History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Production Changes</CardTitle>
                    <CardDescription>
                        Detailed history of all production batch modifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Loading production history...
                        </div>
                    ) : history.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">Batch ID</TableHead>
                                        <TableHead className="w-[200px]">Seedling Type</TableHead>
                                        <TableHead className="w-[160px]">Date & Time</TableHead>
                                        <TableHead className="w-[130px]">Action Type</TableHead>
                                        <TableHead className="w-[120px]">Previous Stage</TableHead>
                                        <TableHead className="w-[120px]">New Stage</TableHead>
                                        <TableHead className="w-[110px]">Previous Qty</TableHead>
                                        <TableHead className="w-[110px]">New Qty</TableHead>
                                        <TableHead className="w-[130px]">Changed By</TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium text-primary text-xs">
                                                {record.batch_id}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="max-w-[200px] truncate" title={record.seedling_type}>
                                                    {record.seedling_type}
                                                </div>
                                                {record.classification && (
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {record.classification}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm whitespace-nowrap">
                                                {new Date(record.changed_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${getActionTypeColor(record.action_type)}`}>
                                                    {formatActionType(record.action_type)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {record.previous_stage ? (
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${getStageColor(record.previous_stage)}`}>
                                                        {record.previous_stage}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {record.new_stage ? (
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${getStageColor(record.new_stage)}`}>
                                                        {record.new_stage}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {record.previous_quantity !== null 
                                                    ? record.previous_quantity.toLocaleString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-sm font-semibold">
                                                {record.new_quantity !== null
                                                    ? record.new_quantity.toLocaleString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {record.changed_by || 'System'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                <div className="max-w-xs truncate" title={record.notes}>
                                                    {record.notes || '-'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <History className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-muted-foreground">No history records found</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                History will appear here when changes are made to production batches
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductionHistory;
