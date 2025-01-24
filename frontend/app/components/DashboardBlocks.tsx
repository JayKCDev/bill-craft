import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "../utils/helpers";
import { useAppSelector } from "../hooks/reduxHooks";

const DashboardBlocks = () => {
	const invoiceState = useAppSelector((state) => state.invoiceState);

	const paidInvoices = invoiceState?.invoices?.filter(
		(invoice) => invoice.status === "PAID"
	);

	const pendingInvoices = invoiceState?.invoices?.filter(
		(invoice) => invoice.status === "PENDING"
	);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					<DollarSign className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">
						{formatCurrency({
							amount: invoiceState?.invoices?.reduce(
								(acc, invoice) => acc + invoice.total,
								0
							),
							currency: "USD",
						})}
					</h2>
					<p className="text-xs text-muted-foreground">Based on total volume</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Invoices Issued
					</CardTitle>
					<Users className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">
						+{invoiceState?.invoices?.length}
					</h2>
					<p className="text-xs text-muted-foreground">Total Invoices Isued!</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
					<CreditCard className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">+{paidInvoices?.length}</h2>
					<p className="text-xs text-muted-foreground">
						Total Invoices which have been paid!
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Pending Invoices
					</CardTitle>
					<Activity className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">+{pendingInvoices?.length}</h2>
					<p className="text-xs text-muted-foreground">
						Invoices which are currently pending!
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardBlocks;
