import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/input-group";
import {
    CirclePlus,
    Eye,
    EyeOff,
} from "lucide-react";

const AddClient = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#016146]">
                    <CirclePlus />
                    Add Client
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-lg"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>New client Member</DialogTitle>
                    <DialogDescription>
                        Add a new client member and enter their details.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="client-id">Client ID</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="client-id"
                                type="text"
                                placeholder="CLT-0001"
                                required
                            />
                        </InputGroup>
                    </Field>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="first-name">
                                First Name
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="first-name"
                                    type="text"
                                    placeholder="John"
                                    required
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="middle-name">
                                Middle Name
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="middle-name"
                                    type="text"
                                    placeholder="Jane"
                                    required
                                />
                            </InputGroup>
                        </Field>
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="last-name">
                                Last Name
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="last-name"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    placeholder="qHtH2@example.com"
                                    required
                                />
                            </InputGroup>
                        </Field>
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="contact-number">
                                Contact Number
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="contact-number"
                                    type="text"
                                    placeholder="123-456-7890"
                                    required
                                />
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="address"
                                type="text"
                                placeholder="Brgy. 1, City, Province, Country"
                                required
                            />
                        </InputGroup>
                    </Field>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="password">
                                Password
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                />
                                <InputGroupAddon align="end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    required
                                />
                                <InputGroupAddon align="end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (value) => !value
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>

                    <Button className="bg-[#016146]">
                        <CirclePlus />
                        Add Staff
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddClient;    