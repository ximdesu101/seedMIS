import { useState, useMemo } from "react";
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
    Ghost
} from "lucide-react";
import AddClient from "./AddClient";

const clients = [
    {
        id: "CLI-001",
        firstName: "Juan",
        lastName: "Dela Cruz",
        organization: "Green Valley Cooperative",
        address: "San Jorge, Samar",
        email: "juan.delacruz@example.com",
        contactNumber: "0917 123 4567",
        status: "Active",
    },
    {
        id: "CLI-002",
        firstName: "Maria",
        lastName: "Santos",
        organization: "San Jorge Farmers Association",
        address: "San Jorge, Samar",
        email: "maria.santos@example.com",
        contactNumber: "0918 234 5678",
        status: "Active",
    },
];

const ClientTable = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const searchTerm = search.toLowerCase().trim();
            const matchesSearch =
                client.id.toLowerCase().includes(searchTerm) ||
                client.firstName.toLowerCase().includes(searchTerm) ||
                client.lastName.toLowerCase().includes(searchTerm) ||
                `${client.firstName} ${client.lastName}`
                    .toLowerCase()
                    .includes(searchTerm) ||
                client.organization.toLowerCase().includes(searchTerm) ||
                client.address.toLowerCase().includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm) ||
                client.contactNumber.toLowerCase().includes(searchTerm) ||
                client.status.toLowerCase().includes(searchTerm);
            const matchesStatus =
                statusFilter === "all" ||
                client.status.toLowerCase() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

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
            <AddClient />
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
                        {paginatedClients.length > 0 ? (
                            paginatedClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.id}</TableCell>
                                    <TableCell>{client.firstName}{" "}{client.lastName}</TableCell>
                                    <TableCell>{client.organization}</TableCell>
                                    <TableCell>{client.address}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.contactNumber}</TableCell>
                                    <TableCell>{client.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="icon">
                                            <Trash />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))

                        ) : (

                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    <Ghost className="mx-auto" />
                                    No clients found.
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