import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    DollarSign,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    Sprout,
} from "lucide-react";
import requestService from "@/services/requestService";
import clientService from "@/services/clientService";
import { toast } from "sonner";

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequestData();
    }, [id]);

    const fetchRequestData = async () => {
        try {
            setLoading(true);
            
            // Fetch request details (includes client or customer data)
            const requestResponse = await requestService.getRequestById(id);
            if (requestResponse.success) {
                setRequest(requestResponse.data);
                
                // Set client from the request data (could be client or customer)
                if (requestResponse.data.requester_type === 'client' && requestResponse.data.client) {
                    setClient(requestResponse.data.client);
                } else if (requestResponse.data.requester_type === 'customer' && requestResponse.data.customer) {
                    setClient(requestResponse.data.customer);
                }
            }
        } catch (error) {
            console.error('Error fetching request data:', error);
            toast.error("Failed to load request details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pending': <Clock className="h-5 w-5 text-yellow-600" />,
            'Approved': <CheckCircle className="h-5 w-5 text-blue-600" />,
            'Released': <CheckCircle className="h-5 w-5 text-green-600" />,
            'Rejected': <XCircle className="h-5 w-5 text-red-600" />,
            'Cancelled': <XCircle className="h-5 w-5 text-gray-600" />,
        };
        return icons[status] || <Clock className="h-5 w-5" />;
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
            <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${statusColors[status] || 'bg-gray-50 text-gray-700'}`}>
                {getStatusIcon(status)}
                <span className="ml-2">{status}</span>
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
                    <p className="text-sm text-muted-foreground">Loading request details...</p>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <p className="text-lg font-semibold">Request not found</p>
                    <Button onClick={() => navigate('/requests')} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Requests
                    </Button>
                </div>
            </div>
        );
    }

    const fullName = client 
        ? `${client.first_name} ${client.middle_name ? client.middle_name + ' ' : ''}${client.last_name}`
        : 'N/A';
    const fullAddress = client 
        ? `${client.barangay}, ${client.municipality}, ${client.province}`
        : 'N/A';

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/requests')}
                        className="mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Requests
                    </Button>
                    <h1 className="text-3xl font-bold">Request Details</h1>
                    <p className="text-muted-foreground">Complete information about this seedling request</p>
                </div>
                <div>
                    {getStatusBadge(request.status)}
                </div>
            </div>

            {/* Request Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quantity Requested</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{request.quantity?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">{request.seedling_type}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Price per Unit</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₱{parseFloat(request.price_per_unit || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Per seedling</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₱{parseFloat(request.total_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Total payment</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Request Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Request Information</CardTitle>
                        <CardDescription>Details about the seedling request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Sprout className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Seedling Type</p>
                                <p className="text-base font-semibold">{request.seedling_type}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3">
                            <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Quantity</p>
                                <p className="text-base font-semibold">{request.quantity?.toLocaleString() || 0} seedlings</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Purpose</p>
                                <p className="text-base font-semibold">{request.purpose || 'N/A'}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Requested Date</p>
                                <p className="text-base font-semibold">{formatDate(request.requested_date)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <div className="mt-1">{getStatusBadge(request.status)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                        <CardDescription>Details about the requesting client</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {client ? (
                            <>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="text-base font-semibold">{fullName}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Organization</p>
                                        <p className="text-base font-semibold">{client.organization || 'N/A'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                                        <p className="text-base font-semibold">{request.contact_number || client.contact_number || 'N/A'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-base font-semibold">{client.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Address</p>
                                        <p className="text-base font-semibold">{fullAddress}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-center pt-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate(`/client/${client.id}`)}
                                        className="w-full"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        View Full Client Profile
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No client information available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Pricing Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Pricing Breakdown</CardTitle>
                    <CardDescription>Detailed cost calculation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Seedling Type</p>
                                <p className="font-semibold">{request.seedling_type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Quantity</p>
                                <p className="font-semibold">{request.quantity?.toLocaleString() || 0}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Price per Unit</p>
                                <p className="font-semibold">₱{parseFloat(request.price_per_unit || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                            <p className="text-lg font-semibold">Total Amount</p>
                            <p className="text-2xl font-bold text-green-700">
                                ₱{parseFloat(request.total_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline / Audit Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>Request activity history</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                            <div className="flex-1">
                                <p className="font-semibold">Request Created</p>
                                <p className="text-sm text-gray-600">{formatDateTime(request.created_at)}</p>
                            </div>
                        </div>

                        {request.updated_at !== request.created_at && (
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-600 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold">Last Updated</p>
                                    <p className="text-sm text-gray-600">{formatDateTime(request.updated_at)}</p>
                                </div>
                            </div>
                        )}

                        {request.status === 'Released' && (
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-600 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold">Released to Client</p>
                                    <p className="text-sm text-gray-600">{formatDate(request.requested_date)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequestDetails;
