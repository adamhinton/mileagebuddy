"use client";

// README:
// This is the DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the client; does not expose any sensitive information
// Validation: Vehicles are validated here on the client, and also validated on the server before being sent to the db

import {
	Vehicle,
	Vehicles,
	VehicleSchema,
} from "../../types/VehicleTypes/GetVehicleTypes";
import {
	Vehicle_For_db_PATCH,
	VehicleSchemaForPATCH,
} from "../../types/VehicleTypes/PATCHVehicleTypes";
import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
} from "../../types/VehicleTypes/POSTVehicleTypes";

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

		// Validating GET receipts to notify me in dev if something is wrong
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
		// Validating GET receipts to notify me in dev if something is wrong
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
	// Validate vehicle (obviously)
	// TODO: This POST vehicle validation may be redundant because the form hook in the UI will already do this
	const isVehicle = VehicleToBePostedSchema.safeParse(vehicle);
	if (!isVehicle.success) {
		console.error(
			"Vehicle for POST failed validation. ",
			isVehicle.error.errors
		);
		throw new Error("Vehicle failed validation");
	}

	try {
		const res = await fetch(`${baseUrl}/api/vehicles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(vehicle),
		});
		const newVehicle: Vehicle = await res.json();

		// validate new vehicle received from db
		const isNewVehicle = VehicleSchema.safeParse(newVehicle);

		if (!isNewVehicle.success) {
			console.error(
				"New vehicle from POST failed validation.",
				isNewVehicle.error.errors
			);
			throw new Error("Vehicle failed validation");
		}

		return newVehicle;
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
		const deletedVehicle: Vehicle = await res.json();

		return deletedVehicle;
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
	// Validate vehicle (obviously)
	// TODO: This PATCH client vehicle validation may be redundant because the form hook in the UI will already do this
	const isVehicle = VehicleSchemaForPATCH.safeParse(vehicle);
	if (!isVehicle.success) {
		console.error(
			"Vehicle for PATCH failed validation. ",
			isVehicle.error.errors
		);
		throw new Error("Vehicle failed validation");
	}

	try {
		const res = await fetch(`${baseUrl}/api/vehicles?vehicleid=${vehicle.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(vehicle),
		});
		const fullNewVehicle: Vehicle = await res.json();

		// validate new vehicle received from db
		const isNewVehicle = VehicleSchema.safeParse(fullNewVehicle);
		if (!isNewVehicle.success) {
			console.error(
				"New vehicle from PATCH failed validation.",
				isNewVehicle.error.errors
			);
			throw new Error("Vehicle failed validation");
		}

		return fullNewVehicle;
	} catch (error) {
		console.error("Error updating vehicle:", error);
		throw error;
	}
};
