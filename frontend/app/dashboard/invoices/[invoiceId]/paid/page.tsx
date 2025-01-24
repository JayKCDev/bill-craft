"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { use } from "react";
import Image from "next/image";
import PaidGif from "@/public/paid-gif.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleInvoiceMarkAsPaid } from "@/app/features/invoice/invoiceSlice";
import { Params } from "@/app/utils/constants";

const MarkAsPaid = ({ params }: { params: Params }) => {
	const resolvedParams = use(params);
	const { invoiceId } = resolvedParams;
	const dispatch = useAppDispatch();
	const router = useRouter();
	const invoiceState = useAppSelector((state) => state.invoiceState);

	const handleInvoiceMarkAsPaidSubmit = async (e: any) => {
		e.preventDefault();
		if (!invoiceId) return toast.error("Invoice Id not found");
		try {
			await dispatch(handleInvoiceMarkAsPaid(invoiceId));
			router.push("/dashboard/invoices");
		} catch (error) {
			toast.error("Error marking invoice as paid...");
		}
	};

	return (
		<div className="flex flex-1 justify-center items-center">
			<Card className="max-w-[500px]">
				<CardHeader>
					<CardTitle>Mark as Paid?</CardTitle>
					<CardDescription>
						Are you sure you want to mark this invoice as paid?
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Image src={PaidGif} alt="Paid Gif" className="rounded-lg" />
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/dashboard/invoices"
					>
						Cancel
					</Link>
					<form>
						<SubmitButton
							text="Mark as Paid!"
							isLoading={invoiceState.isLoading}
							onClick={handleInvoiceMarkAsPaidSubmit}
						/>
					</form>
				</CardFooter>
			</Card>
		</div>
	);
};

export default MarkAsPaid;
