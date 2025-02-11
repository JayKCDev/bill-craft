"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardLinks } from "@/app/utils/constants";

const DashboardLinks = () => {
	const pathname = usePathname();
	return (
		<>
			{dashboardLinks.map((link) => (
				<Link
					className={cn(
						pathname === link.href
							? "text-primary bg-primary/10"
							: "text-muted-foreground hover:text-foreground",
						"flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
					)}
					href={link.href}
					key={link.id}
				>
					<link.icon className="size-4" />
					{link.name}
				</Link>
			))}
		</>
	);
};

export default DashboardLinks;
