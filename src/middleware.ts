import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { NextResponse, type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/VehicleTypes/POSTVehicleTypes";

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
