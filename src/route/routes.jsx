import { createBrowserRouter } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";

import Dashboard from "@/pages/Dashoard";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Sidebar/>,
        children: [
            { path: "dashboard", element: <Dashboard/> }
        ],
    },
]);