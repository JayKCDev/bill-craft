import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRoutes from "@routes/auth.routes.js";
import errorHandler from "@middlewares/errorHandler.js";
import invoiceRoutes from "@routes/invoice.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // for parsing cookies
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.disable("x-powered-by"); // less hackers know about our stack

app.use((req, res, next) => {
	// Whitelisted allowed origins
	const allowedOrigins =
		process.env.NODE_ENV === "production"
			? [process.env.FRONTEND_URL, "http://localhost:3000"]
			: ["http://localhost:3000"];

	const origin = req.headers.origin;

	if (origin && allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin); // Set specific origin
	}

	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)

	next();
});

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
	console.log("Server listening on port " + process.env.PORT);
});
