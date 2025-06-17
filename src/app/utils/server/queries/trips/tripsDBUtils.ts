import { SupabaseClient } from "@supabase/supabase-js";
import {
	getSingleTripByIdQuery,
	getTripsByUserIdQuery,
} from "./getTripsQueries";
import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { NextResponse } from "next/server";
import { TripOption } from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/BaseTripOptionSchemas";
import { getTripOptionsByTripID } from "../tripOptions/tripOptionsDBUtils";
import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";

export async function getTripsByUser(userId: string): Promise<Trip[]> {
	const tripsDataQuery = getTripsByUserIdQuery(String(userId));
	const { data, error } = await tripsDataQuery;

	if (error) {
		throw new Error("Error fetching trips data: " + error.message);
	}

	// TODO IMPORTANT: Add TripOptions to this or somewhere
	// Then validate the data with zod
	return data as unknown as Trip[];
}

/**Returns an array with a single Trip if that trip id exists, or an empty array if Trip id doesn't exist */
// TODO: User id validation - shouldn't be necessary bc of protected routes etc, but double check our security anyway
export async function getSingleTripById(tripId: number): Promise<[Trip] | []> {
	const tripDataQuery = getSingleTripByIdQuery(tripId);
	const { data, error } = await tripDataQuery;
	if (error) {
		throw new Error("Error fetching trip data: " + error.message);
	}

	// TODO IMPORTANT: Add TripOptions to this or somewhere
	// Then validate the data with zod
	return data[0] ? [data[0] as unknown as Trip] : [];
}

/**
 * Attemps to add a new Trip to the DB
 *
 * Note, TripOptions are added separately
 *
 * Returns the new Trip if successful, and an error if unsuccessful
 *
 * Zod validation of body has already been done on both client and server
 */
export const addNewTripToDB = async (
	body: Trip_For_DB_POST,
	supabase: SupabaseClient
): Promise<NextResponse<Trip | { error: string }>> => {
	// No sql function because this is simple; jsut use supabase client
	const { data, error } = await supabase
		.from("trips")
		.insert([body])
		.select()
		.single();
	if (error) {
		throw new Error("Error adding trip to DB: " + error.message);
	}
	// TODO IMPORTANT: Add TripOptions to this or somewhere
	// Then validate the data with zod
	return NextResponse.json(data, { status: 200 });
};

/**
 * Fetches all trips for a given user and populates each trip with its associated TripOptions.
 * This function first fetches all trips, then for each trip, it fetches its options.
 *
 * @param userId The ID of the user whose trips are to be fetched.
 * @returns A Promise that resolves to an array of Trip objects, each populated with their TripOptions.
 *
 * Note on performance: This function makes N+1 database calls (1 for all trips, then N for
 * options for each of N trips). If performance becomes an issue for users with many trips,
 * consider implementing a batch fetch for all relevant TripOptions in a single query.
 *
 * TODO stretch: Validate this when I'm calling it from AuthWatcher; no way to validate until I'm able to do that.
 */
export async function getTripsWithPopulatedOptions(
	userId: string
): Promise<Trip_For_DB_PATCH[]> {
	const baseTrips: Trip_For_DB_PATCH[] = (await getTripsByUser(
		userId
	)) as unknown as Trip_For_DB_PATCH[];

	if (!baseTrips || baseTrips.length === 0) {
		return [];
	}

	const populatedTripsPromises = baseTrips.map(async (trip) => {
		// Asserting the presence of id and name due to potential TypeScript inference issues with complex types.
		// The Trip type definition does include id, and underlying data from getTripsByUser contains it.
		const tripId = trip.tripID;
		const tripName = trip.name;

		let tripOptions: TripOption[] = [];
		try {
			// Ensure tripId is valid before making a DB call
			if (typeof tripId === "number") {
				// @ts-expect-error TS expedts this to be a string but I'm not totally sure it'll never be a number
				tripOptions = await getTripOptionsByTripID(tripId.toString());
			} else {
				console.error(
					`Invalid or missing tripId for trip named '${tripName || "Unnamed Trip"}'. Cannot fetch options.`
				);
			}
		} catch (error) {
			console.error(
				`Failed to fetch trip options for trip '${tripName || "Unnamed Trip"}' (ID: ${tripId}):`,
				error instanceof Error ? error.message : String(error)
			);
			// Default to empty options on error for this specific trip to not fail the whole process
		}
		return {
			...trip, // Spread the original trip object
			tripOptions: tripOptions || [], // Ensure tripOptions is always an array
		};
	});

	const populatedTrips = await Promise.all(populatedTripsPromises);

	// The TODO for Zod validation in getTripsByUser still applies.
	// Ideally, the final populatedTrips array or each item would be validated against
	// a comprehensive Zod schema that includes populated tripOptions.
	// For now, this function focuses on the data aggregation.

	return populatedTrips;
}
