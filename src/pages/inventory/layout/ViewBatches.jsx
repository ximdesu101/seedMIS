import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import inventoryService from "@/services/inventoryService";

const ViewBatches = ({ inventory }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const response = await inventoryService.getInventoryBatches(inventory.id);
            if (response.success) {
                setBatches(response.data);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            alert('Failed to load batch history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dialogOpen) {
            fetchBatches();
        }
    }, [dialogOpen]);

    const getQualityColor = (status) => {
        switch (status) {
            case 'Excellent':
                return 'bg-green-100 text-green-800';
            case 'Good':
                return 'bg-blue-100 text-blue-800';
            case 'Fair':
                return 'bg-yellow-100 text-yellow-800';
            case 'Poor':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    View Batches
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] !max-w-5xl sm:!max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Batch History - {inventory.seedling_type}</DialogTitle>
                    <DialogDescription>
                        Complete traceability of all batches received from production
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                
                <div className="py-4">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading batch history...
                        </div>
                    ) : batches.length > 0 ? (
                        <>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <p className="text-xs text-blue-600 font-medium">Total Batches</p>
                                    <p className="text-2xl font-bold text-blue-900">{batches.length}</p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                    <p className="text-xs text-green-600 font-medium">Total Quantity</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {batches.reduce((sum, batch) => sum + batch.quantity, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                                    <p className="text-xs text-purple-600 font-medium">Latest Batch</p>
                                    <p className="text-lg font-bold text-purple-900">{batches[0]?.batch_number}</p>
                                </div>
                            </div>

                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Batch Number</TableHead>
                                            <TableHead>Production ID</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Date Received</TableHead>
                                            <TableHead>Date Sown</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Quality</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.map((batch) => (
                                            <TableRow key={batch.id}>
                                                <TableCell className="font-medium text-primary">
                                                    {batch.batch_number}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {batch.production_batch_id || 'N/A'}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {batch.quantity.toLocaleString()} pcs
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(batch.date_received).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {batch.date_sown 
                                                        ? new Date(batch.date_sown).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {batch.location || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getQualityColor(batch.quality_status)}`}>
                                                        {batch.quality_status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-muted-foreground">No batch history found</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Batches will appear here when production is transferred to inventory
                            </p>
                        </div>
                    )}
                </div>

                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewBatches;
