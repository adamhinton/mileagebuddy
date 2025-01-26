"use server";

// README:
// This is the DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you

import { Vehicles } from "../../types/VehicleTypes/GetVehicleTypes";

// TODO: Validate Vehicles on frontend

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getVehiclesByUserID = async (
	userID: string
): Promise<Vehicles> => {
	try {
		console.log("blah blah blah");
		const res = await fetch(`${baseUrl}/api/vehicles?userid=${userID}`, {
			method: "GET",
		});
		const data: Vehicles = await res.json();

		return data;
	} catch (error) {
		console.error("Error fetching vehicles by user ID:", error);
		throw error;
	}
};
