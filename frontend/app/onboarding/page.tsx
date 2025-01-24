"use client";
import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../components/SubmitButtons";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { handleUserOnboard } from "@/app/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OnboardingForm } from "@/app/utils/constants";
import { validatePayload } from "@/app/utils/helpers";

const initialState: OnboardingForm = {
	email: "",
	firstName: "",
	lastName: "",
	address: "",
};

const Onboarding = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const authState = useAppSelector((state) => state.authState);
	const [form, setForm] = useState({
		...initialState,
		email: authState.user?.email,
	});

	const handleChange = (e: any) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (!validatePayload(form)) {
			return toast.error("Please fill in all fields");
		}

		try {
			await dispatch(handleUserOnboard(form));
		} catch (error) {
			toast.error("Error occured while onboarding...");
		}
	};

	useEffect(() => {
		if (authState.isLoading || !authState.user?.token) return;
		authState.user?.firstName &&
		authState.user?.lastName &&
		authState.user?.address
			? router.push("/dashboard")
			: router.push("/onboarding");
	}, [
		authState.user?.firstName,
		authState.user?.token,
		authState.user?.lastName,
		authState.user?.address,
		authState.isLoading,
	]);

	return (
		<div className="min-h-screen w-screen flex items-center justify-center">
			<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
			</div>
			<Card className="max-w-sm mx-auto">
				<CardHeader>
					<CardTitle className="text-xl">You are almost finished!</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-2">
								<Label>First Name</Label>
								<Input
									name="firstName"
									type="text"
									required
									placeholder="John"
									onChange={handleChange}
									disabled={authState.isLoading}
								/>
							</div>
							<div className="grid gap-2">
								<Label>Last Name</Label>
								<Input
									name="lastName"
									type="text"
									required
									placeholder="Doe"
									onChange={handleChange}
									disabled={authState.isLoading}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label>Email</Label>
							<Input
								name="email"
								type="email"
								disabled={true}
								value={authState.user?.email}
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label>Address</Label>
							<Input
								name="address"
								type="text"
								placeholder="Chad street 123"
								required
								onChange={handleChange}
								disabled={authState.isLoading}
							/>
						</div>

						<SubmitButton
							text="Finish onboarding"
							onClick={onSubmit}
							isLoading={authState.isLoading}
						/>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Onboarding;
