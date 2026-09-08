import { useMatches, Link } from "react-router-dom";
import { Fragment } from "react";
import {
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink,
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function AppBreadcrumbs() {
    const matches = useMatches();
    const crumbs = matches
        .filter((match) => Boolean(match.handle?.crumb))
        .map((match) => ({
            label: match.handle.crumb(match.params, match.data),
            href: match.pathname,
        }));

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <Fragment key={crumb.href}>
                            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                            <BreadcrumbItem className={!isLast ? "hidden md:block" : undefined}>
                                {isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default AppBreadcrumbs