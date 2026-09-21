import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import inventoryService from "@/services/inventoryService";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Ellipsis,
    Pencil,
} from "lucide-react";
import UpdateInventory from "./UpdateInventory";
import ViewBatches from "./ViewBatches";

const InventoryTable = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchInventories();
    }, []);

    const fetchInventories = async () => {
        try {
            setLoading(true);
            const response = await inventoryService.getAllInventories();
            if (response.success) {
                setInventories(response.data);
            }
        } catch (error) {
            console.error('Error fetching inventories:', error);
            alert('Failed to load inventories');
        } finally {
            setLoading(false);
        }
    };

    const filteredSeedlings = useMemo(() => {
        return inventories.filter((item) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                item.seedling_type?.toLowerCase().includes(searchTerm) ||
                item.classification?.toLowerCase().includes(searchTerm) ||
                item.location?.toLowerCase().includes(searchTerm);

            const totalQty = item.total_quantity || 0;
            const status = totalQty > 0 ? 'available' : 'out of stock';
            const matchesStatus =
                statusFilter === "all" || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, inventories]);

    const totalPages = Math.ceil(filteredSeedlings.length / itemsPerPage);

    const paginatedSeedlings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSeedlings.slice(startIndex, endIndex);
    }, [filteredSeedlings, currentPage]);

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

    const startItem = filteredSeedlings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredSeedlings.length);

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-80">
                        <InputGroup>
                            <InputGroupInput
                                id="search"
                                type="search"
                                placeholder="Search seedlings..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div>
                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-52">
                                <SelectValue placeholder="All Seedlings" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="all">All Seedlings</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="out of stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px] min-w-[350px]">Seedling Information</TableHead>
                            <TableHead>Classification</TableHead>
                            <TableHead>Total Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : paginatedSeedlings.length > 0 ? (
                            paginatedSeedlings.map((item) => {
                                const totalQty = item.total_quantity || 0;
                                const batchCount = item.batch_count || 0;
                                
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="w-[350px] min-w-[350px]">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    {item.image_url ? (
                                                        <img
                                                            src={`http://localhost:8000/${item.image_url}`}
                                                            alt={item.seedling_type}
                                                            className="w-20 h-24 object-cover rounded-md border"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = '<div class="w-20 h-24 flex items-center justify-center bg-gray-100 rounded-md border"><span class="text-gray-400 text-xs">Photo</span></div>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-24 flex items-center justify-center bg-gray-100 rounded-md border">
                                                            <span className="text-gray-400 text-xs">Photo</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 max-w-[240px]">
                                                    <h3 className="font-semibold text-sm text-primary mb-1 truncate">
                                                        {item.seedling_type}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mb-1 truncate">
                                                        Classification: {item.classification || 'N/A'}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                                                            {batchCount} {batchCount === 1 ? 'Total Batch'  : 'Total Batch'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.classification}</TableCell>
                                        <TableCell>{totalQty.toLocaleString()}</TableCell>
                                        <TableCell>₱{parseFloat(item.price_per_unit).toFixed(2)}</TableCell>
                                        <TableCell>{item.location || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                totalQty > 0 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-red-50 text-red-700'
                                            }`}>
                                                {totalQty > 0 ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Ellipsis />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-full">
                                                    <ViewBatches inventory={item} />
                                                    <UpdateInventory inventory={item} onUpdate={fetchInventories} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No inventory found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredSeedlings.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredSeedlings.length}`
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
                                                goToPage(currentPage - 1);
                                            }
                                        }}
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === page}
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
                                            if (currentPage < totalPages) {
                                                goToPage(currentPage + 1);
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

export default InventoryTable;
