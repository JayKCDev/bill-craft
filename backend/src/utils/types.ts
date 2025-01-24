import { Request } from "express";

export interface RequestProps extends Request {
	userData: { userId: string };
}

export interface JwtTokenArgs {
	userId: string;
	email: string;
}

export interface User {
	id: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	address?: string;
}

export interface SignupResponse {
	id: string;
	token: string;
	email: string;
	firstName?: string;
	lastName?: string;
	address?: string;
	isSignup: boolean;
}

export interface OnboardUser {
	firstName: string;
	lastName: string;
	address: string;
}

export interface ParsedDates {
	date: Date;
	dueDate: Date;
}

export interface ParsedIntValues {
	total: number;
	invoiceNumber: number;
	invoiceItemQuantity: number;
	invoiceItemRate: number;
}
