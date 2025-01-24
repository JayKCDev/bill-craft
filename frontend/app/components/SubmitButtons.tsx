"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SubmitButtonProps } from "@/app/utils/constants";

export function SubmitButton({
	text,
	variant,
	onClick,
	isLoading,
}: SubmitButtonProps) {
	const [isDisabled, setIsDisabled] = useState(false);

	useEffect(() => {
		setIsDisabled(isLoading);
	}, [isLoading]);

	return (
		<>
			{isDisabled ? (
				<Button disabled className="w-full" variant={variant}>
					<Loader2 className="size-4 mr-2 animate-spin" /> Please wait...
				</Button>
			) : (
				<Button
					type="submit"
					className="w-full"
					variant={variant}
					{...(onClick && { onClick })}
				>
					{text}
				</Button>
			)}
		</>
	);
}
