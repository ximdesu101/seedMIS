import CardMetrics from "./layout/CardMetrics"
import ProductionReadyChart from "./layout/ProductionReadyChart"
import ActualVsTargetChart from "./layout/ActualVsTargetChart"
import QuickAction from "./layout/QuickAccess"
import TargetProgress from "./layout/TargetProgress"
import SeedlingTypeProgress from "./layout/SeedlingTypeProgress"

const Dashoard = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics />
            <TargetProgress />
            <SeedlingTypeProgress />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductionReadyChart />
                <ActualVsTargetChart />
            </div>
            <QuickAction/>
        </div>
    )
}

export default Dashoard