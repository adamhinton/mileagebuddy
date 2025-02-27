"use server";

import { SubmitHandler } from "react-hook-form";
import { Vehicle_For_db_POST } from "../utils/server/types/VehicleTypes/POSTVehicleTypes";

// TODO: Flesh out onSubmit. Shouldn't be hard, just pass it to POST function. Maybe we need to specify this lives on the server?
// Note: r-h-f does Zod validation automatically so we don't need to instate that manually
const mySubmitLogic: SubmitHandler<Vehicle_For_db_POST> = async (formData) => {
	// use server may not work here
	console.log("formData:", formData);
};

export default mySubmitLogic;
