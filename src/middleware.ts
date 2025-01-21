import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/GetVehicleTypes";

export async function middleware(request: NextRequest) {
	console.log("General middleware starting");

	console.log("request.method:", request.method);
	console.log("request.nextUrl.pathname:", request.nextUrl.pathname);

	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		console.log("blah blah blah 123 POST to api/vehicles");
		const isSafe = VehicleToBePostedSchema.safeParse(request.body);
		console.log("isSafe:,", isSafe);
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
