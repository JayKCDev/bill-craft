import jsPDF from "jspdf";
import { formatCurrency } from "./helpers";
import { Invoice } from "@/app/utils/constants";

export const generateInvoicePDF = (data: Invoice): Buffer => {
	// Validate required data
	if (!data) {
		throw new Error("Invoice data is required");
	}

	const pdf = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4",
	});

	// Helper function to write text safely
	const writeText = (
		text: string | number | undefined,
		x: number,
		y: number
	) => {
		pdf.text(String(text ?? ""), x, y);
	};

	// Helper function to write multiple lines of text
	const writeLines = (
		lines: (string | undefined)[],
		x: number,
		startY: number,
		lineHeight: number = 5
	) => {
		lines.forEach((line, index) => {
			if (line) {
				writeText(line, x, startY + index * lineHeight);
			}
		});
	};

	// set font
	pdf.setFont("helvetica");

	//set header
	pdf.setFontSize(24);
	writeText(`Bill Craft Invoice: ${data?.invoiceName}`, 20, 20);

	// From Section
	pdf.setFontSize(12);
	writeText("From", 20, 40);
	pdf.setFontSize(10);
	writeLines([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

	// Client Section
	pdf.setFontSize(12);
	writeText("Bill to", 20, 70);
	pdf.setFontSize(10);
	writeLines([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

	// Invoice details
	const formattedDate = data?.dueDate
		? new Date(data?.dueDate).toLocaleDateString("en-US") // Formats as MM/DD/YYYY
		: "N/A";

	pdf.setFontSize(10);
	writeText(`Invoice Number: #${data.invoiceNumber ?? "N/A"}`, 120, 40);
	writeText(
		`Date: ${
			data.date
				? new Intl.DateTimeFormat("en-US", {
						dateStyle: "long",
				  }).format(new Date(data.date))
				: "N/A"
		}`,
		120,
		45
	);
	writeText(`Due Date: ${formattedDate}`, 120, 50);
	writeText(`Payment Status: ${data.status}`, 120, 55);

	// Item table header
	pdf.setFontSize(10);
	pdf.setFont("helvetica", "bold");
	writeText("Description", 20, 100);
	writeText("Quantity", 100, 100);
	writeText("Rate", 130, 100);
	writeText("Total", 160, 100);

	// draw header line
	pdf.line(20, 102, 190, 102);

	// Item Details
	pdf.setFont("helvetica", "normal");
	writeText(data.invoiceItemDescription ?? "", 20, 110);
	writeText(data.invoiceItemQuantity ?? 0, 100, 110);
	writeText(
		formatCurrency({
			amount: data.invoiceItemRate ?? 0,
			currency: data.currency as any,
		}),
		130,
		110
	);
	writeText(
		formatCurrency({ amount: data.total ?? 0, currency: data.currency as any }),
		160,
		110
	);

	// Total Section
	pdf.line(20, 115, 190, 115);
	pdf.setFont("helvetica", "bold");
	writeText(`Total (${data.currency ?? "USD"})`, 130, 130);
	writeText(
		formatCurrency({ amount: data.total ?? 0, currency: data.currency as any }),
		160,
		130
	);

	//Additional Note
	if (data.note) {
		pdf.setFont("helvetica", "normal");
		pdf.setFontSize(10);
		writeText("Note:", 20, 150);
		writeText(data.note, 20, 155);
	}

	return Buffer.from(pdf.output("arraybuffer"));
};
