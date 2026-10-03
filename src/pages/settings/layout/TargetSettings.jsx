import { useState, useEffect } from "react";
import targetService from "@/services/targetService";
import inventoryService from "@/services/inventoryService";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Target, TrendingUp, Plus, X, Trash2, RefreshCw, Pencil } from "lucide-react";
import { toast } from "sonner";

const TargetSettings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [targets, setTargets] = useState([]);
    const [availableSeedlings, setAvailableSeedlings] = useState([]);
    const [editingTarget, setEditingTarget] = useState(null);
    
    // Form state
    const [annualProduction, setAnnualProduction] = useState("");
    const [monthlyDistribution, setMonthlyDistribution] = useState("");
    const [seedlingTargets, setSeedlingTargets] = useState([
        { seedling_type: "", target_value: "" },
    ]);

    useEffect(() => {
        fetchTargets();
        fetchAvailableSeedlings();
    }, []);

    const fetchAvailableSeedlings = async () => {
        try {
            const response = await inventoryService.getAllInventories();
            if (response.success) {
                const uniqueSeedlings = [...new Set(response.data.map(item => item.seedling_type))];
                setAvailableSeedlings(uniqueSeedlings);
            }
        } catch (error) {
            console.error('Error fetching seedling types:', error);
        }
    };

    const fetchTargets = async () => {
        try {
            setLoading(true);
            const response = await targetService.getAllTargets();
            if (response.success) {
                const targetsData = response.data;
                setTargets(targetsData);
                
                // Pre-fill form with existing targets
                const annual = targetsData.find(t => t.target_type === 'annual_production');
                const monthly = targetsData.find(t => t.target_type === 'monthly_distribution');
                
                setAnnualProduction(annual?.target_value || "");
                setMonthlyDistribution(monthly?.target_value || "");
                
                // Set seedling type targets
                const seedlingTypes = targetsData.filter(t => t.target_type === 'seedling_type');
                if (seedlingTypes.length > 0) {
                    setSeedlingTargets(seedlingTypes.map(t => ({
                        seedling_type: t.seedling_type,
                        target_value: t.target_value
                    })));
                } else {
                    setSeedlingTargets([{ seedling_type: "", target_value: "" }]);
                }
            }
        } catch (error) {
            console.error('Error fetching targets:', error);
            toast.error("Failed to load targets");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTargets = async () => {
        try {
            setLoading(true);
            
            const currentYear = new Date().getFullYear().toString();
            const currentMonth = new Date().toISOString().slice(0, 7);

            const promises = [];

            // Save annual production
            if (annualProduction && parseFloat(annualProduction) > 0) {
                promises.push(
                    targetService.saveTarget({
                        target_type: 'annual_production',
                        target_value: parseFloat(annualProduction),
                        period: currentYear,
                        description: `Annual production target for ${currentYear}`,
                    })
                );
            }

            // Save monthly distribution
            if (monthlyDistribution && parseFloat(monthlyDistribution) > 0) {
                promises.push(
                    targetService.saveTarget({
                        target_type: 'monthly_distribution',
                        target_value: parseFloat(monthlyDistribution),
                        period: currentMonth,
                        description: `Monthly distribution target`,
                    })
                );
            }

            // Save seedling targets
            seedlingTargets.forEach(target => {
                if (target.seedling_type && target.target_value && parseFloat(target.target_value) > 0) {
                    promises.push(
                        targetService.saveTarget({
                            target_type: 'seedling_type',
                            seedling_type: target.seedling_type,
                            target_value: parseFloat(target.target_value),
                            period: currentYear,
                            description: `${target.seedling_type} production target for ${currentYear}`,
                        })
                    );
                }
            });

            if (promises.length === 0) {
                toast.error("Please fill in at least one target");
                return;
            }

            await Promise.all(promises);

            toast.success("Targets saved successfully!");
            setIsOpen(false);
            setEditingTarget(null);
            fetchTargets(); // Refresh
        } catch (error) {
            console.error('Error saving targets:', error);
            toast.error(error.response?.data?.message || "Failed to save targets");
        } finally {
            setLoading(false);
        }
    };

    const addSeedlingTarget = () => {
        setSeedlingTargets([...seedlingTargets, { seedling_type: "", target_value: "" }]);
    };

    const removeSeedlingTarget = (index) => {
        setSeedlingTargets(seedlingTargets.filter((_, i) => i !== index));
    };

    const updateSeedlingTarget = (index, field, value) => {
        const updated = [...seedlingTargets];
        updated[index][field] = value;
        setSeedlingTargets(updated);
    };

    const handleDeleteTarget = async (targetId) => {
        if (!confirm('Are you sure you want to delete this target?')) {
            return;
        }

        try {
            await targetService.deleteTarget(targetId);
            toast.success("Target deleted successfully");
            fetchTargets();
        } catch (error) {
            console.error('Error deleting target:', error);
            toast.error("Failed to delete target");
        }
    };

    const handleEditTarget = (target) => {
        // Load specific target for editing
        if (target.target_type === 'annual_production') {
            setAnnualProduction(target.target_value);
        } else if (target.target_type === 'monthly_distribution') {
            setMonthlyDistribution(target.target_value);
        } else if (target.target_type === 'seedling_type') {
            // Find and update the seedling target
            const existingIndex = seedlingTargets.findIndex(
                t => t.seedling_type === target.seedling_type
            );
            if (existingIndex >= 0) {
                const updated = [...seedlingTargets];
                updated[existingIndex] = {
                    seedling_type: target.seedling_type,
                    target_value: target.target_value
                };
                setSeedlingTargets(updated);
            } else {
                setSeedlingTargets([
                    ...seedlingTargets,
                    { seedling_type: target.seedling_type, target_value: target.target_value }
                ]);
            }
        }
        
        setEditingTarget(target);
        setIsOpen(true);
    };

    const handleOpenDialog = () => {
        setEditingTarget(null);
        fetchTargets(); // Load latest data when opening
        setIsOpen(true);
    };

    const getTargetTypeLabel = (type) => {
        const labels = {
            'annual_production': 'Annual Production',
            'monthly_distribution': 'Monthly Distribution',
            'revenue': 'Revenue',
            'seedling_type': 'Seedling Type'
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Targets Management</CardTitle>
                            <CardDescription>
                                Set and manage production, distribution, and revenue targets
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchTargets}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button 
                                variant="default" 
                                size="sm" 
                                className="gap-2"
                                onClick={handleOpenDialog}
                            >
                                <Plus className="h-4 w-4" />
                                Manage Targets
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : targets.length === 0 ? (
                        <div className="text-center py-8">
                            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No targets set yet. Click "Manage Targets" to get started.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Seedling Type</TableHead>
                                    <TableHead>Target Value</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {targets.map((target) => (
                                    <TableRow key={target.id}>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {getTargetTypeLabel(target.target_type)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {target.seedling_type || '-'}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {parseFloat(target.target_value).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{target.period}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                target.is_active 
                                                    ? 'bg-green-50 text-green-700 ring-green-600/20' 
                                                    : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                            }`}>
                                                {target.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditTarget(target)}
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteTarget(target.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog for setting/editing targets */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Target Management
                        </DialogTitle>
                        <DialogDescription>
                            Set production, distribution, and revenue targets. Values will update existing targets.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <div className="space-y-6">
                        {/* System-wide Targets */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">System Targets</CardTitle>
                                <CardDescription>
                                    Annual and monthly targets for the entire system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldGroup className="grid gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="annual_production">
                                            <TrendingUp className="h-4 w-4 inline mr-2" />
                                            Annual Production (Seedlings)
                                        </FieldLabel>
                                        <Input
                                            id="annual_production"
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 50000"
                                            value={annualProduction}
                                            onChange={(e) => setAnnualProduction(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="monthly_distribution">
                                            <Target className="h-4 w-4 inline mr-2" />
                                            Monthly Distribution (Seedlings)
                                        </FieldLabel>
                                        <Input
                                            id="monthly_distribution"
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 5000"
                                            value={monthlyDistribution}
                                            onChange={(e) => setMonthlyDistribution(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Field>
                                </FieldGroup>
                            </CardContent>
                        </Card>

                        {/* Seedling Type Targets */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Seedling Targets</CardTitle>
                                        <CardDescription>
                                            Production targets by seedling type
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={addSeedlingTarget}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {availableSeedlings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No seedling types available. Add seedlings to inventory first.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {seedlingTargets.map((target, index) => (
                                            <div key={index} className="flex gap-2 items-end">
                                                <Field className="flex-1">
                                                    <FieldLabel>Type</FieldLabel>
                                                    <Select
                                                        value={target.seedling_type}
                                                        onValueChange={(value) =>
                                                            updateSeedlingTarget(index, 'seedling_type', value)
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableSeedlings
                                                                .filter(seedling => 
                                                                    !seedlingTargets.some((t, i) => 
                                                                        i !== index && t.seedling_type === seedling
                                                                    )
                                                                )
                                                                .map((seedling) => (
                                                                    <SelectItem key={seedling} value={seedling}>
                                                                        {seedling}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="flex-1">
                                                    <FieldLabel>Target</FieldLabel>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="e.g., 10000"
                                                        value={target.target_value}
                                                        onChange={(e) =>
                                                            updateSeedlingTarget(index, 'target_value', e.target.value)
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </Field>
                                                {seedlingTargets.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => removeSeedlingTarget(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTargets} disabled={loading}>
                            {loading ? "Saving..." : "Save Targets"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TargetSettings;
