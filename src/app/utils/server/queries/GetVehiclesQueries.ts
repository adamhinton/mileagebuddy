"use server";

import { createClientSSROnly } from "../supabaseUtilsCustom/server";
import { stringForJoiningVehicleTables } from "./vehiclesDBUtils";

// README
// This file contains the strings for the db queries for GET api/vehicles

export const getVehiclesByUserIdQuery = async (userId: string) => {
	console.log("blah blah blah");
	const supabase = await createClientSSROnly();
	const vehicleInfoQuery = await supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("userid", Number(userId));

	return vehicleInfoQuery;
};

export const getSingleVehicleByIdQuery = async (vehicleId: number) => {
	const supabase = await createClientSSROnly();
	const vehicleInfoQuery = supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("id", vehicleId);

	return vehicleInfoQuery;
};
