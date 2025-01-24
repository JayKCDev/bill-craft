import jwt from "jsonwebtoken";
import { Response } from "express";
import { JwtTokenArgs } from "@/utils/types";

export const generateJwtToken = (args: JwtTokenArgs, res: Response) => {
	const { userId, email } = args;
	const token = jwt.sign(
		{
			userId,
			email,
		},
		process.env.JWT_SECRET!,
		{ expiresIn: "1h" }
	);

	// res.cookie("token", token, {
	// 	maxAge: 60 * 60 * 1000, // 1 hour
	// 	httpOnly: true, //Prevents XSS cross site scripting attacks
	// 	// sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for development
	// 	sameSite: "strict", // Lax for development
	// 	secure: process.env.NODE_ENV === "production", // HTTPS-only in production
	// 	// path: "/",
	// });
	// console.log(`generateJwtToken.res: ${res}`);

	return token;
};
