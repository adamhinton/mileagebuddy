// Use server is default, but just for clarity
"use server";

import {
	addNewTripToDB,
	getSingleTripById,
	getTripsWithPopulatedOptions,
} from "@/app/utils/server/queries/trips/tripsDBUtils";
// _______________________________________________________________
// This is the endpoint for CRUD operations on a user's Trips.

// Each Trip can have multiple TripOptions. Those are handled in api/trip/tripoptions/route.ts. You have to call that endpoint as well to get a trip's TripOptions.
// _______________________________________________________________

import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import {
	Trip,
	TripSchema,
} from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { NextResponse } from "next/server";

// Userid is required
// If tripid query param is passed in, it gets only that trip
// If no tripid is passed in, it gets all trips for that user
// Note that you have to call api/trips/tripoptions to get TripOptions

export async function GET(
	request: Request
): Promise<NextResponse<Trip[] | { error: string }>> {
	const url = new URL(request.url!);

	const userID = url.searchParams.get("userid");
	const tripID = url.searchParams.get("tripid");

	if (!userID) {
		return NextResponse.json(
			{
				error:
					"userid is required. Must be formatted like: /api/trips?userid=2348. Or, optionally, api/trips?userid=1234&tripid=2348",
			},
			{ status: 400 }
		);
	}

	try {
		if (tripID) {
			// Fetch details of a single Trip by its ID
			/**
			 * Will be an array with one Trip if Trip exists in db, or empty array if Trip isn't in db
			 */
			const arrayWithSingleTrip = await getSingleTripById(Number(tripID));

			if (arrayWithSingleTrip.length === 0) {
				return NextResponse.json(
					{ error: `Trip with id ${tripID} not found` },
					{ status: 404 }
				);
			}

			return NextResponse.json(arrayWithSingleTrip, { status: 200 });
		} else {
			// TripId not specified, so get all trips for userID
			const trips = await getTripsWithPopulatedOptions(userID);
			console.log("trips in GET /api/trips:", trips);
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

export async function POST(
	request: Request
): Promise<NextResponse<Trip | { error: string }>> {
	const supabase = await createClientSSROnly();

	// Middleware has already validated this Trip and checked that its user id matches authenticated user
	const body: Trip_For_DB_POST = await request.json();

	// Separate out tripOptions from the body
	// This endpoint is only for adding a Trip, not TripOptions

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { tripOptions, ...tripDataToInsert } = body;

	const response = await addNewTripToDB(tripDataToInsert, supabase);

	const isTrip = TripSchema.safeParse(response);
	if (!isTrip.success && process.env.NODE_ENV === "development") {
		console.error(
			"New trip from POST failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
			isTrip.error.errors
		);
		throw new Error("New trip failed validation");
	}

	return response;
}

export async function PATCH(
	request: Request
): Promise<NextResponse<Trip | { error: string }>> {
	const supabase = await createClientSSROnly();

	const url = new URL(request.url!);
	const tripID = url.searchParams.get("tripid");

	if (!tripID) {
		return NextResponse.json({
			status: 400,
			error:
				"tripid is required. Must be formatted like: /api/trips?tripid=2348",
		});
	}

	// Middleware will have already verified that the trip belongs to the authenticated user and is a valid Trip
	const body = await request.json();
	const updatedTripRequestData: Trip_For_DB_PATCH = body;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id: schemaTripID, ...updatePayload } = updatedTripRequestData;

	// NOTE: For simplicity we're just including all Trip fields in the PATCH
	// This isn't high-volume enough to worry about performance
	// If we get a lot of traffic, we can optimize this later
	const { data, error } = await supabase
		.from("trips")
		// @ts-expect-error this expects some departureDate stuff but it's wrong
		.update(updatePayload)
		.eq("id", Number(tripID))
		.select("*")
		.single();
	if (error) {
		console.log("error:", error);
		return NextResponse.json(
			{
				error: "Failed to update trip data:" + error,
			},
			{ status: 500 }
		);
	}
	if (!data) {
		return NextResponse.json(
			{ error: `Trip with id ${tripID} not found` },
			{ status: 404 }
		);
	}

	// Validate the updated trip
	const isTrip = TripSchema.safeParse(data);
	if (!isTrip.success && process.env.NODE_ENV === "development") {
		console.error(
			"Updated trip from PATCH failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
			isTrip.error.errors
		);
		throw new Error("Updated trip failed validation");
	}

	return NextResponse.json(data as unknown as Trip, { status: 200 });
}

// TODO middleware to verify DELETEd trip belongs to authenticated user
/**
 * Deletes a Trip by its ID. Also cascades to delete all TripOptions associated with that Trip.
 * @returns the success message or an error if the Trip was not found or deletion failed.
 * @throws 400 if tripid is not provided
 * @throws 404 if the Trip with the specified ID does not exist
 * @throws 500 if there is an error during the deletion process
 * @example DELETE /api/trips?tripid=2348
 */
export async function DELETE(
	request: Request
): Promise<NextResponse<{ message: string } | { error: string }>> {
	const supabase = await createClientSSROnly();

	const url = new URL(request.url!);
	const tripID = url.searchParams.get("tripid");

	if (!tripID) {
		return NextResponse.json(
			{
				error:
					"tripid is required. Must be formatted like: /api/trips?tripid=2348",
			},
			{ status: 400 }
		);
	}

	const { data, error } = await supabase
		.from("trips")
		.delete()
		.eq("id", Number(tripID))
		.select("*")
		.single();

	if (error) {
		return NextResponse.json(
			{ error: "Failed to delete trip:" + error },
			{ status: 500 }
		);
	}

	if (!data) {
		return NextResponse.json(
			{ error: `Trip with id ${tripID} not found` },
			{ status: 404 }
		);
	}

	return NextResponse.json(
		{ message: `Trip with id ${tripID} deleted successfully` },
		{ status: 200 }
	);
}
