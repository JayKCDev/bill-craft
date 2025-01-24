"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CheckCircle,
	Copy,
	DownloadCloudIcon,
	Mail,
	MoreHorizontal,
	Pencil,
	Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import {
	handleCopyLink,
	handleInvoiceDownload,
} from "@/app/features/invoice/invoiceSlice";
import { InvoiceActions } from "@/app/utils/constants";

export function InvoiceActions({ id, status }: InvoiceActions) {
	const dispatch = useAppDispatch();

	const handleDownloadClick = (invoiceId: string) => {
		if (!invoiceId) {
			return toast.error("Invoice not found");
		}
		return dispatch(handleInvoiceDownload(invoiceId));
	};

	const handleCopyLinkClick = (invoiceId: string) => {
		if (!invoiceId) return toast.error("Invoice ID not found");

		return dispatch(handleCopyLink(invoiceId));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="secondary">
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild className="cursor-pointer">
					<Link href={`/dashboard/invoices/${id}`}>
						<Pencil className="size-4 mr-2" /> Edit Invoice
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleDownloadClick(id)}
					className="cursor-pointer"
				>
					<DownloadCloudIcon className="size-4 mr-2" /> Download Invoice
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleCopyLinkClick(id)}
					className="cursor-pointer"
				>
					<Copy className="size-4 mr-2" /> Copy Shareable Link
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="cursor-pointer">
					<Link href={`/dashboard/invoices/${id}/delete`}>
						<Trash className="size-4 mr-2" /> Delete Invoice
					</Link>
				</DropdownMenuItem>
				{status !== "PAID" && (
					<DropdownMenuItem asChild className="cursor-pointer">
						<Link href={`/dashboard/invoices/${id}/paid`}>
							<CheckCircle className="size-4 mr-2" /> Mark as Paid
						</Link>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
