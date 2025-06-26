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
import { getSingleVehicleById } from "./app/utils/server/queries/vehicles/vehiclesDBUtils";
import { createServerClient } from "@supabase/ssr";
import {
	Trip_For_DB_POST,
	TripSchemaForPOST,
} from "./app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import {
	TripOption_For_DB_POST,
	TripOptionSchemaForPOST,
} from "./app/zod/schemas/trips/TripSchemas/TripOptionSchemas/TripOptionSchemaForPost";
import {
	TripOption_For_DB_PATCH,
	TripOptionSchemaForPATCH,
} from "./app/zod/schemas/trips/TripSchemas/TripOptionSchemas/TripOptionSchemaForPatch";

// Saving strings of path names to avoid typos
const DASHBOARD_PATH = "/dashboard";
const CALCULATOR_PATH = "/calculator/";
const TRIPOPTIONS_API_PATH = "/api/trips/tripOptions";
const VEHICLES_API_PATH = "/api/vehicles";
const vehicleEditPathRegex = new RegExp(`^${CALCULATOR_PATH}edit/[0-9]+$`);

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

	// Ensure non-authenticated users cannot access /dashboard
	// Dashboard doesn't show up in Tabs either if user isn't logged in, so this is just a backup
	if (request.nextUrl.pathname === DASHBOARD_PATH && !userId) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// On "edit vehicle" page (calculator/vehicle/{vehicleId}), if user is logged in, ensure that the vehicle belongs to the logged in user
	// Non-loggedin users get their vehicles from localStorage here
	if (request.nextUrl.pathname.match(vehicleEditPathRegex) && userId) {
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

	// Validate POSTed Vehicle
	if (
		request.method === "POST" &&
		request.nextUrl.pathname === VEHICLES_API_PATH
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

	// Validate PATCHed Vehicle
	if (
		request.method === "PATCH" &&
		request.nextUrl.pathname === VEHICLES_API_PATH
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

	// Validated POSTed Vehicle
	if (
		request.method === "POST" &&
		request.nextUrl.pathname === VEHICLES_API_PATH
	) {
		const clonedRequest = request.clone();
		try {
			const body = await clonedRequest.json();
			const isBodyValid = isValidTripPOST(body);

			if (!isBodyValid) {
				return NextResponse.json(
					{ error: "Invalid POST Trip input" },
					{ status: 400 }
				);
			}

			// Make sure logged in user's id matches vehicle's userId
			if (userId !== body.userID) {
				return NextResponse.json(
					{ error: "Logged in user's id does not match new trip's userId" },
					{ status: 400 }
				);
			}
			// The actual db POST will be done in the api/trips/route.ts file
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
		}
	}

	// Validate POSTed TripOption
	if (
		request.method === "POST" &&
		request.nextUrl.pathname === TRIPOPTIONS_API_PATH
	) {
		const clonedRequest = request.clone();
		try {
			const body = await clonedRequest.json();
			const isBodyValid = isValidTripOptionPOST(body);

			if (!isBodyValid) {
				return NextResponse.json(
					{ error: "Invalid POST TripOption input" },
					{ status: 400 }
				);
			}
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
		}
	}

	// Validate PATCHed TripOption
	if (
		request.method === "PATCH" &&
		request.nextUrl.pathname === TRIPOPTIONS_API_PATH
	) {
		const clonedRequest = request.clone();
		try {
			const body = await clonedRequest.json();
			const isBodyValid = isValidTripOptionPATCH(body);

			if (!isBodyValid) {
				return NextResponse.json(
					{ error: "Invalid PATCH TripOption input" },
					{ status: 400 }
				);
			}
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
 * If true, vehicle is ready to be updated in DB
 */
const isValidVehiclePatch = (
	vehicle: unknown
): vehicle is Vehicle_For_db_PATCH => {
	const isSafe = VehicleSchemaForPATCH.safeParse(vehicle);
	return isSafe.success;
};

/** Validates that request body matches type Trip_For_DB_POST
 *
 * If true, trip is ready to be inserted into DB
 */
const isValidTripPOST = (trip: unknown): trip is Trip_For_DB_POST => {
	const isSafe = TripSchemaForPOST.safeParse(trip);
	return isSafe.success;
};

/** Validates that request body matches type TripOption_For_DB_POST
 *
 * If true, trip option is ready to be inserted into DB
 */
const isValidTripOptionPOST = (
	tripOption: unknown
): tripOption is TripOption_For_DB_POST => {
	const isSafe = TripOptionSchemaForPOST.safeParse(tripOption);
	return isSafe.success;
};

/** Validates that request body matches type TripOption_For_DB_PATCH
 *
 * If true, trip option is ready to be updated in DB
 */
const isValidTripOptionPATCH = (
	tripOption: unknown
): tripOption is TripOption_For_DB_PATCH => {
	const isSafe = TripOptionSchemaForPATCH.safeParse(tripOption);
	return isSafe.success;
};
