import { TripOption } from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/BaseTripOptionSchemas";
import { createClientSSROnly } from "../../supabase/server";

export async function getTripOptionsByTripID(
	tripID: string
): Promise<TripOption[]> {
	const tripOptionsDataQuery = getTripsByTripIDQuery(Number(tripID));
	const { data, error } = await tripOptionsDataQuery;

	if (error) {
		throw new Error("Error fetching trip options data: " + error.message);
	}

	// TODO IMPORTANT: Validate this in middleware
	return data as unknown as TripOption[];
}

export async function getSingleTripOptionById(
	tripOptionID: number
): Promise<TripOption[]> {
	const tripOptionDataQuery = getSingleTripOptionByIdQuery(tripOptionID);
	const { data, error } = await tripOptionDataQuery;

	if (error) {
		throw new Error("Error fetching trip option data: " + error.message);
	}

	// TODO IMPORTANT: Validate this in middleware
	return data as unknown as TripOption[];
}

export const getTripsByTripIDQuery = async (tripID: number) => {
	const supabase = await createClientSSROnly();
	return supabase.from("trip_options").select("*").eq("tripID", tripID);
};

export const getSingleTripOptionByIdQuery = async (tripOptionID: number) => {
	const supabase = await createClientSSROnly();
	return supabase.from("trip_options").select("*").eq("id", tripOptionID);
};
