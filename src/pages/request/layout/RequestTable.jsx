import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import requestService from "@/services/requestService";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Ellipsis,
    Eye,
    Check,
    X,
    PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import NewRequest from "./NewRequest";

const RequestTable = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await requestService.getAllRequests();
            if (response.success) {
                // Exclude Released status - they should appear in DistributeTable
                const activeRequests = response.data.filter(
                    request => request.status !== 'Released'
                );
                setRequests(activeRequests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            alert('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    // Handler for when a new request is added
    const handleRequestAdded = () => {
        fetchRequests(); // Refresh the list
    };

    // Handle reject request
    const handleRejectRequest = (requestId) => {
        // Find the request to show details in confirmation
        const request = requests.find(r => r.id === requestId);
        
        if (!request) {
            toast.error('Request not found');
            return;
        }

        // Show warning toast with action buttons
        toast.warning('Reject this request?', {
            description: `Requester: ${request.requester}\nSeedling: ${request.seedlingType}\nQuantity: ${request.quantity}\n\nThe reserved quantity will be returned to inventory.`,
            duration: 10000,
            action: {
                label: 'Reject Request',
                onClick: async () => {
                    try {
                        // Get user data from localStorage
                        const user = JSON.parse(localStorage.getItem('user'));
                        const userType = localStorage.getItem('userType');

                        const response = await requestService.updateRequest(requestId, {
                            status: 'Rejected',
                            user_id: user?.id || null,
                            user_type: userType || null,
                        });

                        if (response.success) {
                            toast.success('Request Rejected', {
                                description: `${request.quantity} ${request.seedlingType} seedlings returned to inventory.`,
                            });
                            fetchRequests(); // Refresh the list
                        }
                    } catch (error) {
                        console.error('Error rejecting request:', error);
                        
                        if (error.response?.data?.message) {
                            toast.error('Rejection Failed', {
                                description: error.response.data.message,
                            });
                        } else {
                            toast.error('Failed to reject request. Please try again.');
                        }
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            }
        });
    };

    // Handle approve request
    const handleApproveRequest = (requestId) => {
        // Find the request to show details in confirmation
        const request = requests.find(r => r.id === requestId);
        
        if (!request) {
            toast.error('Request not found');
            return;
        }

        // Show info toast with action buttons
        toast.info('Approve this request?', {
            description: `Requester: ${request.requester}\nSeedling: ${request.seedlingType}\nQuantity: ${request.quantity}\n\nThe seedlings will remain reserved until released.`,
            duration: 10000,
            action: {
                label: 'Approve',
                onClick: async () => {
                    try {
                        // Get user data from localStorage
                        const user = JSON.parse(localStorage.getItem('user'));
                        const userType = localStorage.getItem('userType');

                        const response = await requestService.updateRequest(requestId, {
                            status: 'Approved',
                            user_id: user?.id || null,
                            user_type: userType || null,
                        });

                        if (response.success) {
                            toast.success('Request Approved!', {
                                description: `${request.quantity} ${request.seedlingType} seedlings approved for ${request.requester}. Ready for release.`,
                            });
                            fetchRequests(); // Refresh the list
                        }
                    } catch (error) {
                        console.error('Error approving request:', error);
                        
                        if (error.response?.data?.message) {
                            toast.error('Approval Failed', {
                                description: error.response.data.message,
                            });
                        } else {
                            toast.error('Failed to approve request. Please try again.');
                        }
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            }
        });
    };

    // Handle release seedlings
    const handleReleaseSeedlings = (requestId) => {
        // Find the request to show details in confirmation
        const request = requests.find(r => r.id === requestId);
        
        if (!request) {
            toast.error('Request not found');
            return;
        }

        // Show warning toast with action buttons for final confirmation
        toast.warning('Release these seedlings?', {
            description: `Requester: ${request.requester}\nSeedling: ${request.seedlingType}\nQuantity: ${request.quantity}\n\nThis will complete the request and finalize the transaction.`,
            duration: 10000,
            action: {
                label: 'Release Now',
                onClick: async () => {
                    try {
                        // Get user data from localStorage
                        const user = JSON.parse(localStorage.getItem('user'));
                        const userType = localStorage.getItem('userType');

                        const response = await requestService.updateRequest(requestId, {
                            status: 'Released',
                            user_id: user?.id || null,
                            user_type: userType || null,
                        });

                        if (response.success) {
                            toast.success('Seedlings Released!', {
                                description: `${request.quantity} ${request.seedlingType} seedlings released to ${request.requester}. Request completed.`,
                            });
                            fetchRequests(); // Refresh the list
                        }
                    } catch (error) {
                        console.error('Error releasing seedlings:', error);
                        
                        if (error.response?.data?.message) {
                            toast.error('Release Failed', {
                                description: error.response.data.message,
                            });
                        } else {
                            toast.error('Failed to release seedlings. Please try again.');
                        }
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            }
        });
    };

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                request.requester?.toLowerCase().includes(searchTerm) ||
                request.organization?.toLowerCase().includes(searchTerm) ||
                request.seedlingType?.toLowerCase().includes(searchTerm) ||
                request.purpose?.toLowerCase().includes(searchTerm) ||
                request.status?.toLowerCase().includes(searchTerm);

            const matchesStatus =
                statusFilter === "all" ||
                request.status?.toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, requests]);

    const totalPages = Math.ceil(
        filteredRequests.length / itemsPerPage
    );

    const paginatedRequests = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredRequests.slice(
            startIndex,
            endIndex
        );
    }, [filteredRequests, currentPage]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const startItem =
        filteredRequests.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredRequests.length
    );

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-80">
                        <InputGroup>
                            <InputGroupInput
                                id="search"
                                type="search"
                                placeholder="Search requests..."
                                value={search}
                                onChange={(e) =>
                                    handleSearch(e.target.value)
                                }
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div>
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent position="popper">
                                <SelectItem value="all">
                                    All Status
                                </SelectItem>
                                <SelectItem value="pending">
                                    Pending
                                </SelectItem>
                                <SelectItem value="approved">
                                    Approved
                                </SelectItem>
                                <SelectItem value="rejected">
                                    Rejected
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <NewRequest onRequestAdded={handleRequestAdded} />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Requester</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Various Seedling</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Requested Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : paginatedRequests.length > 0 ? (
                            paginatedRequests.map((request) => (
                                <TableRow key={request.id}>

                                    <TableCell>
                                        {request.requester}
                                    </TableCell>

                                    <TableCell className="max-w-[180px] truncate">
                                        {request.organization}
                                    </TableCell>

                                    <TableCell>
                                        {request.seedlingType}
                                    </TableCell>

                                    <TableCell>
                                        {request.quantity?.toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        ₱{parseFloat(request.totalPrice || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>

                                    <TableCell className="max-w-[180px] truncate">
                                        {request.purpose}
                                    </TableCell>

                                    <TableCell>
                                        {request.requestedDate}
                                    </TableCell>

                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            request.status === 'Pending' 
                                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                : request.status === 'Approved'
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : request.status === 'Released'
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Ellipsis />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="w-full"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => navigate(`/requests/${request.id}`)}
                                                >
                                                    <Eye />
                                                    View Request Details
                                                </DropdownMenuItem>

                                                {request.status ===
                                                    "Pending" && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleApproveRequest(request.id)}
                                                            >
                                                                <Check />
                                                                Approve Request
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => handleRejectRequest(request.id)}
                                                                className="text-red-600"
                                                            >
                                                                <X />
                                                                Reject Request
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                {request.status ===
                                                    "Approved" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleReleaseSeedlings(request.id)}
                                                        >
                                                            <PackageCheck />
                                                            Release Seedlings
                                                        </DropdownMenuItem>
                                                    )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="text-center"
                                >
                                    No seedling requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredRequests.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredRequests.length}`
                            : "No results"}
                    </div>

                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (currentPage > 1) {
                                                goToPage(
                                                    currentPage - 1
                                                );
                                            }
                                        }}
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={
                                                currentPage === page
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                goToPage(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (
                                                currentPage <
                                                totalPages
                                            ) {
                                                goToPage(
                                                    currentPage + 1
                                                );
                                            }
                                        }}
                                        className={
                                            currentPage === totalPages
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestTable;