import { createBrowserRouter } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";

import Dashboard from "@/pages/dashboard/Dashoard";
import Client from "@/pages/client/Client";
import SeedlingInventory from "@/pages/inventory/SeedlingInventory";
import SeedlingProduction from "@/pages/production/SeedlingProduction";
import Request from "@/pages/request/Request";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Sidebar/>,
        children: [
            { path: "dashboard", element: <Dashboard/> },
            { path: "client", element: <Client/> },
            { path: "seedling-inventory", element: <SeedlingInventory/> },
            { path: "seedling-production", element: <SeedlingProduction/> },
            { path: "requests", element: <Request/> },
        ],
    },
]);