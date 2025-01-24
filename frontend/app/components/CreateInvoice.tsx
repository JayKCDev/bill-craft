"use client";
import { useEffect, useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { SubmitButton } from "./SubmitButtons";
import { formatCurrency } from "../utils/helpers";
import { useAppSelector, useAppDispatch } from "@/app/hooks/reduxHooks";
import { toast } from "sonner";
import { handleCreateInvoice } from "@/app/features/invoice/invoiceSlice";
import { useRouter } from "next/navigation";
import {
	invoiceStatus,
	supportedCurrencies,
	Invoice,
	currencyNames,
} from "@/app/utils/constants";
import { validatePayload } from "@/app/utils/helpers";

const initialState: Invoice = {
	invoiceName: "",
	invoiceNumber: "1",
	total: "0",
	status: invoiceStatus[0] as "PENDING" | "PAID",
	fromName: "",
	fromEmail: "",
	fromAddress: "",
	clientName: "",
	clientEmail: "",
	clientAddress: "",
	date: new Date(),
	currency: supportedCurrencies[0] as "USD" | "INR" | "EUR",
	dueDate: new Date(),
	invoiceItemDescription: "",
	invoiceItemQuantity: "1",
	invoiceItemRate: "1",
	note: "",
};

/**
 * CreateInvoice component
 * @component
 * @example
 * return (
 *   <CreateInvoice />
 * )
 */

const CreateInvoice = () => {
	/**
	 * Router instance
	 * @type {NextRouter}
	 */
	const router = useRouter();

	/**
	 * Dispatch function from Redux
	 * @type {Dispatch}
	 */
	const dispatch = useAppDispatch();

	/**
	 * Auth &  Invoice state from Redux
	 * @type {Object}
	 */
	const { authState, invoiceState } = useAppSelector((state) => state);

	/**
	 * Form state
	 * @type {Invoice}
	 */
	const [form, setForm] = useState({
		...initialState,
		fromEmail: authState?.user?.email,
		fromName: `${authState?.user?.firstName} ${authState?.user?.lastName}`,
		fromAddress: authState?.user?.address,
		invoiceNumber:
			invoiceState?.invoices[0]?.invoiceNumber + 1
				? (invoiceState?.invoices[0]?.invoiceNumber + 1).toString()
				: "1",
	});

	const calculateTotal =
		(Number(form.invoiceItemQuantity) || 0) *
		(Number(form.invoiceItemRate) || 0);

	/**
	 * Handle form changes
	 * @param {ChangeEvent} e
	 */

	const handleChange = (e: any) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	// Separate handler for Currency Select component since it doesn't provide a standard event object
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
	}, [form.invoiceItemRate, form.invoiceItemQuantity]);

	const handleCreateInvoiceSubmit = async (
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();
		if (!validatePayload(form, "note")) {
			return toast.error("Please fill in all fields");
		}
		try {
			await dispatch(handleCreateInvoice(form));
			return router.push("/dashboard/invoices");
		} catch (error) {
			toast.error("Request failed...");
		}
	};

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
								placeholder="M/s. ABC Pvt. Ltd."
								value={form.invoiceName}
								onChange={handleChange}
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
									disabled={true}
									className="rounded-l-none"
									value={form.invoiceNumber}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div>
							<Label>Currency</Label>
							<Select
								disabled={invoiceState.isLoading}
								defaultValue={form.currency}
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
								<Input disabled={true} defaultValue={form.fromName} />
								<Input disabled={true} defaultValue={form.fromEmail} />
								<Input disabled={true} defaultValue={form.fromAddress} />
							</div>
						</div>

						<div>
							<Label>To</Label>
							<div className="space-y-2">
								<Input
									name="clientName"
									type="text"
									value={form.clientName}
									placeholder="Client Name"
									onChange={handleChange}
									disabled={invoiceState.isLoading}
								/>
								<Input
									name="clientEmail"
									type="text"
									value={form.clientEmail}
									placeholder="Client Email"
									onChange={handleChange}
									disabled={invoiceState.isLoading}
								/>
								<Input
									name="clientAddress"
									type="text"
									value={form.clientAddress}
									placeholder="Client Address"
									onChange={handleChange}
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
											}).format(form.date)
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
											}).format(form.dueDate)
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
									placeholder="Item name & description"
									onChange={handleChange}
									disabled={invoiceState.isLoading}
								/>
							</div>
							<div className="col-span-2">
								<Input
									name="invoiceItemQuantity"
									type="number"
									placeholder="0"
									value={form.invoiceItemQuantity}
									onChange={handleChange}
									disabled={invoiceState.isLoading}
								/>
							</div>
							<div className="col-span-2">
								<Input
									name="invoiceItemRate"
									// key={fields.invoiceItemRate.key}
									value={form.invoiceItemRate}
									// onChange={(e) => setRate(e.target.value)}
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
							onChange={handleChange}
							placeholder="Add your Note/s right here..."
						/>
					</div>

					<div className="flex items-center justify-end mt-6">
						<div>
							<SubmitButton
								text="Send Invoice to Client"
								onClick={handleCreateInvoiceSubmit}
								isLoading={invoiceState.isLoading}
							/>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateInvoice;
