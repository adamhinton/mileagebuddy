// README:
// I created a cloned request for each if block because it was causing errors if I didn't; something about how `await request.json()` can only be used once on a request, and it was somehow being used multiple times.
// Note that Zod validation runs both here (on the server) as well as on the client. It's lightweight enough that it's fine to run it twice, and it's a good idea to have it in both places to prevent any potential security issues.

import { NextResponse, type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { VehicleSchemaForPATCH } from "./app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { updateSession } from "./app/utils/server/supabase/middleware";
import { createClientSSROnly } from "./app/utils/server/supabase/server";

export async function middleware(request: NextRequest) {
	const supabase = await createClientSSROnly();

	/**Checking if the user is logged in */
	const isLoggedIn = (await supabase.auth.getSession()).data.session
		? true
		: false;
	console.log("isLoggedIn", isLoggedIn);

	// Check if user is not signed in and trying to access /dashboard, then redirect to /login
	if (!isLoggedIn && request.nextUrl.pathname === "/dashboard") {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		const clonedRequest = request.clone();

		try {
			const body = await clonedRequest.json();
			const isSafe = VehicleToBePostedSchema.safeParse(body);

			if (!isSafe.success) {
				return NextResponse.json(
					{ error: "Invalid POST vehicle input", details: isSafe.error.errors },
					{ status: 400 }
				);
			}
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
		}
	}

	if (
		request.method === "PATCH" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		const clonedRequest = request.clone();

		try {
			const body = await clonedRequest.json();
			const isSafe = VehicleSchemaForPATCH.safeParse(body);

			if (!isSafe.success) {
				return NextResponse.json(
					{
						error: "Invalid PATCH vehicle input",
						details: isSafe.error.errors,
					},
					{ status: 400 }
				);
			}
			// Your validation logic here
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
		}
	}

	// update user's auth session
	// Note: I changed utils/supabase/middleware.ts per supabase docs. If something goes wrong here, see that file.
	// supabase.com/docs/guides/auth/server-side/nextjs
	https: return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
