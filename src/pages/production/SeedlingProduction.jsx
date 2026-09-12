import CardMetrics from "./layout/CardMetrics"
import ProductionTable from "./layout/ProductionTable"
const SeedlingProduction = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <ProductionTable/>
        </div>
    )
}

export default SeedlingProduction