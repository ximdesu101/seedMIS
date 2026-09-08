import {
    LayoutDashboard,
    Users,
    FileBox,
    Sprout,
    Truck,
    ClipboardList,
    ChartNoAxesCombined,
    Logs
} from "lucide-react";

import { NavMain } from "@/components/layout/sidebar/sidebar-layout/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    {
        title: "User Management",
        url: "#",
        icon: Users,
        items: [
            { title: "Client Account", url: "#" },
            { title: "Staff Account", url: "#" },
        ],
    },
    { title: "Seedling Inventory", url: "#", icon: FileBox },
    { title: "Seedling Production", url: "#", icon: Sprout },
    { title: "Distribution", url: "#", icon: Truck },
    { title: "Request", url: "#", icon: ClipboardList },
    { title: "Reports", url: "#", icon: ChartNoAxesCombined },
    { title: "Activity Logs", url: "#", icon: Logs },
];

export function AppSidebar({ ...props }) {
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
            <SidebarRail />
        </Sidebar>
    )
}