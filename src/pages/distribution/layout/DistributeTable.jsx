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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Search,
} from "lucide-react";

const seedlingRequests = [
    {
        requester: "Juan Dela Cruz",
        organization: "San Jorge Municipal Agriculture Office",
        seedlingType: "Mahogany",
        quantity: 500,
        TotalPrices: "1500",
        purpose: "Community Reforestation",
        ReleasedDate: "September 2, 2026",
        status: "Released",
    },
    {
        requester: "Maria Santos",
        organization: "San Jorge Elementary School",
        seedlingType: "Narra",
        quantity: 200,
        TotalPrices: "1000",
        purpose: "School Greening Program",
        ReleasedDate: "September 3, 2026",
        status: "Released",
    },
    {
        requester: "Pedro Reyes",
        organization: "Barangay San Isidro",
        seedlingType: "Gmelina",
        quantity: 1000,
        TotalPrices: "2000",
        purpose: "Barangay Reforestation",
        ReleasedDate: "September 4, 2026",
        status: "Released",
    },
    {
        requester: "Ana Garcia",
        organization: "San Jorge Farmers Association",
        seedlingType: "Mangium",
        quantity: 750,
        TotalPrices: "1500",
        purpose: "Farm Boundary Planting",
        ReleasedDate: "September 5, 2026",
        status: "Released",
    },
    {
        requester: "Jose Ramos",
        organization: "Green Earth Organization",
        seedlingType: "Tindalo",
        quantity: 300,
        TotalPrices: "1200",
        purpose: "Environmental Restoration",
        ReleasedDate: "September 6, 2026",
        status: "Released",
    },
];

const DistributeTable = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredRequests = useMemo(() => {
        return seedlingRequests.filter((request) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                request.requester.toLowerCase().includes(searchTerm) ||
                request.organization.toLowerCase().includes(searchTerm) ||
                request.seedlingType.toLowerCase().includes(searchTerm) ||
                request.purpose.toLowerCase().includes(searchTerm) ||
                request.priority.toLowerCase().includes(searchTerm) ||
                request.status.toLowerCase().includes(searchTerm);

           
            return (
                matchesSearch
            );
        });
    }, [search]);

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
                </div>
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
                            <TableHead>Released Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedRequests.length > 0 ? (
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
                                        {request.quantity.toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        {request.TotalPrices}
                                    </TableCell>

                                    <TableCell className="max-w-[180px] truncate">
                                        {request.purpose}
                                    </TableCell>

                                    <TableCell>
                                        {request.ReleasedDate}
                                    </TableCell>

                                    <TableCell>
                                        {request.status}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="h-24 text-center"
                                >
                                    No results.
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

export default DistributeTable;