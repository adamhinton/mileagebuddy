import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	console.log("General middleware starting");

	throw new Error(
		"This is a custom middleware error. I'm trying to break this."
	);

	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
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
