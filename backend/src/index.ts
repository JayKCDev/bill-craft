import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import invoiceRoutes from "./routes/invoice.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // for parsing cookies
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.disable("x-powered-by"); // less hackers know about our stack

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	console.log("Headers:", req.headers);
	next();
});

app.options("*", (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.status(200).end(); // Respond with a 200 status for preflight
});

const corsOptions = {
	// @ts-ignore
	origin: (origin, callback) => {
		const allowedOrigins =
			process.env.NODE_ENV === "production"
				? [process.env.FRONTEND_URL]
				: ["http://localhost:3000"];

		// Allow requests with no origin (e.g., mobile apps or curl requests)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	methods: "GET, POST, PATCH, DELETE, OPTIONS",
	allowedHeaders:
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
};
app.use(cors(corsOptions));

// app.use((req, res, next) => {
// 	// Whitelisted allowed origins
// 	const allowedOrigins =
// 		process.env.NODE_ENV === "production"
// 			? [process.env.FRONTEND_URL]
// 			: ["http://localhost:3000"];

// 	const origin = req.headers.origin;

// 	if (origin && allowedOrigins.includes(origin)) {
// 		res.setHeader("Access-Control-Allow-Origin", origin); // Set specific origin
// 	}

// 	res.setHeader(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
// 	);
// 	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
// 	res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)

// 	next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
	console.log("Server listening on port " + process.env.PORT);
});
