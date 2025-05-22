import { SupabaseClient } from "@supabase/supabase-js";
import { getTripsByUserIdQuery } from "./getTripsQueries";
import {
	Trip,
	TripSchema,
} from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";

export async function getTripsByUser(
	supabase: SupabaseClient,
	userId: string
): Promise<Trip[]> {
	const tripsDataQuery = getTripsByUserIdQuery(String(userId));
	const { data, error } = await tripsDataQuery;

	if (error) {
		throw new Error("Error fetching trips data: " + error.message);
	}

	// TODO IMPORTANT: Add TripOptions to this or somewhere
	return data as unknown as Trip[];
}

/**
 * Check that Trips data returned from the DB is valid
 * This should never be an issue since it's validated before getting  to DB in the first place.
 *
 * @param data trips data returned from the DB
 *
 * @returns true if the data is valid, false otherwise
 */
// const validateTrips = (data: unknown): data is Trip[] => {
// 	const isValidTrip = TripSchema.safeParse(data);

// 	return isValidTrip.error ? false : true;
// };
