import { SupabaseClient } from "@supabase/supabase-js";
import {
	getSingleTripByIdQuery,
	getTripsByUserIdQuery,
} from "./getTripsQueries";
import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { NextResponse } from "next/server";

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
