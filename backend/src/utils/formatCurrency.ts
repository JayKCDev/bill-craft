interface CurrencyFormat {
	amount: number;
	currency: "USD" | "INR" | "EUR";
}

export function formatCurrency({ amount, currency }: CurrencyFormat) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}
