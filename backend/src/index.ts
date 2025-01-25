import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import invoiceRoutes from "./routes/invoice.routes.js";

dotenv.config();

const allowedOrigin =
	process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000" as string;

const app = express();
app.use(express.json());
app.use(cookieParser()); // for parsing cookies

// Basic CORS options configuration for CORS package
const corsOptions = {
	origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000",
	credentials: true, // Allow cookies
	methods: "GET, POST, PATCH, DELETE, OPTIONS",
	allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

// Apply the `cors` package middleware (for general routes)
app.use(cors(corsOptions));
app.disable("x-powered-by"); // less hackers know about our stack

// Middleware to handle CORS
// @ts-ignore
app.use((req: Request, res:Response, next: NextFunction) => {
	const origin = req.headers.origin;
	
	// Block requests from disallowed origins
	if (!origin || (origin && origin !== allowedOrigin)) {
		return res.status(403).json({ message: "Unauthenticated, you shall not pass!" });
	}

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		return res.status(200).end(); // Preflight requests terminate here
	}

	if (origin === allowedOrigin) {
		res.setHeader("Access-Control-Allow-Origin", allowedOrigin as string); // Allow specific origin
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
		res.setHeader("Access-Control-Allow-Credentials", "true");
	}
	next(); // Proceed with other requests
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
