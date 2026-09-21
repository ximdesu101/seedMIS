import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    Trash,
    Search,
    Ghost,
    Loader2
} from "lucide-react";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import clientService from "@/services/clientService";
import { toast } from "sonner";

const ClientTable = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch clients from API
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAllClients();
            if (response.success) {
                setClients(response.data);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Failed to load clients", {
                description: "Please make sure the backend server is running"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClientAdded = () => {
        fetchClients(); // Refresh the list when a new client is added
    };

    const handleDeleteClient = async (id, clientName) => {
        if (!confirm(`Are you sure you want to delete ${clientName}?`)) {
            return;
        }

        try {
            const response = await clientService.deleteClient(id);
            if (response.success) {
                toast.success("Client deleted successfully!", {
                    description: `${clientName} has been removed from the system.`
                });
                fetchClients(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error("Failed to delete client", {
                description: error.response?.data?.message || "Please try again"
            });
        }
    };

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const searchTerm = search.toLowerCase().trim();
            const fullName = `${client.first_name} ${client.middle_name || ''} ${client.last_name}`.toLowerCase();
            const fullAddress = `${client.barangay}, ${client.municipality}, ${client.province}`.toLowerCase();
            
            const matchesSearch =
                client.client_id.toLowerCase().includes(searchTerm) ||
                client.first_name.toLowerCase().includes(searchTerm) ||
                client.last_name.toLowerCase().includes(searchTerm) ||
                fullName.includes(searchTerm) ||
                client.organization.toLowerCase().includes(searchTerm) ||
                fullAddress.includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm) ||
                client.contact_number.includes(searchTerm);
            
            // Status filter - for now all clients are active
            // You can add a status field to your database later
            const matchesStatus = statusFilter === "all" || statusFilter === "active";
            
            return matchesSearch && matchesStatus;
        });
    }, [clients, search, statusFilter]);

    const totalPages = Math.ceil(
        filteredClients.length / itemsPerPage
    );

    const paginatedClients = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredClients.slice(
            startIndex,
            endIndex
        );
    }, [filteredClients, currentPage]);

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
        filteredClients.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredClients.length
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
                        <SelectItem value="all">All Accounts</SelectItem>
                        <SelectItem value="active">Active Accounts</SelectItem>
                        <SelectItem value="deactivated">Deactivated Accounts</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AddClient onClientAdded={handleClientAdded} />
        </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client ID</TableHead>
                            <TableHead>Client Name</TableHead>
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
                                        <p className="text-sm text-muted-foreground">Loading clients...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedClients.length > 0 ? (
                            paginatedClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.client_id}</TableCell>
                                    <TableCell>
                                        {client.first_name} {client.middle_name && `${client.middle_name} `}{client.last_name}
                                    </TableCell>
                                    <TableCell>{client.organization}</TableCell>
                                    <TableCell>
                                        {client.barangay}, {client.municipality}, {client.province}
                                    </TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.contact_number}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditClient 
                                                client={client} 
                                                onClientUpdated={fetchClients}
                                            />
                                            <Button 
                                                variant="destructive" 
                                                size="icon"
                                                onClick={() => handleDeleteClient(
                                                    client.id, 
                                                    `${client.first_name} ${client.last_name}`
                                                )}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-32">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Ghost className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">No clients found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredClients.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredClients.length}`
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

export default ClientTable;