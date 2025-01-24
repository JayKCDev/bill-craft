"use client";
import prisma from "@/app/utils/db";
import { use } from "react";
import { useRouter } from "next/navigation";
import { requireUser } from "@/app/utils/hooks";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import WarningGif from "@/public/warning-gif.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { DeleteInvoice } from "@/app/actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { handleDeleteInvoice } from "@/app/features/invoice/invoiceSlice";
import { toast } from "sonner";
import { Params } from "@/app/utils/constants";

const DeleteInvoiceRoute = ({ params }: { params: Params }) => {
	const invoiceState = useAppSelector((state) => state.invoiceState);
	const resolvedParams = use(params);
	const { invoiceId } = resolvedParams;
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleInvoiceDeleteSubmit = async (e: any) => {
		e.preventDefault();

		if (!invoiceId) return toast.error("Invoice Id not found");
		try {
			await dispatch(handleDeleteInvoice(invoiceId));
			router.push("/dashboard/invoices");
		} catch (error) {
			toast.error("Error deleting invoice...");
		}
	};

	return (
		<div className="flex flex-1 justify-center items-center">
			<Card className="max-w-[500px]">
				<CardHeader>
					<CardTitle>Delete Invoice</CardTitle>
					<CardDescription>
						Are you sure that you want to delete this invoice?
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Image src={WarningGif} alt="Warning Gif" className="rounded-lg" />
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
							text="Delete Invoice"
							variant={"destructive"}
							isLoading={invoiceState.isLoading}
							onClick={handleInvoiceDeleteSubmit}
						/>
					</form>
				</CardFooter>
			</Card>
		</div>
	);
};

export default DeleteInvoiceRoute;
