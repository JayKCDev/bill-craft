"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { generateInvoicePDF } from "@/app/utils/generateInvoicePDF";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import {
	fetchInvoiceById,
	resetInvoiceToView,
} from "@/app/features/invoice/invoiceSlice";
import { toast } from "sonner";
import { Invoice, Params } from "@/app/utils/constants";
import { Skeleton } from "@/components/ui/skeleton";

const InvoiceViewPage = ({ params }: { params: Params }) => {
	const resolvedParams = use(params);
	const { invoiceId } = resolvedParams;
	const { isLoading, invoiceToView } = useAppSelector(
		(state) => state.invoiceState
	);
	const dispatch = useAppDispatch();

	const fetchInvoiceToView = async (invoiceId: string) => {
		if (!invoiceId) return toast.error("Invoice ID not found");
		try {
			await dispatch(fetchInvoiceById(invoiceId));
		} catch (error) {
			toast.error("Error fetching invoice to view");
		}
	};

	const displayInvoice = () => {
		if (!invoiceToView) {
			toast.error("Failed to load invoice");
			return;
		}

		// Generate PDF
		const pdfBuffer = generateInvoicePDF(invoiceToView as Invoice);

		// Create blob and display PDF
		const blob = new Blob([pdfBuffer], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);

		// Create an iframe to display the PDF
		const iframe = document.createElement("iframe");
		iframe.style.width = "100%";
		iframe.style.height = "100vh";
		iframe.style.border = "none";
		iframe.src = url;

		// Clear any existing content and append the iframe
		const container = document.getElementById("pdf-container");
		if (container) {
			container.innerHTML = "";
			container.appendChild(iframe);
		}
	};

	useEffect(() => {
		fetchInvoiceToView(invoiceId);
	}, [invoiceId]);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoading && invoiceToView) {
			displayInvoice(); // Call the function defined outside
		}
		return () => {
			// Cleanup logic
			dispatch(resetInvoiceToView());
		};
	}, [isLoading, invoiceId, invoiceToView]);

	if (isLoading && !invoiceToView) {
		return <Skeleton className="w-full h-full flex-1" />;
	}

	return <div id="pdf-container" className="min-h-screen" />;
};

export default InvoiceViewPage;
