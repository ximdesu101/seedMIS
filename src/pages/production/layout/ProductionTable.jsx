import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import productionService from "@/services/productionService";
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
    Sprout,
} from "lucide-react";
import AddSeedlings from "./AddSeedlings";
import UpdateStage from "./UpdateStage";
import EditProduction from "./EditProduction";
import TransferToInventory from "./TransferToInventory";
import ViewAllHistory from "./ViewAllHistory";

const ProductionTable = () => {
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [productionBatches, setProductionBatches] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    // Fetch production batches and inventories from API
    useEffect(() => {
        fetchProductions();
        fetchInventories();
    }, []);

    const fetchProductions = async () => {
        try {
            setLoading(true);
            const response = await productionService.getAllProductions();
            if (response.success) {
                setProductionBatches(response.data);
            }
        } catch (error) {
            console.error('Error fetching production batches:', error);
            alert('Failed to load production batches');
        } finally {
            setLoading(false);
        }
    };

    const fetchInventories = async () => {
        try {
            const response = await inventoryService.getAllInventories();
            if (response.success) {
                setInventories(response.data);
            }
        } catch (error) {
            console.error('Error fetching inventories:', error);
        }
    };

    // Check if seedling already exists in inventory
    const checkIfSeedlingExists = (seedlingType, classification) => {
        return inventories.some(
            inv => inv.seedling_type === seedlingType && inv.classification === classification
        );
    };

    const filteredBatches = useMemo(() => {
        return productionBatches.filter((batch) => {
            const searchTerm = search.toLowerCase().trim();

            const matchesSearch =
                batch.batch_id?.toLowerCase().includes(searchTerm) ||
                batch.seedling_type?.toLowerCase().includes(searchTerm) ||
                batch.classification?.toLowerCase().includes(searchTerm) ||
                batch.location?.toLowerCase().includes(searchTerm) ||
                batch.assigned_staff?.toLowerCase().includes(searchTerm) ||
                batch.stage?.toLowerCase().includes(searchTerm);

            const matchesStage =
                stageFilter === "all" ||
                batch.stage?.toLowerCase() === stageFilter;

            return matchesSearch && matchesStage;
        });
    }, [search, stageFilter, productionBatches]);

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
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
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

                    <ViewAllHistory />
                </div>

                <AddSeedlings />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px] min-w-[350px]">Seedling Information</TableHead>
                            <TableHead className="whitespace-nowrap">Date Sown</TableHead>
                            <TableHead className="whitespace-nowrap">Expected Ready</TableHead>
                            <TableHead className="whitespace-nowrap">Quantity Sown</TableHead>
                            <TableHead className="whitespace-nowrap">Current Quantity</TableHead>
                            <TableHead className="whitespace-nowrap">Survivability</TableHead>
                            <TableHead className="whitespace-nowrap">Stage</TableHead>
                            <TableHead className="whitespace-nowrap">Location</TableHead>
                            <TableHead className="text-right whitespace-nowrap">
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
                        ) : paginatedBatches.length > 0 ? (
                            paginatedBatches.map((batch) => (
                                <TableRow key={batch.id}>
                                    <TableCell className="w-[350px] min-w-[350px]">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                {batch.image_url ? (
                                                    <img
                                                        src={`http://localhost:8000/${batch.image_url}`}
                                                        alt={batch.seedling_type}
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
                                                    {batch.seedling_type}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mb-1 truncate">
                                                    Classification: {batch.classification || 'N/A'}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    ID: {batch.batch_id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.date_sown ? new Date(batch.date_sown).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.expected_ready ? new Date(batch.expected_ready).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.quantity_sown?.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.current_quantity?.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.quantity_sown > 0
                                            ? `${(
                                                (batch.current_quantity /
                                                    batch.quantity_sown) *
                                                100
                                            ).toFixed(1)}%`
                                            : "0.0%"}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.stage}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        {batch.location}
                                    </TableCell>

                                    <TableCell className="text-right whitespace-nowrap">
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
                                                {batch.stage === 'Ready' ? (
                                                    <TransferToInventory 
                                                        production={batch} 
                                                        onUpdate={fetchProductions}
                                                        needsPriceInput={!checkIfSeedlingExists(batch.seedling_type, batch.classification)}
                                                    />
                                                ) : (
                                                    <>
                                                        <UpdateStage production={batch} onUpdate={fetchProductions} />
                                                        <EditProduction production={batch} onUpdate={fetchProductions} />
                                                    </>
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