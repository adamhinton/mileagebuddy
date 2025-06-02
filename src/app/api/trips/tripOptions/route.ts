// Use server is default, but just for clarity
"use server";

import {
	getSingleTripOptionById,
	getTripOptionsByTripID,
} from "@/app/utils/server/queries/tripOptions/tripOptionsDBUtils";
import { NextResponse } from "next/server";

// _______________________________________________________________
// This is the endpoint for CRUD operations on TripOptions.

// Each Trip can have multiple TripOptions. Trips are handled in api/trips/route.ts. You have to call that endpoint as well to get an actual Trip.
// _______________________________________________________________

export async function GET(request: Request) {
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
}
