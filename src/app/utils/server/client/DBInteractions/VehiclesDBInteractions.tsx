"use client";

// README:
// This is the DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the client; does not expose any sensitive information
// TODO: Implement validation on client before sending to server

import {
	Vehicle,
	Vehicles,
	VehicleSchema,
} from "../../types/VehicleTypes/GetVehicleTypes";
import { Vehicle_For_db_PATCH } from "../../types/VehicleTypes/PATCHVehicleTypes";
import { Vehicle_For_db_POST } from "../../types/VehicleTypes/POSTVehicleTypes";

// TODO: Validate Vehicles on frontend

const baseUrl = new URL(
	process.env.NEXT_PUBLIC_VERCEL_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
		: "http://localhost:3000"
).href;

/** See api/vehicles/route.ts GET for the associated endpoint */
export const getVehiclesByUserIDClient = async (
	userID: string
): Promise<Vehicles> => {
	try {
		const res = await fetch(`${baseUrl}api/vehicles?userid=${userID}`, {
			method: "GET",
			headers: { accept: "application/json" },
		});
		const vehicles: Vehicles = await res.json();

		vehicles.forEach((vehicle) => {
			const isVehicle = VehicleSchema.safeParse(vehicle);
			// Only erroring in dev bc it's not the user's problem if the data is a little off.
			if (!isVehicle.success && process.env.NODE_ENV === "development") {
				console.error(
					"Vehicle from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
					isVehicle.error.errors
				);
				throw new Error("Vehicle failed validation");
			}
		});

		return vehicles;
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
		const arrayWithOneOr0Vehicle: [Vehicle?] = await res.json();

		// If there's a vehicle, validate it
		if (arrayWithOneOr0Vehicle[0]) {
			const isVehicle = VehicleSchema.safeParse(arrayWithOneOr0Vehicle[0]);
			// Only erroring in dev bc it's not the user's problem if the data is a little off.
			if (!isVehicle.success && process.env.NODE_ENV === "development") {
				console.error(
					"Vehicle from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
					isVehicle.error.errors
				);
				throw new Error("Vehicle failed validation");
			}
		}

		return arrayWithOneOr0Vehicle;
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

/**
 * Takes in partial Vehicle with only the objects that need changed
 *
 * Returns full updated Vehicle
 *
 * See api/vehicles/route.ts PATCH for associated endpoint
 */
export const updateVehicleInDBClient = async (
	vehicle: Vehicle_For_db_PATCH
): Promise<Vehicle> => {
	try {
		const res = await fetch(`${baseUrl}/api/vehicles?vehicleid=${vehicle.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(vehicle),
		});
		const data: Vehicle = await res.json();

		return data;
	} catch (error) {
		console.error("Error updating vehicle:", error);
		throw error;
	}
};
