import * as React from "react";
import { useState } from "react";
import { cn } from "cn";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CirclePlus,
    Sprout,
    Calendar as CalendarIcon,
} from "lucide-react";

const AddSeedlings = () => {
    const [dateAdded, setDateAdded] = useState();
    const [expectedReadyDate, setExpectedReadyDate] = useState();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#016146]">
                    <CirclePlus />
                    Add Seedlings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>New Production Batch</DialogTitle>
                    <DialogDescription>
                        Add a new production batch and enter its details.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <FieldGroup>
                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="batch-id">Batch ID</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="batch-id"
                                    type="text"
                                    placeholder="SD-0001"
                                    required
                                />
                                <InputGroupAddon><Sprout /></InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="seedling-type">Seedling Type</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="seedling-type"
                                    type="text"
                                    placeholder="Mahoganay"
                                    required
                                />
                                <InputGroupAddon><Sprout /></InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="scientific">Scientific Name</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="scientific"
                                type="text"
                                placeholder="Swietenia macrophylla"
                                required
                            />
                            <InputGroupAddon><Sprout /></InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="quantity">Quantity Sown</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="quantity"
                                    type="number"
                                    placeholder="800"
                                    required
                                />
                                <InputGroupAddon><Sprout /></InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="stock-level">Stage</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Production stage" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="germination">Germination</SelectItem>
                                    <SelectItem value="seedling">Seedling</SelectItem>
                                    <SelectItem value="hardening">Hardening</SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="source">Source/Origin</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="source"
                                type="text"
                                placeholder="xmple"
                                required
                            />
                            <InputGroupAddon><Sprout /></InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="date-added">Date Added</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date-added"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between text-left font-normal",
                                            !dateAdded && "text-muted-foreground"
                                        )}
                                    >
                                        {dateAdded
                                            ? format(dateAdded, "PPP")
                                            : "Pick a date"}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={dateAdded}
                                        onSelect={setDateAdded}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="expected-ready-date">
                                Expected Ready Date
                            </FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="expected-ready-date"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between text-left font-normal",
                                            !expectedReadyDate &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {expectedReadyDate
                                            ? format(expectedReadyDate, "PPP")
                                            : "Pick a date"}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={expectedReadyDate}
                                        onSelect={setExpectedReadyDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                    <Button className="bg-[#016146]">
                        <CirclePlus />
                        Add Seedling
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSeedlings