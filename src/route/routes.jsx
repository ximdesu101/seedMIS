import { createBrowserRouter, Navigate } from "react-router-dom";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import ProtectedRoute from "@/route/ProtectedRoute";

import Dashboard from "@/pages/dashboard/Dashoard";
import Client from "@/pages/client/Client";
import ClientDetails from "@/pages/client/ClientDetails";
import SeedlingInventory from "@/pages/inventory/SeedlingInventory";
import SeedlingProduction from "@/pages/production/SeedlingProduction";
import ProductionHistory from "@/pages/production/ProductionHistory";
import Request from "@/pages/request/Request";
import RequestDetails from "@/pages/request/RequestDetails";
import Staff from "@/pages/staff/staff";
import Distribute from "@/pages/distribution/Distribution";
import Settings from "@/pages/settings/Settings";
import Profile from "@/pages/profile/Profile";
import Login from "@/pages/login/login";
import Reports from "@/pages/report/Report";
import ActivityLogs from "@/pages/activity-logs/ActivityLogs";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path:"/",
        element: (
            <ProtectedRoute>
                <Sidebar/>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <Dashboard/> },
            { path: "client", element: <Client/> },
            { path: "client/:id", element: <ClientDetails/> },
            { path: "seedling-inventory", element: <SeedlingInventory/> },
            { path: "seedling-production", element: <SeedlingProduction/> },
            { path: "production-history", element: <ProductionHistory/> },
            { path: "requests", element: <Request/> },
            { path: "requests/:id", element: <RequestDetails/> },
            { path: "staff", element: <Staff/> },
            { path: "distribute", element: <Distribute/> },
            { path: "settings", element: <Settings/> },
            { path: "profile", element: <Profile/> },
            { path: "reports", element: <Reports/> },
            { path: "activity-logs", element: <ActivityLogs/> },
        ],
    },
]);
