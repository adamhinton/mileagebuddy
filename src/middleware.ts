// README:
// I created a cloned request for each if block because it was causing errors if I didn't; something about how `await request.json()` can only be used once on a request, and it was somehow being used multiple times.

import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { NextResponse, type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { VehicleSchemaForPATCH } from "./app/utils/server/types/VehicleTypes/PATCHVehicleTypes";

// TODO: User stuff, including:
// Validate User
// Validate that Vehicles etc match logged in user

export async function middleware(request: NextRequest) {
	console.log("starting middleware");
	console.log("request in middleware:", request);
	console.log("request.url in middleware:", request.url);
	// Only try to parse JSON for POST requests to /api/vehicles
	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		const clonedRequest = request.clone();

		try {
			const body = await clonedRequest.json();
			const isSafe = VehicleToBePostedSchema.safeParse(body);

			if (!isSafe.success) {
				// send back error message(s)
				return NextResponse.json(
					{ error: "Invalid POST vehicle input", details: isSafe.error.errors },
					{ status: 400 }
				);
			}
			// Your validation logic here
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
	return await updateSession(request);
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
