import { NextFunction, Request, Response } from "express";
import HttpError from "../models/HttpError.model.js";
import prisma from "../db/prisma.js";
import { validationResult } from "express-validator";
import { generateJwtToken } from "../middlewares/generateJwtToken.js";
import bcrypt from "bcrypt";
import {
	User,
	OnboardUser,
	SignupResponse,
	RequestProps,
} from "../utils/types.js";

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let response: SignupResponse = {
			id: "",
			token: "",
			email: "",
			isSignup: false,
		},
		user: User | null = null;

	const { email, password } = req.body;

	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		user = (await prisma.user.findUnique({ where: { email } })) as User;

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) throw new HttpError("Invalid credentials", 401);

			if (!user?.firstName || !user?.lastName || !user?.address) {
				response.isSignup = true;
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 12);

			user = (await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
			})) as User;

			response.isSignup = true;

			if (!user) {
				throw new HttpError("Error signing up", 500);
			}
		}

		const token = generateJwtToken({ userId: user.id, email }, res);

		response = {
			...response,
			token,
			id: user.id,
			email: user.email,
			firstName: user?.firstName,
			lastName: user?.lastName,
			address: user?.address,
		};

		return res.status(response.isSignup ? 201 : 200).json(response);
	} catch (error) {
		next(error);
	}
};

export const onboardUser = async (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.userData;
	const { firstName, lastName, address } = req.body;
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			// @ts-ignore
			throw new HttpError(errors.errors[0].msg, 400);
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			throw new HttpError("User not found", 404);
		}

		const updatedUser = (await prisma.user.update({
			where: { id: userId },
			data: {
				firstName,
				lastName,
				address,
			},
		})) as OnboardUser;

		const response = {
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			address: updatedUser.address,
		};

		return res.status(201).json(response);
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		next(error);
	}
};
