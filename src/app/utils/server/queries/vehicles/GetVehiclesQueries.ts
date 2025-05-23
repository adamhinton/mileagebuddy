"use server";

import { createClientSSROnly } from "../../supabase/server";
import { stringForJoiningVehicleTables } from "./vehiclesDBUtils";

// README
// This file contains the strings for the db queries for GET api/vehicles

export const getVehiclesByUserIdQuery = async (userId: string) => {
	const supabase = await createClientSSROnly();
	return supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("userid", userId);
};

export const getSingleVehicleByIdQuery = async (vehicleId: number) => {
	const supabase = await createClientSSROnly();
	return supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("id", vehicleId);
};
