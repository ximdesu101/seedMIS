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
    Archive,
    SlidersHorizontal,
} from "lucide-react";

const seedlings = [
    {
        id: "INV-001",
        seedlingType: "Mahogany",
        scientificName: "Swietenia macrophylla",
        quantity: 2500,
        available: 2200,
        dateAdded: "September 1, 2026",
        age: "3 months",
        status: "Available",
    },
    {
        id: "INV-002",
        seedlingType: "Gmelina",
        scientificName: "Gmelina arborea",
        quantity: 1800,
        available: 1650,
        dateAdded: "September 2, 2026",
        age: "2 months",
        status: "Available",
    },
    {
        id: "INV-003",
        seedlingType: "Narra",
        scientificName: "Pterocarpus indicus",
        quantity: 1200,
        available: 900,
        dateAdded: "September 3, 2026",
        age: "4 months",
        status: "Available",
    },
    {
        id: "INV-004",
        seedlingType: "Mangium",
        scientificName: "Acacia mangium",
        quantity: 950,
        available: 0,
        dateAdded: "September 4, 2026",
        age: "3 months",
        status: "Out of Stock",
    },
    {
        id: "INV-005",
        seedlingType: "Tindalo",
        scientificName: "Afzelia rhomboidea",
        quantity: 750,
        available: 620,
        dateAdded: "September 5, 2026",
        age: "2 months",
        status: "Available",
    },
];

const InventoryTable = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredSeedlings = useMemo(() => {
        return seedlings.filter((seedling) => {
            const searchTerm = search.toLowerCase().trim();
            const matchesSearch =
                seedling.id.toLowerCase().includes(searchTerm) ||
                seedling.seedlingType.toLowerCase().includes(searchTerm) ||
                seedling.scientificName.toLowerCase().includes(searchTerm) ||
                seedling.location.toLowerCase().includes(searchTerm) ||
                seedling.age.toLowerCase().includes(searchTerm) ||
                seedling.status.toLowerCase().includes(searchTerm);

            const matchesStatus =
                statusFilter === "all" ||
                seedling.status.toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    const totalPages = Math.ceil(
        filteredSeedlings.length / itemsPerPage
    );

    const paginatedSeedlings = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredSeedlings.slice(
            startIndex,
            endIndex
        );
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

    const startItem =
        filteredSeedlings.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredSeedlings.length
    );


    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <div className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            type="search"
                            placeholder="Search seedlings..."
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
                        <SelectValue placeholder="Inventory Status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="all">All Seedlings</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="out of stock">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Seedling Type</TableHead>
                            <TableHead>Scientific Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedSeedlings.length > 0 ? (
                            paginatedSeedlings.map((seedling) => (
                                <TableRow key={seedling.id}>
                                    <TableCell>{seedling.id}</TableCell>
                                    <TableCell>{seedling.seedlingType}</TableCell>
                                    <TableCell className="text-muted-foreground">{seedling.scientificName}</TableCell>
                                    <TableCell>{seedling.quantity.toLocaleString()}</TableCell>
                                    <TableCell>{seedling.available.toLocaleString()}</TableCell>
                                    <TableCell>{seedling.dateAdded}</TableCell>
                                    <TableCell>{seedling.age}</TableCell>
                                    <TableCell>{seedling.status}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Ellipsis />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-full">
                                                <DropdownMenuItem>
                                                    <Eye />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Pencil />
                                                    Edit Seedling
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <SlidersHorizontal />
                                                    Adjust Quantity
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Archive />
                                                    Archive
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))

                        ) : (

                            <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                    <Ghost className="mx-auto" />
                                    No seedlings found.
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

export default InventoryTable;