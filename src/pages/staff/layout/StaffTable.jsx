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
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";
import staffService from "@/services/staffService";
import { toast } from "sonner";

const StaffTable = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch staff from API
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffService.getAllStaff();
            if (response.success) {
                setStaff(response.data);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to load staff", {
                description: "Please make sure the backend server is running"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStaffAdded = () => {
        fetchStaff(); // Refresh the list when a new staff is added
    };

    const handleDeleteStaff = async (id, staffName) => {
        if (!confirm(`Are you sure you want to delete ${staffName}?`)) {
            return;
        }

        try {
            const response = await staffService.deleteStaff(id);
            if (response.success) {
                toast.success("Staff deleted successfully!", {
                    description: `${staffName} has been removed from the system.`
                });
                fetchStaff(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting staff:", error);
            toast.error("Failed to delete staff", {
                description: error.response?.data?.message || "Please try again"
            });
        }
    };

    const filteredStaff = useMemo(() => {
        return staff.filter((employee) => {
            const searchTerm = search.toLowerCase().trim();
            const fullName = `${employee.first_name} ${employee.middle_name || ''} ${employee.last_name}`.toLowerCase();
            const fullAddress = `${employee.barangay}, ${employee.municipality}, ${employee.province}`.toLowerCase();
            
            const matchesSearch =
                employee.staff_id.toLowerCase().includes(searchTerm) ||
                employee.first_name.toLowerCase().includes(searchTerm) ||
                employee.last_name.toLowerCase().includes(searchTerm) ||
                fullName.includes(searchTerm) ||
                employee.position.toLowerCase().includes(searchTerm) ||
                fullAddress.includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm) ||
                employee.contact_number.includes(searchTerm);
            
            // Status filter - for now all staff are active
            const matchesStatus = statusFilter === "all" || statusFilter === "active";
            
            return matchesSearch && matchesStatus;
        });
    }, [staff, search, statusFilter]);

    const totalPages = Math.ceil(
        filteredStaff.length / itemsPerPage
    );

    const paginatedStaff = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        const endIndex =
            startIndex + itemsPerPage;

        return filteredStaff.slice(
            startIndex,
            endIndex
        );
    }, [filteredStaff, currentPage]);

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
        filteredStaff.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredStaff.length
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
                <AddStaff onStaffAdded={handleStaffAdded} />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff ID</TableHead>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Position</TableHead>
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
                                        <p className="text-sm text-muted-foreground">Loading staff...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedStaff.length > 0 ? (
                            paginatedStaff.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.staff_id}</TableCell>
                                    <TableCell>
                                        {employee.first_name} {employee.middle_name && `${employee.middle_name} `}{employee.last_name}
                                    </TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>
                                        {employee.barangay}, {employee.municipality}, {employee.province}
                                    </TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.contact_number}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditStaff 
                                                staff={employee} 
                                                onStaffUpdated={fetchStaff}
                                            />
                                            <Button 
                                                variant="destructive" 
                                                size="icon"
                                                onClick={() => handleDeleteStaff(
                                                    employee.id, 
                                                    `${employee.first_name} ${employee.last_name}`
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
                                        <p className="text-sm text-muted-foreground">No staff members found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                <div className="bg-white flex items-center justify-between px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        {filteredStaff.length > 0
                            ? `Showing ${startItem}-${endItem} of ${filteredStaff.length}`
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

export default StaffTable;