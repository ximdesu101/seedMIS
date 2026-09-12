import RequestTable from "./layout/RequestTable";
import CardMetrics from "./layout/CardMetrics";
const Request = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <RequestTable/>
        </div>
    )
}

export default Request