import { HomeIcon, Users2 } from "lucide-react";

export type Params = Promise<{ invoiceId: string }>;
export const invoiceStatus = ["PENDING", "PAID"];
export const supportedCurrencies = ["USD", "INR", "EUR"];

// Currency display names mapping
export const currencyNames: Record<string, string> = {
	USD: "United States Dollar",
	INR: "Indian Rupee",
	EUR: "Euro",
};

export const dashboardLinks = [
	{
		id: 0,
		name: "Dashboard",
		href: "/dashboard",
		icon: HomeIcon,
	},
	{
		id: 1,
		name: "Invoices",
		href: "/dashboard/invoices",
		icon: Users2,
	},
];

export interface OnboardingForm {
	email: string;
	firstName: string;
	lastName: string;
	address: string;
}

export interface CurrencyFormat {
	amount: number;
	currency: "USD" | "INR" | "EUR";
}

export interface InvoiceActions {
	id: string;
	status: string;
}

export interface EmptyState {
	title: string;
	description: string;
	buttontext: string;
	href: string;
}

export interface Graph {
	data: {
		date: string;
		amount: number;
	}[];
}

export interface RainbowButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface SubmitButtonProps {
	text: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading: boolean;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null
		| undefined;
}

export interface Invoice {
	id?: string;
	invoiceName: string;
	total: string;
	status: "PENDING" | "PAID";
	date: Date;
	dueDate: Date;
	fromName: string;
	fromEmail: string;
	fromAddress: string;
	clientName: string;
	clientEmail: string;
	clientAddress: string;
	currency: "USD" | "INR" | "EUR";
	invoiceNumber: string;
	note?: string;
	invoiceItemDescription: string;
	invoiceItemQuantity: string;
	invoiceItemRate: string;
}

export interface InvoiceState {
	invoices: Array<any>;
	isLoading: boolean;
	initialFetchAttempted: boolean;
	invoiceToView: object | null;
}

export interface AuthState {
	user: {
		id: string;
		email: string;
		token: string | null;
		firstName: string;
		lastName: string;
		address: string;
		isSignup: boolean;
		tokenExpirationTime: string;
	};
	isLoading: boolean;
}
