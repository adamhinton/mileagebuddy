import { SupabaseClient } from "@supabase/supabase-js";
import {
	getSingleTripByIdQuery,
	getTripsByUserIdQuery,
} from "./getTripsQueries";
import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";

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
	// Then validate the data with zod
	return data as unknown as Trip[];
}

/**Returns an array with a single Trip if that trip id exists, or an empty array if Trip id doesn't exist */
// TODO: User id validation - shouldn't be necessary bc of protected routes etc, but double check our security anyway
export async function getSingleTripById(
	supabase: SupabaseClient,
	tripId: number
): Promise<[Trip] | []> {
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
