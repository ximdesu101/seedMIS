import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserDisplayName } from "@/utils/nameHelper";
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Eye,
    Search,
    Ghost,
    Loader2,
    UserPlus,
    MoreVertical,
    Pencil,
} from "lucide-react";
import AddWalkinCustomer from "./AddWalkinClient";
import EditCustomer from "./EditCustomer";
import customerService from "@/services/customerService";
import { toast } from "sonner";

const CustomerTable = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch customers from API
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerService.getAllCustomers();
            if (response.success) {
                setCustomers(response.data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to load customers", {
                description: "Please make sure the backend server is running"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerAdded = () => {
        fetchCustomers(); // Refresh the list when a new customer is added
    };

    const handleDeleteCustomer = async (id, customerName) => {
        if (!confirm(`Are you sure you want to delete ${customerName}?`)) {
            return;
        }

        try {
            const response = await customerService.deleteCustomer(id);
            if (response.success) {
                toast.success("Customer deleted successfully!", {
                    description: `${customerName} has been removed from the system.`
                });
                fetchCustomers(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
            toast.error("Failed to delete customer", {
                description: error.response?.data?.message || "Please try again"
            });
        }
    };

    const handleUpgradeClick = (customer) => {
        // Show warning toast with both Cancel and Upgrade actions
        toast.warning("Upgrade Customer to Client Account?", {
            description: `This will create a client account for ${getUserDisplayName(customer)}. A temporary password will be sent to ${customer.email}. Continue?`,
            duration: 10000,
            cancel: {
                label: "Cancel",
                onClick: () => {
                    toast.info("Upgrade cancelled");
                }
            },
            action: {
                label: "Upgrade",
                onClick: () => handleUpgradeConfirm(customer)
            },
        });
    };

    const handleUpgradeConfirm = async (customer) => {
        const upgradeToast = toast.loading("Upgrading customer account...", {
            description: "Please wait while we create the client account."
        });

        try {
            const response = await customerService.upgradeToClient(customer.id);
            if (response.success) {
                toast.success("Customer upgraded successfully!", {
                    id: upgradeToast,
                    description: `${customer.first_name} ${customer.last_name} now has a client account (${response.data.client.client_id}). Temporary password: ${response.data.temporary_password}`,
                    duration: 15000,
                });

                fetchCustomers(); // Refresh the list
            }
        } catch (error) {
            console.error("Error upgrading customer:", error);
            toast.error("Failed to upgrade customer", {
                id: upgradeToast,
                description: error.response?.data?.message || "Please try again"
            });
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const searchTerm = search.toLowerCase().trim();
            const fullName = getUserDisplayName(customer).toLowerCase();
            const fullAddress = `${customer.barangay}, ${customer.municipality}, ${customer.province}`.toLowerCase();
            
            const matchesSearch =
                customer.customer_id.toLowerCase().includes(searchTerm) ||
                customer.first_name.toLowerCase().includes(searchTerm) ||
                customer.last_name.toLowerCase().includes(searchTerm) ||
                fullName.includes(searchTerm) ||
                (customer.organization && customer.organization.toLowerCase().includes(searchTerm)) ||
                fullAddress.includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm) ||
                customer.contact_number.includes(searchTerm);
            
            // Status filter based on database status
            const matchesStatus = 
                statusFilter === "all" || 
                (statusFilter === "active" && customer.status === "Active") ||
                (statusFilter === "deactivated" && customer.status === "Inactive");
            
            return matchesSearch && matchesStatus;
        });
    }, [customers, search, statusFilter]);

    const totalPages = Math.ceil(
        filteredCustomers.length / itemsPerPage
    );

    const paginatedCustomers = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredCustomers.slice(
            startIndex,
            endIndex
        );
    }, [filteredCustomers, currentPage]);

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
        filteredCustomers.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredCustomers.length
    );


    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                <div className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            type="search"
                            placeholder="Search..."
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

                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="Account Status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="active">Active Customers</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AddWalkinCustomer onCustomerAdded={handleCustomerAdded} />
        </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer ID</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-32">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Loading customers...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedCustomers.length > 0 ? (
                            paginatedCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.customer_id}</TableCell>
                                    <TableCell>
                                        {getUserDisplayName(customer)}
                                    </TableCell>
                                    <TableCell>{customer.organization || '-'}</TableCell>
                                    <TableCell>
                                        {customer.barangay}, {customer.municipality}, {customer.province}
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.contact_number}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                            customer.status === 'Active'
                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                : 'bg-red-50 text-red-700 ring-red-600/20'
                                        }`}>
                                            {customer.status || 'Active'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/customer/${customer.id}`)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <EditCustomer 
                                                        customer={customer}
                                                        onCustomerUpdated={fetchCustomers}
                                                        trigger={
                                                            <div className="flex items-center w-full">
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Edit Customer
                                                            </div>
                                                        }
                                                    />
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpgradeClick(customer)}
                                                    className="text-blue-600 focus:text-blue-700"
                                                >
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Upgrade to Client
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-32">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Ghost className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">No customers found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredCustomers.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredCustomers.length}`
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

export default CustomerTable;
