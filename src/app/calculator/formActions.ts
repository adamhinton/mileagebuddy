"use server";

import { SubmitHandler } from "react-hook-form";
import { VehicleForTesting } from "./page";

// TODO: Flesh out onSubmit. Shouldn't be hard, just pass it to POST function. Maybe we need to specify this lives on the server?
// Note: r-h-f does Zod validation automatically so we don't need to instate that manually
const mySubmitLogic: SubmitHandler<VehicleForTesting> = async (formData) => {
	// use server may not work here
	console.log("formData:", formData);
};

export default mySubmitLogic;
