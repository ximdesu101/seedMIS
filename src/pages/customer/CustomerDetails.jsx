import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUserDisplayName } from "@/utils/nameHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Receipt,
    TrendingUp,
    Package,
    Loader2,
    UserPlus,
} from "lucide-react";
import customerService from "@/services/customerService";
import requestService from "@/services/requestService";
import { toast } from "sonner";

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalQuantity: 0,
        totalSpent: 0,
        pendingRequests: 0,
        releasedQuantity: 0,
        rejectedQuantity: 0,
        cancelledQuantity: 0,
        releasedCount: 0,
        rejectedCount: 0,
        cancelledCount: 0,
    });
    const [isUpgrading, setIsUpgrading] = useState(false);

    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            
            // Fetch customer details
            const customerResponse = await customerService.getCustomerById(id);
            if (customerResponse.success) {
                setCustomer(customerResponse.data);
            }

            // Fetch all requests
            const requestsResponse = await requestService.getAllRequests();
            if (requestsResponse.success) {
                // Filter transactions for this customer
                const customerTransactions = requestsResponse.data.filter(
                    req => req.customer_id === parseInt(id) && req.requester_type === 'customer'
                );
                
                setTransactions(customerTransactions);
                
                // Calculate statistics
                const totalQuantity = customerTransactions.reduce((sum, req) => sum + req.quantity, 0);
                const totalSpent = customerTransactions.reduce((sum, req) => sum + parseFloat(req.total_price || 0), 0);
                const pendingRequests = customerTransactions.filter(
                    req => req.status === 'Pending' || req.status === 'Approved'
                ).length;
                
                // Calculate quantity by status
                const releasedQuantity = customerTransactions
                    .filter(req => req.status === 'Released')
                    .reduce((sum, req) => sum + req.quantity, 0);
                
                const rejectedQuantity = customerTransactions
                    .filter(req => req.status === 'Rejected')
                    .reduce((sum, req) => sum + req.quantity, 0);
                
                const cancelledQuantity = customerTransactions
                    .filter(req => req.status === 'Cancelled')
                    .reduce((sum, req) => sum + req.quantity, 0);
                
                // Calculate transaction count by status
                const releasedCount = customerTransactions.filter(req => req.status === 'Released').length;
                const rejectedCount = customerTransactions.filter(req => req.status === 'Rejected').length;
                const cancelledCount = customerTransactions.filter(req => req.status === 'Cancelled').length;
                
                setStats({
                    totalTransactions: customerTransactions.length,
                    totalQuantity,
                    totalSpent,
                    pendingRequests,
                    releasedQuantity,
                    rejectedQuantity,
                    cancelledQuantity,
                    releasedCount,
                    rejectedCount,
                    cancelledCount,
                });
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
            toast.error("Failed to load customer details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async () => {
        if (!customer) return;

        if (!confirm(`Upgrade ${getUserDisplayName(customer)} to a client account?`)) {
            return;
        }

        setIsUpgrading(true);
        try {
            const response = await customerService.upgradeToClient(customer.id);
            if (response.success) {
                toast.success("Customer upgraded successfully!", {
                    description: `${customer.first_name} ${customer.last_name} now has a client account (${response.data.client.client_id}). An email with login credentials has been sent to ${customer.email}`,
                    duration: 10000,
                });

                // Show temporary password in a separate toast (backup in case email fails)
                toast.info("Backup: Temporary Password", {
                    description: `Password: ${response.data.temporary_password}\n\nAn email was sent to the client, but you can provide this password as backup if needed.`,
                    duration: 15000,
                });

                // Redirect to customer list after successful upgrade
                setTimeout(() => {
                    navigate('/customer');
                }, 2000);
            }
        } catch (error) {
            console.error("Error upgrading customer:", error);
            toast.error("Failed to upgrade customer", {
                description: error.response?.data?.message || "Please try again"
            });
        } finally {
            setIsUpgrading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'Pending': 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
            'Approved': 'bg-blue-50 text-blue-700 ring-blue-600/20',
            'Released': 'bg-green-50 text-green-700 ring-green-600/20',
            'Rejected': 'bg-red-50 text-red-700 ring-red-600/20',
            'Cancelled': 'bg-gray-50 text-gray-700 ring-gray-600/20',
        };
        
        return (
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColors[status] || 'bg-gray-50 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading customer details...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <p className="text-lg font-semibold">Customer not found</p>
                    <Button onClick={() => navigate('/customer')} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Customers
                    </Button>
                </div>
            </div>
        );
    }

    const fullName = getUserDisplayName(customer);
    const fullAddress = `${customer.barangay}, ${customer.municipality}, ${customer.province}`;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/customer')}
                        className="mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Customers
                    </Button>
                    <h1 className="text-3xl font-bold">Customer Details</h1>
                    <p className="text-muted-foreground">Complete information and transaction history</p>
                </div>
                <Button
                    onClick={handleUpgrade}
                    disabled={isUpgrading || customer.upgraded_to_client_id}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isUpgrading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Upgrading...
                        </>
                    ) : customer.upgraded_to_client_id ? (
                        <>
                            Already Upgraded
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Upgrade to Client
                        </>
                    )}
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <Receipt className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                        <p className="text-xs text-muted-foreground">All time requests</p>
                        <div className="mt-3 space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-green-600">● Released:</span>
                                <span className="font-semibold">{stats.releasedCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-600">● Rejected:</span>
                                <span className="font-semibold">{stats.rejectedCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">● Cancelled:</span>
                                <span className="font-semibold">{stats.cancelledCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Seedlings</CardTitle>
                        <Package className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuantity.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Seedlings received</p>
                        <div className="mt-3 space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-green-600">● Released:</span>
                                <span className="font-semibold">{stats.releasedQuantity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-600">● Rejected:</span>
                                <span className="font-semibold">{stats.rejectedQuantity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">● Cancelled:</span>
                                <span className="font-semibold">{stats.cancelledQuantity.toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱{stats.totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Total payments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Calendar className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
            </div>

            {/* Customer Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Customer contact and address details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Customer ID</p>
                                <p className="text-base font-semibold">{customer.customer_id}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="text-base font-semibold">{fullName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Organization</p>
                                <p className="text-base font-semibold">{customer.organization || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-base font-semibold">{customer.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                                <p className="text-base font-semibold">{customer.contact_number}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="text-base font-semibold">{fullAddress}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Added On</p>
                                <p className="text-base font-semibold">{formatDate(customer.created_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                <p className="text-base font-semibold">{formatDate(customer.updated_at)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All seedling requests and distributions</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Seedling Type</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Total Price</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{formatDate(transaction.requested_date)}</TableCell>
                                            <TableCell>{transaction.seedling_type}</TableCell>
                                            <TableCell className="text-right">{transaction.quantity.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                ₱{parseFloat(transaction.total_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">{transaction.purpose}</TableCell>
                                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No transactions found for this customer</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerDetails;
