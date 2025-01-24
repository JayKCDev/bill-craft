"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { logout } from "@/app/features/auth/authSlice";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Example using react-toastify

const SessionManager = () => {
	const dispatch = useAppDispatch();

	const router = useRouter();

	const tokenExpirationTime = useAppSelector(
		(state: RootState) => state?.authState?.user?.tokenExpirationTime
	);

	useEffect(() => {
		if (tokenExpirationTime) {
			const currentTime = new Date().getTime();
			const expirationTime = new Date(tokenExpirationTime).getTime();
			const remainingTime = expirationTime - currentTime;

			if (remainingTime > 0) {
				// Set timeout to handle logout on expiration
				const timeout = setTimeout(() => {
					toast.info("Session expired, please login again");
					dispatch(logout());
					router.push("/");
				}, remainingTime);

				// Cleanup timeout if the component unmounts or the tokenExpirationTime changes
				return () => clearTimeout(timeout);
			} else {
				// Token already expired
				toast.info("Session expired, please login again");
				dispatch(logout());
				router.push("/");
			}
		}
	}, [tokenExpirationTime, dispatch, router]);

	return null; // This component doesn't render anything
};

export default SessionManager;
