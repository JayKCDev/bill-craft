import express, { RequestHandler } from "express";
import { check } from "express-validator";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import invoiceValidators from "../middlewares/invoiceValidators.js";
import {
	editInvoice,
	fetchInvoices,
	deleteInvoice,
	createInvoice,
	markInvoiceAsPaid,
	fetchInvoiceToView,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.get(
	"/view/invoice/:id",
	check("id").not().isEmpty(),
	fetchInvoiceToView as RequestHandler
);

router.use(verifyJwtToken as RequestHandler);

router.get("/", fetchInvoices as RequestHandler);

router.post("/create", invoiceValidators, createInvoice as RequestHandler);

router.put("/edit/:id", invoiceValidators, editInvoice as RequestHandler);

router.delete(
	"/delete/:id",
	check("id").not().isEmpty(),
	deleteInvoice as RequestHandler
);

router.put(
	"/markPaid/:id",
	check("id").not().isEmpty(),
	markInvoiceAsPaid as RequestHandler
);

export default router;
