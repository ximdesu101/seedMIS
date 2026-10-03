import { useState, useMemo, useEffect } from "react";
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

const DistributeTable = ({ dateRange }) => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchDistributions();
    }, [dateRange]); // Re-fetch when dateRange changes

    const fetchDistributions = async () => {
        try {
            setLoading(true);
            const response = await requestService.getAllRequests();
            if (response.success) {
                // Filter only Released status
                let releasedRequests = response.data.filter(
                    request => request.status === 'Released'
                );

                // Filter by date range if provided
                if (dateRange && dateRange.startDate && dateRange.endDate) {
                    releasedRequests = releasedRequests.filter(request => {
                        // Use requested_date if available, otherwise fall back to updated_at
                        const dateToCheck = request.requestedDate 
                            ? new Date(request.requestedDate) 
                            : new Date(request.updated_at);
                        
                        const startDate = new Date(dateRange.startDate);
                        const endDate = new Date(dateRange.endDate);
                        
                        // Set time to start/end of day for proper comparison
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                        
                        return dateToCheck >= startDate && dateToCheck <= endDate;
                    });
                }

                setDistributions(releasedRequests);
            }
        } catch (error) {
            console.error('Error fetching distributions:', error);
            alert('Failed to load distribution records');
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return distributions.filter((request) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                request.requester?.toLowerCase().includes(searchTerm) ||
                request.organization?.toLowerCase().includes(searchTerm) ||
                request.seedlingType?.toLowerCase().includes(searchTerm) ||
                request.purpose?.toLowerCase().includes(searchTerm);

           
            return matchesSearch;
        });
    }, [search, distributions]);

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
                            <TableHead>Date Requested</TableHead>
                            <TableHead>Released Date</TableHead>
                            <TableHead>Status</TableHead>
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
                                        {new Date(request.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </TableCell>

                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            {request.status}
                                        </span>
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="text-center"
                                >
                                    No released seedlings found.
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