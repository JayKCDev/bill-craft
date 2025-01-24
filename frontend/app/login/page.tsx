"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../components/SubmitButtons";
import { handleUserSubmit } from "@/app/features/auth/authSlice";
import { toast } from "sonner";

const initialState = {
	password: "",
	email: "",
};

const Login = () => {
	const authState = useAppSelector((state) => state.authState); // Return Root State Slices from store.ts
	const dispatch = useAppDispatch(); // Dispatch Actions
	const [form, setForm] = useState(initialState);
	const router = useRouter();

	const handleChange = (e: any) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!form.email || !form.password) {
			return toast.error("Invalid credentials");
		}

		if (form.password.length < 5) {
			return toast.error("Password MUST be atleast 5 characters long");
		}

		try {
			await dispatch(handleUserSubmit(form));
		} catch (error) {
			toast.error("Error logging in...");
		}
	};

	useEffect(() => {
		if (authState.isLoading || !authState.user?.token) return;
		authState.user?.isSignup
			? router.push("/onboarding")
			: router.push("/dashboard");
	}, [authState.user?.token, authState.isLoading]);

	return (
		<>
			<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
			</div>
			<div className="flex h-screen w-full items-center justify-center px-4">
				<Card className="max-w-sm">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
							Enter your email below to login in to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="flex flex-col gap-y-4">
							<div className="flex flex-col gap-y-2">
								<Label>Email</Label>
								<Input
									name="email"
									type="email"
									required
									placeholder="john@example.com"
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col gap-y-2">
								<Label>Password</Label>
								<Input
									name="password"
									type="password"
									required
									onChange={handleChange}
								/>
							</div>
							<SubmitButton
								text="Login"
								onClick={onSubmit}
								isLoading={authState.isLoading}
							/>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Login;
