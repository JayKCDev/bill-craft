import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { parseCookies } from "nookies";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value || null; // Get token from cookies

	const isProfileComplete =
		req.cookies.get("isProfileComplete")?.value === "true";
	const { pathname, origin } = req.nextUrl;

	if (pathname === "/view") {
		return NextResponse.next();
	}

	// Allow public access to "/" and "/login"
	if (!token && (pathname === "/" || pathname === "/login")) {
		return NextResponse.next();
	}

	// Redirect unauthenticated users to "/"
	if (!token) {
		if (pathname !== "/") {
			return NextResponse.redirect(`${origin}/`);
		}
		return NextResponse.next();
	}

	// Redirect authenticated users to "/onboarding" if the profile is incomplete
	if (token && !isProfileComplete) {
		if (pathname !== "/onboarding") {
			return NextResponse.redirect(`${origin}/onboarding`);
		}
		return NextResponse.next();
	}

	if (token && isProfileComplete) {
		if (pathname === "/onboarding" || pathname === "/login") {
			return NextResponse.redirect(`${origin}/dashboard`);
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

// Middleware configuration to apply it only to certain routes
export const config = {
	matcher: [
		"/dashboard/:path*", // Protect dashboard routes
		"/onboarding", // Protect onboarding route
		"/login", // Redirect to login if not authenticated
		"/view", // Redirect to pubicly accessible view/invoice page appropriately
		"/", // Redirect the landing page appropriately
	],
};
