import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "../utils/helpers";
import { useAppSelector } from "../hooks/reduxHooks";

const RecentInvoices = () => {
	const invoices = useAppSelector((state) => state.invoiceState?.invoices);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Invoices</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-8">
				{invoices?.map((invoice) => (
					<div className="flex items-center gap-4" key={invoice.id}>
						<Avatar className="hidden sm:flex size-9">
							<AvatarFallback>
								{invoice?.clientName?.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-1">
							<p className="text-sm font-medium leadin-none">
								{invoice?.clientName}
							</p>
							<p className="text-sm text-muted-foreground">
								{invoice?.clientEmail}
							</p>
						</div>
						<div className="ml-auto font-medium">
							+
							{formatCurrency({
								amount: invoice?.total,
								currency: invoice?.currency as any,
							})}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
};

export default RecentInvoices;