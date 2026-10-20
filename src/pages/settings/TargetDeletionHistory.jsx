import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import targetService from "@/services/targetService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { History, RefreshCw, ArrowLeft, Calendar, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const TargetDeletionHistory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deletions, setDeletions] = useState([]);

    useEffect(() => {
        fetchDeletedTargets();
    }, []);

    const fetchDeletedTargets = async () => {
        try {
            setLoading(true);
            const response = await targetService.getDeletedTargets();
            if (response.success) {
                setDeletions(response.data);
            }
        } catch (error) {
            console.error('Error fetching deleted targets:', error);
            toast.error("Failed to load deletion history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/settings')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <History className="h-8 w-8" />
                            Target Deletion History
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View all deleted targets and their details
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchDeletedTargets}
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Deleted
                        </CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{deletions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Archived targets
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Seedlings
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {deletions.reduce((sum, d) => sum + parseFloat(d.target_seedlings || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From deleted targets
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Latest Deletion
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {deletions.length > 0 ? format(new Date(deletions[0]?.deleted_at), 'MMM dd') : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most recent
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Deletion History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Deletion Records</CardTitle>
                    <CardDescription>
                        Complete history of all deleted targets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-2">
                                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Loading deletion history...</p>
                            </div>
                        </div>
                    ) : deletions.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Deletion History</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                No targets have been deleted yet
                            </p>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate('/settings')}
                            >
                                Back to Settings
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Year</TableHead>
                                        <TableHead>Target Seedlings</TableHead>
                                        <TableHead className="max-w-[300px]">Notes</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Deleted By
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Deleted At
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deletions.map((deletion) => (
                                        <TableRow key={deletion.id}>
                                            <TableCell className="font-bold">
                                                {deletion.year}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {parseFloat(deletion.target_seedlings).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <div className="truncate" title={deletion.notes}>
                                                    {deletion.notes || (
                                                        <span className="text-muted-foreground italic">No notes</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {deletion.deleted_by?.name || `User #${deletion.deleted_by}`}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {formatDate(deletion.deleted_at)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(deletion.deleted_at), 'EEEE')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TargetDeletionHistory;
