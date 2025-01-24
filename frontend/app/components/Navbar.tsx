"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useAppSelector } from "../hooks/reduxHooks";

export function Navbar() {
	const authState = useAppSelector((state) => state.authState);

	return (
		<div className="flex items-center justify-between py-5">
			<Link href="/" className="flex items-center gap-2">
				<Image src={Logo} alt="Logo" className="size-10" />
				<h3 className="text-3xl font-semibold">
					Bill<span className="text-blue-500">Craft</span>
				</h3>
			</Link>
			<Link href={`${authState?.user?.token ? "/dashboard" : "/login"}`}>
				<RainbowButton>
					{!authState?.user?.token ? "Login" : "View Dashboard"}
				</RainbowButton>
			</Link>
		</div>
	);
}
