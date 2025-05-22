"use server";

import { createClientSSROnly } from "../../supabase/server";

// _______________________________________________________________
// This is (obivously) utils for interacting with the DB w.r.t Trips
// Not sure yet if I'll put TripOptions stuff in here or another file; probably another file
// _______________________________________________________________

/**Returns a supabase sql-type statement to get all of a user's Trips
 * This doesn't get a Trip's TripOptions; another function (to be written) will get those and combine it with this Trip
 */
export const getTripsByUserIdQuery = async (userId: string) => {
	const supabase = await createClientSSROnly();
	return supabase.from("trips").select("*").eq("userID", userId);
};

/**Returns a supabase sql-type statement to get a single Trip by its id
 * Doesn't get a Trip's TripOptions; another function will get those and combine it with this where neeed
 */
export const getSingleTripByIdQuery = async (tripId: number) => {
	const supabase = await createClientSSROnly();
	return supabase.from("trips").select("*").eq("id", tripId);
};
