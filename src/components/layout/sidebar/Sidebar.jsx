import { AppSidebar } from "@/components/layout/sidebar/sidebar-layout/app-sidebar"
import { Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import AppBreadcrumbs from "./sidebar-layout/app-breadcrumb"

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4 my-auto"
                        />
                        <AppBreadcrumbs/>
                    </div>
                </header>
                <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}