import DistributeTable from "./layout/DistributeTable";
import CardMetrics from "./layout/CardMatrics";
const Distribute = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <DistributeTable/>
        </div>
    )
}

export default Distribute