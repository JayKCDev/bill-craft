"use client";
import { useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";
import { formatCurrency } from "../utils/helpers";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { handleFetchInvoices } from "@/app/features/invoice/invoiceSlice";
import { toast } from "sonner";

const InvoiceList = () => {
	const dispatch = useAppDispatch();
	const invoiceState = useAppSelector((state) => state.invoiceState);
	const authState = useAppSelector((state) => state?.authState);

	const fetchAllInvoices = async () => {
		try {
			await dispatch(handleFetchInvoices());
		} catch (error) {
			toast.error("Error fetching invoices...");
		}
	};

	useEffect(() => {
		if (!authState.user?.token) return;

		if (!invoiceState.initialFetchAttempted) {
			fetchAllInvoices();
		}
	}, [invoiceState.invoices.length, authState.user?.token]);

	return (
		<>
			{!invoiceState?.invoices?.length ? (
				<EmptyState
					title="No invoices found"
					description="Create an invoice to get started"
					buttontext="Create invoice"
					href="/dashboard/invoices/create"
				/>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoiceState?.invoices?.map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell>#{invoice.invoiceNumber}</TableCell>
								<TableCell>{invoice.clientName}</TableCell>
								<TableCell>
									{formatCurrency({
										amount: invoice.total,
										currency: invoice.currency as any,
									})}
								</TableCell>
								<TableCell>
									<Badge>{invoice.status}</Badge>
								</TableCell>
								<TableCell>
									{new Intl.DateTimeFormat("en-US", {
										dateStyle: "medium",
									}).format(new Date(invoice.createdAt))}
								</TableCell>
								<TableCell>
									{new Intl.DateTimeFormat("en-US", {
										dateStyle: "medium",
									}).format(new Date(invoice.dueDate))}
								</TableCell>
								<TableCell className="text-right">
									<InvoiceActions status={invoice.status} id={invoice.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default InvoiceList;
