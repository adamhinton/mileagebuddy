import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/GetVehicleTypes";

export async function middleware(request: NextRequest) {
	console.log("General middleware starting");

	//If it's POST to api/vehicles ... code
	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		// console.log("request:", request.clone().json());

		const body = await request.json();

		const isSafe = VehicleToBePostedSchema.safeParse(body);
		console.log("isSafe:", isSafe);
		console.log("isSafe.error:", isSafe.error);

		// console.log("body:", body);
		console.log("blah blah blah 123 POST to api/vehicles");
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
