import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Activity,
    ChevronLeft,
    ChevronRight,
    User,
    Shield,
    Loader2,
    FileText,
    TrendingUp,
    Calendar,
} from "lucide-react";
import activityLogService from "@/services/activityLogService";
import { toast } from "sonner";

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const [filters, setFilters] = useState({
        module: '',
        action: '',
        user_type: '',
    });

    // Get logged-in user type
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        fetchLogs();
        fetchStatistics();
    }, [pagination.current_page, filters]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await activityLogService.getLogs(
                pagination.current_page,
                pagination.per_page,
                filters
            );
            
            if (response.success) {
                setLogs(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error("Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await activityLogService.getStatistics();
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, current_page: newPage }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current_page: 1 })); // Reset to first page
    };

    const clearFilters = () => {
        setFilters({ module: '', action: '', user_type: '' });
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const getActionBadge = (action) => {
        const badgeColors = {
            'created': 'bg-green-100 text-green-800',
            'updated': 'bg-blue-100 text-blue-800',
            'deleted': 'bg-red-100 text-red-800',
            'approved': 'bg-emerald-100 text-emerald-800',
            'rejected': 'bg-orange-100 text-orange-800',
            'cancelled': 'bg-gray-100 text-gray-800',
            'transferred': 'bg-purple-100 text-purple-800',
            'distributed': 'bg-indigo-100 text-indigo-800',
            'login': 'bg-cyan-100 text-cyan-800',
            'password_changed': 'bg-yellow-100 text-yellow-800',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[action] || 'bg-gray-100 text-gray-800'}`}>
                {action.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const getUserTypeBadge = (userType) => {
        return userType === 'admin' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                <Shield className="h-3 w-3" />
                Admin
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                <User className="h-3 w-3" />
                Staff
            </span>
        );
    };

    const getModuleBadge = (module) => {
        const moduleColors = {
            'production': 'bg-green-50 text-green-700 border-green-200',
            'inventory': 'bg-blue-50 text-blue-700 border-blue-200',
            'request': 'bg-purple-50 text-purple-700 border-purple-200',
            'client': 'bg-orange-50 text-orange-700 border-orange-200',
            'staff': 'bg-cyan-50 text-cyan-700 border-cyan-200',
            'target': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'profile': 'bg-pink-50 text-pink-700 border-pink-200',
            'auth': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${moduleColors[module] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {module.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Activity className="h-8 w-8 text-[#016146]" />
                    Activity Logs
                </h1>
                <p className="text-muted-foreground">
                    Track all system activities and transactions
                </p>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_logs?.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.today_logs}</div>
                            <p className="text-xs text-muted-foreground">Activities today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.week_logs}</div>
                            <p className="text-xs text-muted-foreground">Last 7 days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">By Type</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Admin:</span>
                                    <span className="font-semibold">{statistics.by_user_type?.admin || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Staff:</span>
                                    <span className="font-semibold">{statistics.by_user_type?.staff || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Filter activity logs by module, action, or user type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="w-48">
                            <Select value={filters.module} onValueChange={(value) => handleFilterChange('module', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Modules" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Modules</SelectItem>
                                    <SelectItem value="production">Production</SelectItem>
                                    <SelectItem value="inventory">Inventory</SelectItem>
                                    <SelectItem value="request">Request</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="target">Target</SelectItem>
                                    <SelectItem value="profile">Profile</SelectItem>
                                    <SelectItem value="auth">Auth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-48">
                            <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Actions</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="updated">Updated</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="login">Login</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Only show user type filter for admin */}
                        {userType === 'admin' && (
                            <div className="w-48">
                                <Select value={filters.user_type} onValueChange={(value) => handleFilterChange('user_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Users" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Users</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {(filters.module || filters.action || filters.user_type) && (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>
                        Showing {pagination.from} to {pagination.to} of {pagination.total} logs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-[#016146]" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Activity className="h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-lg font-semibold text-gray-600">No activity logs found</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>User Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Module</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {formatDate(log.created_at)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {log.user_name}
                                                </TableCell>
                                                <TableCell>
                                                    {getUserTypeBadge(log.user_type)}
                                                </TableCell>
                                                <TableCell>
                                                    {getModuleBadge(log.module)}
                                                </TableCell>
                                                <TableCell>
                                                    {getActionBadge(log.action)}
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <p className="text-sm text-gray-700">{log.description}</p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivityLogs;
