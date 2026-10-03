import {
    LayoutDashboard,
    Users,
    FileBox,
    Sprout,
    Truck,
    ClipboardList,
    ChartNoAxesCombined,
    Logs,
    Settings,
    LogOut,
    UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

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
    
    // Get current user info
    const [currentUser, setCurrentUser] = React.useState(null);
    const [userType, setUserType] = React.useState(null);
    
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedUserType = localStorage.getItem('userType');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    // Base navigation items
    const baseNavItems = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ];

    // Admin-only items
    const adminOnlyItems = [
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
    ];

    // Common items (visible to both Admin and Staff)
    const commonItems = [
        { title: "Distribution", url: "/distribute", icon: Truck },
        { title: "Request", url: "/requests", icon: ClipboardList },
        { title: "Reports", url: "/reports", icon: ChartNoAxesCombined },
        { title: "Activity Logs", url: "/activity-logs", icon: Logs },
        { title: "Target Management", url: "/settings", icon: Settings },
    ];

    // Build navigation based on user type
    const navMain = userType === 'admin' 
        ? [...baseNavItems, ...adminOnlyItems, ...commonItems]
        : [...baseNavItems, ...commonItems];

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
                {/* Profile Section at Top */}
                <SidebarMenu className="mb-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={() => navigate('/profile')}
                            className="h-auto py-3 hover:bg-sidebar-accent"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#016146] flex items-center justify-center text-white font-bold text-lg">
                                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-semibold truncate">{currentUser?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{currentUser?.role || 'Role'}</p>
                                </div>
                                <UserCircle className="size-4 flex-shrink-0 text-muted-foreground" />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                
                {/* Navigation Menu */}
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {/* Logout Menu Item */}
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleLogout} 
                            className="text-white hover:text-white hover:bg-red-600 focus:bg-red-600 focus:text-white"
                        >
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