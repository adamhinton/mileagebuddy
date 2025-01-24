import { updateSession } from "@/app/utils/server/supabaseUtilsCustom/supabaseMiddleware";
import { type NextRequest } from "next/server";
import { VehicleToBePostedSchema } from "./app/utils/server/types/GetVehicleTypes";

export async function middleware(request: NextRequest) {
	const body = await request.json();

	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		const isVehicleValid = VehicleToBePostedSchema.safeParse(body);
		if (isVehicleValid.error) {
			console.log("error in POST error block:", isVehicleValid.error);
			return new Response(JSON.stringify(isVehicleValid.error), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			});
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
