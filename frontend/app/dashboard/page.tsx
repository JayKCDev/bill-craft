"use client";
import { useEffect } from "react";
import { Suspense } from "react";
import DashboardBlocks from "../components/DashboardBlocks";
import { EmptyState } from "../components/EmptyState";
import InvoiceGraph from "../components/InvoiceGraph";
import RecentInvoices from "../components/RecentInvoices";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { handleFetchInvoices } from "@/app/features/invoice/invoiceSlice";
import { toast } from "sonner";

const DashboardRoute = () => {
	const dispatch = useAppDispatch();
	const invoiceState = useAppSelector((state) => state?.invoiceState);
	const authState = useAppSelector((state) => state?.authState);

	const fetchAllInvoices = async () => {
		try {
			await dispatch(handleFetchInvoices());
		} catch (error) {
			toast.error("Woops! Something went wrong");
		}
	};

	useEffect(() => {
		// Ensure the user is logged in before fetching invoices
		if (!authState.user?.token) return;

		// Only fetch if we haven't attempted the initial fetch yet
		if (!invoiceState.initialFetchAttempted) {
			fetchAllInvoices();
		}
	}, [authState.user?.token]);

	if (invoiceState.isLoading) {
		return <Skeleton className="w-full h-full flex-1" />;
	}

	return (
		<>
			{!invoiceState?.invoices?.length ? (
				<EmptyState
					title="No invoices found"
					description="Create an invoice to see it right here"
					buttontext="Create Invoice"
					href="/dashboard/invoices/create"
				/>
			) : (
				<Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
					<DashboardBlocks />
					<div className="grid gap-4 lg:grid-cols-3 md:gap-8">
						<InvoiceGraph />
						<RecentInvoices />
					</div>
				</Suspense>
			)}
		</>
	);
};

export default DashboardRoute;
