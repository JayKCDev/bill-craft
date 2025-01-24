import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Graph } from "./Graph";
import { useAppSelector } from "../hooks/reduxHooks";

const InvoiceGraph = () => {
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Date 30 days ago
	const now = new Date(); // Current date
	const invoiceState = useAppSelector((state) => state?.invoiceState);

	const rawData = invoiceState?.invoices
		?.filter((invoice) => {
			// Filter invoices that are "PAID" and created within the last 30 days
			return (
				invoice.status === "PAID" &&
				new Date(invoice.createdAt) <= now &&
				new Date(invoice.createdAt) >= thirtyDaysAgo
			);
		})
		?.map((invoice) => {
			// Map the filtered invoices to return only the required fields
			return {
				createdAt: invoice.createdAt,
				total: invoice.total,
			};
		});

	//Group and aggregate data by date
	const aggregatedData = rawData?.reduce(
		(acc: { [key: string]: number }, curr) => {
			const date = new Date(curr.createdAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});

			acc[date] = (acc[date] || 0) + curr.total;

			return acc;
		},
		{}
	);

	//Convert to array and from the object
	const transformedData = Object?.entries(aggregatedData)
		?.map(([date, amount]) => ({
			date,
			amount,
			originalDate: new Date(date + ", " + new Date().getFullYear()),
		}))
		?.sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
		?.map(({ date, amount }) => ({
			date,
			amount,
		}));

	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>Paid Invoices</CardTitle>
				<CardDescription>
					Invoices which have been paid in the last 30 days.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Graph data={transformedData} />
			</CardContent>
		</Card>
	);
};

export default InvoiceGraph;
