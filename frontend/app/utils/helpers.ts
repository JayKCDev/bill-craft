import { CurrencyFormat } from "@/app/utils/constants";
import { setCookie } from "nookies";

export function formatCurrency({ amount, currency }: CurrencyFormat) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount);
}

export const validatePayload = <T extends Record<string, any>>(
	payload: T,
	optionalKey: keyof T | undefined = undefined
): boolean => {
	for (const [field, value] of Object.entries(payload) as [keyof T, any][]) {
		if (optionalKey && field === optionalKey) continue; // Skip validation for the specified key if optionalKey is defined
		if (!value) {
			return false; // Return false if any field (other than optionalKey) is falsy
		}
	}
	return true; // Return true if all fields (except optionalKey) are valid
};

export const setAuthCookies = (
	token: string | null,
	isProfileComplete: boolean
) => {
	const cookieOptions = {
		path: "/",
		// httpOnly: process.env.NODE_ENV === "production",
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
		maxAge: 60 * 60, // 1 hour expiry
	};

	if (token) {
		// Set cookies for token and profile completion
		setCookie(null, "token", token, cookieOptions);
	}

	setCookie(
		null,
		"isProfileComplete",
		String(isProfileComplete),
		cookieOptions
	);
};
