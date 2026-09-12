import CardMetrics from "./layout/CardMetrics"
import InventoryTable from "./layout/InventoryTable"
const SeedlingInventory = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <InventoryTable/>
        </div>
    )
}

export default SeedlingInventory