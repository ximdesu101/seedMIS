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
import AddStaff from "./AddStaff";

const staff = [
    {
        id: "STF-001",
        firstName: "Juan",
        lastName: "Dela Cruz",
        Position: "Green Valley Cooperative",
        address: "San Jorge, Samar",
        email: "juan.delacruz@example.com",
        contactNumber: "0917 123 4567",
        status: "Active",
    },
    {
        id: "STF-002",
        firstName: "Maria",
        lastName: "Santos",
        Position: "San Jorge Farmers Association",
        address: "San Jorge, Samar",
        email: "maria.santos@example.com",
        contactNumber: "0918 234 5678",
        status: "Active",
    },
];

const StaffTable = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredStaff = useMemo(() => {
        return staff.filter((employee) => {
            const searchTerm = search.toLowerCase().trim();
            const matchesSearch =
                employee.id.toLowerCase().includes(searchTerm) ||
                employee.firstName.toLowerCase().includes(searchTerm) ||
                employee.lastName.toLowerCase().includes(searchTerm) ||
                `${employee.firstName} ${employee.lastName}`
                    .toLowerCase()
                    .includes(searchTerm) ||
                employee.Position.toLowerCase().includes(searchTerm) ||
                employee.address.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm) ||
                employee.contactNumber.toLowerCase().includes(searchTerm) ||
                employee.status.toLowerCase().includes(searchTerm);
            const matchesStatus =
                statusFilter === "all" ||
                employee.status.toLowerCase() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

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
                <AddStaff />
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
                        {paginatedStaff.length > 0 ? (
                            paginatedStaff.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.id}</TableCell>
                                    <TableCell>{employee.firstName}{" "}{employee.lastName}</TableCell>
                                    <TableCell>{employee.Position}</TableCell>
                                    <TableCell>{employee.address}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.contactNumber}</TableCell>
                                    <TableCell>{employee.status}</TableCell>
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
                                    No staff members found.
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