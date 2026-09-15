import StaffTable from "./layout/StaffTable";
import CardMetrics from "./layout/CardMetrics";
const Staff = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <StaffTable/>
        </div>
    )
}

export default Staff