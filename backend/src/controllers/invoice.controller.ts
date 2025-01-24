import { NextFunction, Request, Response } from "express";
import HttpError from "@/models/HttpError.model";
import prisma from "@/db/prisma";
import { validationResult } from "express-validator";
import { ParsedDates, ParsedIntValues, RequestProps } from "@/utils/types";

const validateAndParseInteger = (value: string, fieldName: string): number => {
	const parsedValue = parseInt(value, 10);
	if (isNaN(parsedValue)) {
		throw new HttpError(`${fieldName} must be a valid number`, 400);
	}
	return parsedValue;
};

const validateAndParseDate = (value: string, fieldName: string): Date => {
	const parsedDate = new Date(value);
	if (isNaN(parsedDate.getTime())) {
		throw new HttpError(`${fieldName} must be a valid date`, 400);
	}
	return parsedDate;
};

export const fetchInvoices = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	try {
		if (!userId) {
			throw new HttpError("Invalid user", 404);
		}

		const invoices = await prisma.invoice.findMany({
			where: {
				userId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return res.status(200).json({ response: { invoices } });
	} catch (error) {
		next(error);
	}
};

export const createInvoice = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	const {
		invoiceName,
		invoiceNumber,
		total,
		status,
		fromName,
		fromEmail,
		fromAddress,
		clientName,
		clientEmail,
		clientAddress,
		date,
		dueDate,
		currency,
		invoiceItemDescription,
		invoiceItemQuantity,
		invoiceItemRate,
		note,
	} = req.body;

	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		// Parse and validate all integer fields at once
		const numericFields = {
			total,
			invoiceNumber,
			invoiceItemQuantity,
			invoiceItemRate,
		};

		const parsedValues = Object.entries(numericFields).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: validateAndParseInteger(value, key),
			}),
			{}
		) as ParsedIntValues;

		// Parse and validate date fields
		const dateFields = {
			date,
			dueDate,
		};

		const parsedDates = Object.entries(dateFields).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: validateAndParseDate(value, key),
			}),
			{}
		) as ParsedDates;

		const createdInvoice = await prisma.invoice.create({
			data: {
				clientAddress,
				clientEmail,
				clientName,
				currency,
				date: parsedDates.date,
				dueDate: parsedDates.dueDate,
				fromAddress,
				fromEmail,
				fromName,
				invoiceItemDescription,
				invoiceItemQuantity: parsedValues.invoiceItemQuantity,
				invoiceItemRate: parsedValues.invoiceItemRate,
				invoiceName,
				invoiceNumber: parsedValues.invoiceNumber,
				status,
				total: parsedValues.total,
				note,
				userId,
			},
		});

		if (!createdInvoice)
			throw new HttpError("Invoice not created, some error occured", 500);

		return res
			.status(201)
			.json({ createdInvoice, message: "Invoice created successfully" });
	} catch (error) {
		next(error);
	}
};

export const fetchInvoiceToView = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		const invoice = await prisma.invoice.findUnique({
			where: { id },
		});

		if (!invoice) throw new HttpError("Invoice not found", 404);

		return res.status(200).json({ invoice });
	} catch (error) {
		next(error);
	}
};

export const editInvoice = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	const { id } = req.params;

	const {
		invoiceName,
		invoiceNumber,
		total,
		status,
		fromName,
		fromEmail,
		fromAddress,
		clientName,
		clientEmail,
		clientAddress,
		date,
		dueDate,
		currency,
		invoiceItemDescription,
		invoiceItemQuantity,
		invoiceItemRate,
		note,
	} = req.body;

	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		// Parse and validate all integer fields at once
		const numericFields = {
			total,
			invoiceNumber,
			invoiceItemQuantity,
			invoiceItemRate,
		};

		const parsedValues = Object.entries(numericFields).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: validateAndParseInteger(value, key),
			}),
			{}
		) as ParsedIntValues;

		// Parse and validate date fields
		const dateFields = {
			date,
			dueDate,
		};

		const parsedDates = Object.entries(dateFields).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: validateAndParseDate(value, key),
			}),
			{}
		) as ParsedDates;

		const updatedInvoice = await prisma.invoice.update({
			where: {
				id,
				userId,
			},
			data: {
				clientAddress,
				clientEmail,
				clientName,
				currency,
				date: parsedDates.date,
				dueDate: parsedDates.dueDate,
				fromAddress,
				fromEmail,
				fromName,
				invoiceItemDescription,
				invoiceItemQuantity: parsedValues.invoiceItemQuantity,
				invoiceItemRate: parsedValues.invoiceItemRate,
				invoiceName,
				invoiceNumber: parsedValues.invoiceNumber,
				status,
				total: parsedValues.total,
				note,
			},
		});

		if (!updatedInvoice)
			throw new HttpError("Invoice not updated, some error occured", 500);

		return res
			.status(200)
			.json({ updatedInvoice, message: "Invoice updated successfully" });
	} catch (error) {
		next(error);
	}
};

export const deleteInvoice = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	const { id } = req.params;
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		const invoiceToDelete = await prisma.invoice.findUnique({
			where: {
				id,
				userId,
			},
		});

		if (!invoiceToDelete) throw new HttpError("Invoice not found", 404);

		await prisma.invoice.delete({
			where: {
				id: invoiceToDelete.id,
				userId: invoiceToDelete.userId,
			},
		});

		return res.status(204).json({ message: "Invoice deleted successfully" });
	} catch (error) {
		next(new HttpError("Error deleting invoice", 404));
	}
};

export const markInvoiceAsPaid = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	const { id } = req.params;
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		const updatedInvoice = await prisma.invoice.update({
			where: {
				id,
				userId,
			},
			data: {
				status: "PAID",
			},
		});

		return res.status(200).json({ updatedInvoice });
	} catch (error) {
		next(error);
	}
};
