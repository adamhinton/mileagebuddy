// README:
// I created a cloned request for each if block because it was causing errors if I didn't; something about how `await request.json()` can only be used once on a request, and it was somehow being used multiple times.
// Note that Zod validation runs both here (on the server) as well as on the client. It's lightweight enough that it's fine to run it twice, and it's a good idea to have it in both places to prevent any potential security issues.

import { NextResponse, type NextRequest } from "next/server";
import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
} from "./app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import {
	Vehicle_For_db_PATCH,
	VehicleSchemaForPATCH,
} from "./app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { updateSession } from "./app/utils/server/supabase/middleware";
import { getSingleVehicleById } from "./app/utils/server/queries/vehiclesDBUtils";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return request.cookies.get(name)?.value;
				},
			},
		}
	);
	const loggedInUser = await supabase.auth.getUser();
	const userId = loggedInUser.data.user?.id;

	console.log("loggedInUser:", loggedInUser);

	/**Checking if the user is logged in */
	const isLoggedIn = (await supabase.auth.getSession()).data.session
		? true
		: false;
	console.log("isLoggedIn", isLoggedIn);

	// Check if user is not signed in and trying to access /dashboard, then redirect to /login
	if (!isLoggedIn && request.nextUrl.pathname === "/dashboard") {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// On "edit vehicle" page (calculator/vehicle/{vehicleId}), if user is logged in, ensure that the vehicle belongs to the logged in user
	// Non-loggedin users get their vehicles from localStorage here
	if (request.nextUrl.pathname.match(/\/calculator\/edit\/[0-9]+/)) {
		const vehicleId = request.nextUrl.pathname.split("/").pop()!;
		const vehicleIdNum = Number(vehicleId);

		// This returns an array with one vehicle
		const vehicle = await getSingleVehicleById(vehicleIdNum);

		if (vehicle.length === 0 || vehicle[0]?.userid !== userId) {
			// throw error
			return NextResponse.json(
				{ error: `Vehicle with id ${vehicleId} not found for logged in user` },
				{ status: 404 }
			);
		}
	}

	if (
		request.method === "POST" &&
		request.nextUrl.pathname === "/api/vehicles"
	) {
		const clonedRequest = request.clone();

		try {
			const body = await clonedRequest.json();
			// Validate the request body using Zod schema
			// Now we know vehicle can be inserted in DB
			const isBodyValid = isValidVehiclePost(body);

			if (!isBodyValid) {
				return NextResponse.json(
					{ error: "Invalid POST vehicle input" },
					{ status: 400 }
				);
			}

			// Make sure logged in user's id matches vehicle's userId
			if (userId !== body.userid) {
				return NextResponse.json(
					{ error: "Logged in user's id does not match vehicle's userId" },
					{ status: 400 }
				);
			}

			// The actual db POST will be done in the api/vehicles/route.ts file
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

			const isBodyValid = isValidVehiclePatch(body);
			if (!isBodyValid) {
				return NextResponse.json(
					{ error: "Invalid PATCH vehicle input" },
					{ status: 400 }
				);
			}

			// Make sure logged in user's id matches vehicle's userId
			if (userId !== body.userid) {
				return NextResponse.json(
					{ error: "Logged in user's id does not match vehicle's userId" },
					{ status: 400 }
				);
			}

			// The actual db PATCH will be done in the api/vehicles/route.ts file
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

/**Validates that request body matches type Vehicle_For_DB_POST
 *
 * If true, vehicle is ready to be inserted into DB
 */
const isValidVehiclePost = (
	vehicle: unknown
): vehicle is Vehicle_For_db_POST => {
	const isSafe = VehicleToBePostedSchema.safeParse(vehicle);
	return isSafe.success;
};

/**Validates that request body matches type Vehicle_For_DB_PATCH
 *
 * If true, vehicle is ready to be inserted into DB
 */
const isValidVehiclePatch = (
	vehicle: unknown
): vehicle is Vehicle_For_db_PATCH => {
	const isSafe = VehicleSchemaForPATCH.safeParse(vehicle);
	return isSafe.success;
};
