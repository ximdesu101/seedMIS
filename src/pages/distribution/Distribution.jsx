import DistributeTable from "./layout/DistributeTable";
import CardMetrics from "./layout/CardMatrics";
import DistributionTargetProgress from "./layout/DistributionTargetProgress";

const Distribute = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <DistributionTargetProgress />
            <DistributeTable/>
        </div>
    )
}

export default Distribute