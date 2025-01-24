import { check } from "express-validator";

const invoiceValidators = [
	check("invoiceName")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Name is required"),
	check("invoiceNumber")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Number is required"),
	check("total")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Total is required"),
	check("status")
		.trim()
		.escape()
		.isIn(["PENDING", "PAID"])
		.withMessage("Missing invoice status"),
	check("fromName")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Sender's Name is required"),
	check("fromEmail")
		.not()
		.isEmpty()
		.trim()
		.isEmail()
		.normalizeEmail()
		.escape()
		.withMessage("Sender's Email is required"),
	check("fromAddress")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Sender's Address is required"),
	check("clientName")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Client Name is required"),
	check("clientEmail")
		.not()
		.isEmpty()
		.trim()
		.isEmail()
		.normalizeEmail()
		.escape()
		.withMessage("Client Email is required"),
	check("clientAddress")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Client Address is required"),
	check("date")
		.not()
		.isEmpty()
		.escape()
		.withMessage("Invoice Issue Date is required"),
	check("currency")
		.trim()
		.escape()
		.isIn(["USD", "INR", "EUR"])
		.withMessage("Currency is required"),
	check("dueDate")
		.not()
		.isEmpty()
		.escape()
		.withMessage("Invoice Due Date is required"),
	check("invoiceItemDescription")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Description is required"),
	check("invoiceItemQuantity")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Quantity is required"),
	check("invoiceItemRate")
		.not()
		.isEmpty()
		.trim()
		.escape()
		.withMessage("Invoice Rate is required"),
	check("note").optional().trim().escape(),
];

export default invoiceValidators;
