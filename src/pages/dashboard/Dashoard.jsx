import CardMetrics from "./layout/CardMetrics"
import ProductionReadyChart from "./layout/ProductionReadyChart"
import NurseryChart from "./layout/NurseryChart"
import QuickAction from "./layout/QuickAccess"
const Dashoard = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <ProductionReadyChart/>
                </div>
                <NurseryChart/>
            </div>
            <QuickAction/>
        </div>
    )
}

export default Dashoard