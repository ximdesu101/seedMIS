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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Ellipsis,
    Eye,
    Pencil,
    Check,
    X,
    PackageCheck,
} from "lucide-react";

const seedlingRequests = [
    {
        id: "REQ-001",
        requester: "Juan Dela Cruz",
        organization: "San Jorge Municipal Agriculture Office",
        seedlingType: "Mahogany",
        quantity: 500,
        purpose: "Community Reforestation",
        requestedDate: "September 2, 2026",
        priority: "High",
        status: "Pending",
    },
    {
        id: "REQ-002",
        requester: "Maria Santos",
        organization: "San Jorge Elementary School",
        seedlingType: "Narra",
        quantity: 200,
        purpose: "School Greening Program",
        requestedDate: "September 3, 2026",
        priority: "Medium",
        status: "Approved",
    },
    {
        id: "REQ-003",
        requester: "Pedro Reyes",
        organization: "Barangay San Isidro",
        seedlingType: "Gmelina",
        quantity: 1000,
        purpose: "Barangay Reforestation",
        requestedDate: "September 4, 2026",
        priority: "High",
        status: "Released",
    },
    {
        id: "REQ-004",
        requester: "Ana Garcia",
        organization: "San Jorge Farmers Association",
        seedlingType: "Mangium",
        quantity: 750,
        purpose: "Farm Boundary Planting",
        requestedDate: "September 5, 2026",
        priority: "Low",
        status: "Pending",
    },
    {
        id: "REQ-005",
        requester: "Jose Ramos",
        organization: "Green Earth Organization",
        seedlingType: "Tindalo",
        quantity: 300,
        purpose: "Environmental Restoration",
        requestedDate: "September 6, 2026",
        priority: "Medium",
        status: "Rejected",
    },
];

const RequestTable = () => {
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredRequests = useMemo(() => {
        return seedlingRequests.filter((request) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                request.id.toLowerCase().includes(searchTerm) ||
                request.requester.toLowerCase().includes(searchTerm) ||
                request.organization.toLowerCase().includes(searchTerm) ||
                request.seedlingType.toLowerCase().includes(searchTerm) ||
                request.purpose.toLowerCase().includes(searchTerm) ||
                request.priority.toLowerCase().includes(searchTerm) ||
                request.status.toLowerCase().includes(searchTerm);

            const matchesPriority =
                priorityFilter === "all" ||
                request.priority.toLowerCase() === priorityFilter;

            const matchesStatus =
                statusFilter === "all" ||
                request.status.toLowerCase() === statusFilter;

            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus
            );
        });
    }, [search, priorityFilter, statusFilter]);

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

    const handlePriorityChange = (value) => {
        setPriorityFilter(value);
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
                            value={priorityFilter}
                            onValueChange={handlePriorityChange}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>

                            <SelectContent position="popper">
                                <SelectItem value="all">
                                    All Priorities
                                </SelectItem>
                                <SelectItem value="high">
                                    High
                                </SelectItem>
                                <SelectItem value="medium">
                                    Medium
                                </SelectItem>
                                <SelectItem value="low">
                                    Low
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                                <SelectItem value="released">
                                    Released
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Seedling Type</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Requested Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedRequests.length > 0 ? (
                            paginatedRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>
                                        {request.id}
                                    </TableCell>

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
                                        {request.quantity.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="max-w-[180px] truncate">
                                        {request.purpose}
                                    </TableCell>

                                    <TableCell>
                                        {request.requestedDate}
                                    </TableCell>

                                    <TableCell>
                                        {request.priority}
                                    </TableCell>

                                    <TableCell>
                                        {request.status}
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
                                                <DropdownMenuItem>
                                                    <Eye />
                                                    View Request Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>
                                                    <Pencil />
                                                    Edit Request
                                                </DropdownMenuItem>

                                                {request.status ===
                                                    "Pending" && (
                                                        <>
                                                            <DropdownMenuItem>
                                                                <Check />
                                                                Approve Request
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem>
                                                                <X />
                                                                Reject Request
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                {request.status ===
                                                    "Approved" && (
                                                        <DropdownMenuItem>
                                                            <PackageCheck />
                                                            Release Seedlings
                                                        </DropdownMenuItem>
                                                    )}

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    Archive Request
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
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