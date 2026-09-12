import ClientTable from "./layout/ClientTable";
import CardMetrics from "./layout/CardMetrics";
const Client = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <ClientTable/>
        </div>
    )
}

export default Client