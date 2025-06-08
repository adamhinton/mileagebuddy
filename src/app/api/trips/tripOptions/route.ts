// Use server is default, but just for clarity
"use server";

import {
	getSingleTripOptionById,
	getTripOptionsByTripID,
} from "@/app/utils/server/queries/tripOptions/tripOptionsDBUtils";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import { TripOption } from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/BaseTripOptionSchemas";
import { NextResponse } from "next/server";

// _______________________________________________________________
// This is the endpoint for CRUD operations on TripOptions.

// Each Trip can have multiple TripOptions. Trips are handled in api/trips/route.ts. You have to call that endpoint as well to get an actual Trip.

// TODO docstrings
// _______________________________________________________________

export async function GET(
	request: Request
): Promise<NextResponse<TripOption[]> | NextResponse<{ error: string }>> {
	const url = new URL(request.url!);

	// Get all TripOptions for a Trip
	const tripID = url.searchParams.get("tripid");
	// Get single TripOption
	const tripOptionID = url.searchParams.get("tripoptionid");

	if (!tripOptionID && !tripID) {
		return NextResponse.json(
			{
				error:
					"tripoptionid OR tripid is required. For all tripOptions on a Trip, must be formatted like: /api/trips/tripoptions?tripid=2348. Or for a single TripOption,, api/trips/tripoptions?tripoptionid=1234,",
			},
			{ status: 400 }
		);
	}

	try {
		if (tripOptionID) {
			// Fetch details of a single TripOption by its ID
			// Will instate getSingleTripOptionById shortly
			const arrayWithSingleTripOption = await getSingleTripOptionById(
				Number(tripOptionID)
			);

			if (arrayWithSingleTripOption.length === 0) {
				return NextResponse.json(
					{ error: `TripOption with id ${tripOptionID} not found` },
					{ status: 404 }
				);
			}

			return NextResponse.json(arrayWithSingleTripOption, { status: 200 });
		} else if (tripID) {
			// Fetch all TripOptions for a Trip
			// Will instate getTripOptionsByTrip shortly
			const tripOptions = await getTripOptionsByTripID(tripID);
			return NextResponse.json(tripOptions, { status: 200 });
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch trip data:" + error,
			},
			{ status: 500 }
		);
	}
	return NextResponse.json(
		{ error: "Unexpected error occurred" },
		{ status: 500 }
	);
}

// TODO middleware to verify DELETEd TripOption exists and belongs to logged in user
export async function DELETE(request: Request) {
	const url = new URL(request.url!);
	const tripOptionID = url.searchParams.get("tripoptionid");

	if (!tripOptionID) {
		return NextResponse.json(
			{ error: "tripoptionid is required for deletion" },
			{ status: 400 }
		);
	}

	try {
		// Just delete trip here, we don't need a helper function
		const supabase = await createClientSSROnly();
		const { error } = await supabase
			.from("trip_options")
			.delete()
			.eq("id", Number(tripOptionID));

		if (error) {
			return NextResponse.json(
				{ error: "Failed to delete trip option: " + error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: `TripOption with id ${tripOptionID} deleted successfully` },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to delete trip option:" + error,
			},
			{ status: 500 }
		);
	}
}

// TODO middleware to verify POSTed TripOption exists, is valid and belongs to logged in user
// TODO make sure this return object is how we want it structured
export async function POST(
	request: Request
): Promise<NextResponse<TripOption | { error: string }>> {
	try {
		const supabase = await createClientSSROnly();
		const body = await request.json();

		if (!body.trip_id) {
			return NextResponse.json(
				{ error: "trip_id and name are required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("trip_options")
			.insert(body)
			.select("*")
			.single();

		if (error) {
			return NextResponse.json(
				{ error: "Failed to create trip option: " + error.message },
				{ status: 500 }
			);
		}
		// Middleware will have validated the TripOption before this point
		return NextResponse.json(data as unknown as TripOption, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to create trip option:" + error,
			},
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: Request
): Promise<NextResponse<TripOption | { error: string }>> {
	try {
		const supabase = await createClientSSROnly();
		const body = await request.json();

		if (!body.id) {
			return NextResponse.json(
				{ error: "id is required to update a trip option" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("trip_options")
			.update(body)
			.eq("id", body.id)
			.select("*")
			.single();

		if (error) {
			return NextResponse.json(
				{ error: "Failed to update trip option: " + error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(data as unknown as TripOption, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to update trip option:" + error,
			},
			{ status: 500 }
		);
	}
}
