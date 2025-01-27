"use server";

// README:
// This is the DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// Validation: We run Zod validation on both client and server

import { Vehicle, Vehicles } from "../../types/VehicleTypes/GetVehicleTypes";
import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
} from "../../types/VehicleTypes/POSTVehicleTypes";

// TODO: Validate Vehicles on frontend

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/** See api/vehicles/route.ts GET for the associated endpoint */
export const getVehiclesByUserIDClient = async (
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

/**Returns an array with one vehicle, or empty array if none found
 *
 *  * See api/vehicles/route.ts GET for the associated endpoint
 */
export const getSingleVehicleByIDClient = async (
	vehicleID: number,
	userID: number
): Promise<[Vehicle?]> => {
	try {
		const res = await fetch(
			`${baseUrl}/api/vehicles?userid=${userID}&vehicleid=${vehicleID}`,
			{
				method: "GET",
			}
		);
		const data: [Vehicle?] = await res.json();

		return data;
	} catch (error) {
		console.error("Error fetching single vehicle by ID:", error);
		throw error;
	}
};

/** See api/vehicles/route.ts POST for associated endpoint */
export const insertVehicleClient = async (
	// Don't need to know userid because Vehicle_For_db_POST has user ID
	vehicle: Vehicle_For_db_POST
): Promise<Vehicle> => {
	try {
		const res = await fetch(`${baseUrl}/api/vehicles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(vehicle),
		});
		const data: Vehicle = await res.json();

		return data;
	} catch (error) {
		console.error("Error inserting vehicle:", error);
		throw error;
	}
};

/** Returns deleted vehicle's data
 *
 * Also deletes all sub-objects (fixedCoss, yearlyMaintenanceCosts etc) which are tables in the db, due to ON DELETE CASCADE
 *
 * See api/vehicles/route.ts DELETE for associated endpoint
 */
export const deleteVehicleByIDClient = async (
	vehicleID: number
): Promise<Vehicle> => {
	try {
		const res = await fetch(`${baseUrl}/api/vehicles?vehicleid=${vehicleID}`, {
			method: "DELETE",
		});
		const data: Vehicle = await res.json();

		return data;
	} catch (error) {
		console.error("Error deleting vehicle by ID:", error);
		throw error;
	}
};
