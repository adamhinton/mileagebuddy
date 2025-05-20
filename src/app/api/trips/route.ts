// Use server is default, but just for clarity
"use server";

// _______________________________________________________________
// This is the endpoint for CRUD operations on a user's Trips.

// Each Trip can have multiple TripOptions. Those are handled in api/trip/tripoptions/route.ts. You have to call that endpoint as well to get a trip's TripOptions.
// _______________________________________________________________

import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import { NextResponse } from "next/server";

// Userid is required
// If tripid query param is passed in, it gets only that vehicle
// If no tripid is passed in, it gets all vehicles for that user
// Note that you have to call api/trips/tripoptions to get TripOptions

// TODO validate trips from GET; either in middleware or in GET function
export async function GET(request: Request) {
	const supabase = await createClientSSROnly();

	const url = new URL(request.url!);

	const userID = url.searchParams.get("userid");
	const tripID = url.searchParams.get("tripid");

	if (!userID) {
		return NextResponse.json(
			{
				error:
					"userid is required. Must be formatted like: /api/trips?userid=2348. Or, optionally, api/vehicles?userid=1234&tripid=2348",
			},
			{ status: 400 }
		);
	}

	try {
		if (tripID) {
			// Fetch details of a single vehicle by its ID
			/**
			 * Will be an array with one vehicle if vehicle exists in db, or empty array if vehicle isn't in db
			 */
			// TODO about to implemenet getSingleTripById
			const arrayWithSingleTrip = await getSingleTripById(Number(tripID));

			if (arrayWithSingleTrip.length === 0) {
				return NextResponse.json(
					{ error: `trip with id ${tripID} not found` },
					{ status: 404 }
				);
			}

			return NextResponse.json(arrayWithSingleTrip, { status: 200 });
		} else {
			// VehicleId not specified, so get all trips for userID
			// TODO instate getTripsByUser - coming up shortly
			const trips = await getTripsByUser(supabase, userID);
			return NextResponse.json(trips, { status: 200 });
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
