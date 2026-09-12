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
    Sprout,
} from "lucide-react";
import AddSeedlings from "./AddSeedlings";

const productionBatches = [
    {
        id: "BAT-001",
        seedlingType: "Mahogany",
        scientificName: "Swietenia macrophylla",
        dateSown: "June 10, 2026",
        expectedReady: "September 15, 2026",
        quantitySown: 2500,
        currentQuantity: 2380,
        stage: "Hardening",
        location: "Hardening Area A",
        assignedStaff: "Juan Dela Cruz",
    },
    {
        id: "BAT-002",
        seedlingType: "Gmelina",
        scientificName: "Gmelina arborea",
        dateSown: "July 5, 2026",
        expectedReady: "October 10, 2026",
        quantitySown: 2000,
        currentQuantity: 1925,
        stage: "Seedling",
        location: "Nursery Area B",
        assignedStaff: "Maria Santos",
    },
    {
        id: "BAT-003",
        seedlingType: "Narra",
        scientificName: "Pterocarpus indicus",
        dateSown: "August 1, 2026",
        expectedReady: "November 15, 2026",
        quantitySown: 1500,
        currentQuantity: 1420,
        stage: "Germination",
        location: "Germination Area A",
        assignedStaff: "Pedro Reyes",
    },
    {
        id: "BAT-004",
        seedlingType: "Mangium",
        scientificName: "Acacia mangium",
        dateSown: "May 20, 2026",
        expectedReady: "August 25, 2026",
        quantitySown: 1200,
        currentQuantity: 1120,
        stage: "Ready",
        location: "Ready Stock Area",
        assignedStaff: "Ana Garcia",
    },
    {
        id: "BAT-005",
        seedlingType: "Tindalo",
        scientificName: "Afzelia rhomboidea",
        dateSown: "July 20, 2026",
        expectedReady: "October 30, 2026",
        quantitySown: 1000,
        currentQuantity: 940,
        stage: "Seedling",
        location: "Nursery Area C",
        assignedStaff: "Jose Ramos",
    },
];

const ProductionTable = () => {
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredBatches = useMemo(() => {
        return productionBatches.filter((batch) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                batch.id.toLowerCase().includes(searchTerm) ||
                batch.seedlingType.toLowerCase().includes(searchTerm) ||
                batch.scientificName.toLowerCase().includes(searchTerm) ||
                batch.location.toLowerCase().includes(searchTerm) ||
                batch.assignedStaff.toLowerCase().includes(searchTerm) ||
                batch.stage.toLowerCase().includes(searchTerm);

            const matchesStage =
                stageFilter === "all" ||
                batch.stage.toLowerCase() === stageFilter;

            return matchesSearch && matchesStage;
        });
    }, [search, stageFilter]);

    const totalPages = Math.ceil(
        filteredBatches.length / itemsPerPage
    );

    const paginatedBatches = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredBatches.slice(
            startIndex,
            endIndex
        );
    }, [filteredBatches, currentPage]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStageChange = (value) => {
        setStageFilter(value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const startItem =
        filteredBatches.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredBatches.length
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
                                placeholder="Search production batches..."
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
                            value={stageFilter}
                            onValueChange={handleStageChange}
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue placeholder="Production Stage" />
                            </SelectTrigger>

                            <SelectContent position="popper">
                                <SelectItem value="all">
                                    All Stages
                                </SelectItem>
                                <SelectItem value="germination">
                                    Germination
                                </SelectItem>
                                <SelectItem value="seedling">
                                    Seedling
                                </SelectItem>
                                <SelectItem value="hardening">
                                    Hardening
                                </SelectItem>
                                <SelectItem value="ready">
                                    Ready
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <AddSeedlings />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Seedling Type</TableHead>
                            <TableHead>Date Sown</TableHead>
                            <TableHead>Expected Ready</TableHead>
                            <TableHead>Quantity Sown</TableHead>
                            <TableHead>Current Quantity</TableHead>
                            <TableHead>Survivability</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedBatches.length > 0 ? (
                            paginatedBatches.map((batch) => (
                                <TableRow key={batch.id}>
                                    <TableCell>
                                        {batch.id}
                                    </TableCell>

                                    <TableCell>
                                        {batch.seedlingType}
                                    </TableCell>

                                    <TableCell>
                                        {batch.dateSown}
                                    </TableCell>

                                    <TableCell>
                                        {batch.expectedReady}
                                    </TableCell>

                                    <TableCell>
                                        {batch.quantitySown.toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        {batch.currentQuantity.toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        {batch.quantitySown > 0
                                            ? `${(
                                                (batch.currentQuantity /
                                                    batch.quantitySown) *
                                                100
                                            ).toFixed(1)}%`
                                            : "0.0%"}
                                    </TableCell>

                                    <TableCell>
                                        {batch.stage}
                                    </TableCell>

                                    <TableCell>
                                        {batch.location}
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
                                                    View Production Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>
                                                    <Pencil />
                                                    Edit Production
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>
                                                    <Sprout />
                                                    Update Stage
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Archive />
                                                    Archive Batch
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
                                    <Sprout className="mx-auto" />
                                    No production batches found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredBatches.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredBatches.length}`
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

export default ProductionTable;