import {
    LayoutDashboard,
    Users,
    FileBox,
    Sprout,
    Truck,
    ClipboardList,
    ChartNoAxesCombined,
    Logs,
    LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { NavMain } from "@/components/layout/sidebar/sidebar-layout/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { toast } from "sonner";

export function AppSidebar({ ...props }) {
    const navigate = useNavigate();

    const navMain = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        {
            title: "User Management",
            url: "#",
            icon: Users,
            items: [
                { title: "Client Account", url: "/client" },
                { title: "Staff Account", url: "/staff" },
            ],
        },
        { title: "Seedling Inventory", url: "/seedling-inventory", icon: FileBox },
        { title: "Seedling Production", url: "/seedling-production", icon: Sprout },
        { title: "Distribution", url: "/distribute", icon: Truck },
        { title: "Request", url: "/requests", icon: ClipboardList },
        { title: "Reports", url: "#", icon: ChartNoAxesCombined },
        { title: "Activity Logs", url: "#", icon: Logs },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                                <img
                                    src="/favicon-96x96.png"
                                    alt="SeedIMIS"
                                    className="size-6 object-contain"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">SeedIMIS</span>
                                <span className="truncate text-xs text-muted-foreground">San Jorge Experiment Station</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} className="text-white hover:text-white hover:bg-green-600 focus:bg-green-600 focus:text-white">
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}