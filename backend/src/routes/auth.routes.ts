import express, { RequestHandler } from "express";
import { check } from "express-validator";
import { signup, onboardUser, logout } from "@controllers/auth.controller";

import verifyJwtToken from "@middlewares/verifyJwtToken";

const router = express.Router();

router.post(
	"/signup",
	[
		check("email")
			.normalizeEmail()
			.isEmail()
			.withMessage("Invalid email address"),
		check("password")
			.isLength({ min: 5 })
			.withMessage("Password MUST be at least 5 characters"),
	],
	signup as RequestHandler
);

router.use(verifyJwtToken as RequestHandler);

router.post(
	"/onboarding",
	[
		check("firstName")
			.isLength({ min: 2 })
			.withMessage("First Name MUST be at least 2 characters"),
		check("lastName")
			.isLength({ min: 2 })
			.withMessage("Last Name MUST be at least 2 characters"),
		check("address")
			.isLength({ min: 5 })
			.withMessage("Address MUST be at least 5 characters"),
	],
	onboardUser as RequestHandler
);

router.get("/logout", logout as RequestHandler);

export default router;
