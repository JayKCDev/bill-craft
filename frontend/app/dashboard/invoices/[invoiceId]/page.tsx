"use client";
import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/app/utils/helpers";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { toast } from "sonner";
import { handleEditInvoice } from "@/app/features/invoice/invoiceSlice";
import {
	Params,
	currencyNames,
	supportedCurrencies,
	Invoice,
} from "@/app/utils/constants";
import { validatePayload } from "@/app/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";

const EditInvoice = ({ params }: { params: Params }) => {
	const resolvedParams = use(params);
	const { invoiceId } = resolvedParams;
	const invoiceState = useAppSelector((state) => state.invoiceState);

	const invoice: Invoice = invoiceState?.invoices?.find(
		(invoice) => invoice?.id === invoiceId
	);
	const [form, setForm] = useState({
		...invoice,
	});
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleChange = (e: any) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const calculateTotal =
		(Number(form?.invoiceItemQuantity) || 0) *
		(Number(form?.invoiceItemRate) || 0);

	const handleCurrencyChange = (value: string) => {
		setForm({
			...form,
			currency: value as "EUR" | "USD" | "INR",
		});
	};

	const handleDateChange = (
		date: Date | undefined,
		field: "date" | "dueDate"
	) => {
		setForm({
			...form,
			[field]: date || new Date(),
		});
	};

	useEffect(() => {
		setForm({
			...form,
			total: calculateTotal.toString(),
		});
	}, [form?.invoiceItemRate, form?.invoiceItemQuantity]);

	const handleEditInvoiceSubmit = async (
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();

		if (!validatePayload(form, "note")) {
			return toast.error("Please fill in all fields");
		}

		const payload = {
			form,
			invoiceId,
		};

		try {
			await dispatch(handleEditInvoice(payload));
			return router.push("/dashboard/invoices");
		} catch (error) {
			toast.error("Request failed...");
		}
	};

	if (!invoice) {
		return router.push("/dashboard/invoices");
	}

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardContent className="p-6">
				<form>
					<div className="flex flex-col gap-1 w-fit mb-6">
						<div className="flex items-center gap-4">
							<Badge variant="secondary">Draft</Badge>
							<Input
								name="invoiceName"
								type="text"
								value={form.invoiceName}
								onChange={handleChange}
								defaultValue={invoice.invoiceName}
								placeholder="Test 123"
								disabled={invoiceState.isLoading}
							/>
						</div>
					</div>

					<div className="grid md:grid-cols-3 gap-6 mb-6">
						<div>
							<Label>Invoice No.</Label>
							<div className="flex">
								<span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
									#
								</span>
								<Input
									name="invoiceNumber"
									type="number"
									value={form.invoiceNumber}
									className="rounded-l-none"
									disabled={true}
								/>
							</div>
						</div>

						<div>
							<Label>Currency</Label>
							<Select
								disabled={invoiceState.isLoading}
								defaultValue={invoice.currency}
								onValueChange={handleCurrencyChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Currency" />
								</SelectTrigger>
								<SelectContent>
									{supportedCurrencies.map((currency) => (
										<SelectItem key={currency} value={currency}>
											{currencyNames[currency]} -- {currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<Label>From</Label>
							<div className="space-y-2">
								<Input disabled={true} defaultValue={invoice.fromName} />
								<Input disabled={true} defaultValue={invoice.fromName} />
								<Input disabled={true} defaultValue={invoice.fromAddress} />
							</div>
						</div>

						<div>
							<Label>To</Label>
							<div className="space-y-2">
								<Input
									name="clientName"
									type="text"
									onChange={handleChange}
									value={form.clientName}
									defaultValue={invoice.clientName}
									placeholder="Client Name"
									disabled={invoiceState.isLoading}
								/>
								<Input
									name="clientEmail"
									type="text"
									value={form.clientEmail}
									onChange={handleChange}
									defaultValue={invoice.clientEmail}
									placeholder="Client Email"
									disabled={invoiceState.isLoading}
								/>
								<Input
									name="clientAddress"
									type="text"
									value={form.clientAddress}
									onChange={handleChange}
									defaultValue={invoice.clientAddress}
									placeholder="Client Address"
									disabled={invoiceState.isLoading}
								/>
							</div>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<div>
								<Label>Invoice Issue Date</Label>
							</div>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-[280px] text-left justify-start"
										disabled={invoiceState.isLoading}
									>
										<CalendarIcon />

										{form.date ? (
											new Intl.DateTimeFormat("en-US", {
												dateStyle: "long",
											}).format(new Date(form.date))
										) : (
											<span>Pick a Date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<Calendar
										selected={form.date}
										onSelect={(date) => handleDateChange(date, "date")}
										mode="single"
										fromDate={new Date()}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div>
							<div>
								<Label>Invoice Due Date</Label>
							</div>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-[280px] text-left justify-start"
										disabled={invoiceState.isLoading}
									>
										<CalendarIcon />

										{form.dueDate ? (
											new Intl.DateTimeFormat("en-US", {
												dateStyle: "long",
											}).format(new Date(form.dueDate))
										) : (
											<span>Pick a Date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<Calendar
										selected={form.dueDate}
										onSelect={(date) => handleDateChange(date, "dueDate")}
										mode="single"
										fromDate={new Date()}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div>
						<div className="grid grid-cols-12 gap-4 mb-2 font-medium">
							<p className="col-span-6">Description</p>
							<p className="col-span-2">Quantity</p>
							<p className="col-span-2">Rate</p>
							<p className="col-span-2">Amount</p>
						</div>

						<div className="grid grid-cols-12 gap-4 mb-4">
							<div className="col-span-6">
								<Textarea
									name="invoiceItemDescription"
									value={form.invoiceItemDescription}
									defaultValue={invoice.invoiceItemDescription}
									onChange={handleChange}
									placeholder="Item name & description"
									disabled={invoiceState.isLoading}
								/>
							</div>
							<div className="col-span-2">
								<Input
									name="invoiceItemQuantity"
									type="number"
									placeholder="0"
									value={form.invoiceItemQuantity}
									defaultValue={invoice.invoiceItemQuantity}
									onChange={handleChange}
									disabled={invoiceState.isLoading}
								/>
							</div>
							<div className="col-span-2">
								<Input
									name="invoiceItemRate"
									value={form.invoiceItemRate}
									defaultValue={invoice.invoiceItemRate}
									onChange={handleChange}
									type="number"
									placeholder="0"
									disabled={invoiceState.isLoading}
								/>
							</div>
							<div className="col-span-2">
								<Input
									value={formatCurrency({
										amount: calculateTotal,
										currency: form.currency as any,
									})}
									disabled
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<div className="w-1/3">
							<div className="flex justify-between py-2">
								<span>Subtotal</span>
								<span>
									{formatCurrency({
										amount: calculateTotal,
										currency: form.currency as any,
									})}
								</span>
							</div>
							<div className="flex justify-between py-2 border-t">
								<span>Total ({form.currency})</span>
								<span className="font-medium underline underline-offset-2">
									{formatCurrency({
										amount: calculateTotal,
										currency: form.currency as any,
									})}
								</span>
							</div>
						</div>
					</div>

					<div>
						<Label>Note</Label>
						<Textarea
							name="note"
							value={form.note}
							disabled={invoiceState.isLoading}
							defaultValue={invoice.note}
							onChange={handleChange}
							placeholder="Add your Note/s right here..."
						/>
					</div>

					<div className="flex items-center justify-end mt-6">
						<div>
							<SubmitButton
								text="Update Invoice"
								onClick={handleEditInvoiceSubmit}
								isLoading={invoiceState.isLoading}
							/>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default EditInvoice;
