"use client";

import { UpdateVehicleOrderRequestSchema } from "@/app/api/vehicles/order/utils/typesAndSchemas";
// README:
// This is the Vehicle DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the client; does not expose any sensitive information
// Validation: Vehicles are validated here on the client, and also validated on the server before being sent to the db

import {
	type Vehicle,
	type Vehicles,
	VehicleSchema,
} from "../../types/VehicleTypes/GetVehicleTypes";
import {
	type Vehicle_For_db_PATCH,
	VehicleSchemaForPATCH,
} from "../../types/VehicleTypes/PATCHVehicleTypes";
import {
	type Vehicle_For_db_POST,
	VehicleToBePostedSchema,
} from "../../types/VehicleTypes/POSTVehicleTypes";

/** See api/vehicles/route.ts GET for the associated endpoint */
export const getVehiclesByUserIDClient = async (
	userID: string
): Promise<Vehicles> => {
	try {
		const res = await fetch(`/api/vehicles?userid=${userID}`, {
			method: "GET",
			headers: { accept: "application/json" },
		});
		const vehicles: Vehicles = await res.json();

		console.log("vehicles:", vehicles);

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
			`/api/vehicles?userid=${userID}&vehicleid=${vehicleID}`,
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

/** See api/vehicles/route.ts POST for associated endpoint
 *
 * Validates vehicle before sending to DB, and validates vehicle received from DB
 */
export const insertVehicleClient = async (
	// Don't need to know userid because Vehicle_For_db_POST has user ID
	vehicle: Vehicle_For_db_POST
): Promise<Vehicle> => {
	// Validate vehicle (obviously)
	// This POST vehicle validation may be redundant because the form hook in the UI will already do this
	// But, the validation is cheap and form logic could change
	const isVehicle = VehicleToBePostedSchema.safeParse(vehicle);

	console.log("isVehicle:", isVehicle);

	if (!isVehicle.success) {
		console.error(
			"Vehicle for POST failed validation. ",
			isVehicle.error.errors
		);
		throw new Error("Vehicle failed validation xyz");
	}

	try {
		const res = await fetch(`/api/vehicles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(vehicle),
		});
		const newVehicle: Vehicle = await res.json();

		console.log("newVehicle:", newVehicle);

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
): Promise<
	| Vehicle
	| {
			error: string;
	  }
> => {
	try {
		const res = await fetch(`/api/vehicles?vehicleid=${vehicleID}`, {
			method: "DELETE",
		});
		const deletedVehicle: Vehicle = await res.json();

		return deletedVehicle;
	} catch (error) {
		console.error("Error deleting vehicle by ID:", error);
		return {
			error: "Error deleting vehicle by ID",
		};
		throw error;
	}
};

/**
 * Takes in partial Vehicle with only the objects that need changed
 *
 * Returns full updated Vehicle
 *
 * See api/vehicles/route.ts PATCH for associated endpoint
 *
 * Validates vehicle before sending to DB, and validates vehicle received from DB
 */
export const updateVehicleInDBClient = async (
	vehicle: Vehicle_For_db_PATCH
): Promise<Vehicle> => {
	// Validate vehicle (obviously)
	// This PATCH client vehicle validation may be redundant because the form hook in the UI will already do this
	// But, the validation is cheap and form logic could change
	const isVehicle = VehicleSchemaForPATCH.safeParse(vehicle);
	if (!isVehicle.success) {
		console.error(
			"Vehicle for PATCH failed validation. ",
			isVehicle.error.errors
		);
		throw new Error("Vehicle failed validation");
	}

	try {
		const res = await fetch(`/api/vehicles?vehicleid=${vehicle.id}`, {
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

/** Updates the order of vehicles after drag-and-drop reordering. This should be called from client components.
 *
 * This is currently the only place where api/vehicles/order endpoint is needed\
 */
export const updateVehicleOrdersClient = async (
	userid: string,
	orderUpdates: Array<{ id: number; order: number }>
): Promise<{ success: boolean } | { error: string }> => {
	const requestBody = {
		userid,
		orderUpdates,
	};

	const isSafe = UpdateVehicleOrderRequestSchema.safeParse(requestBody);

	// This same validation also runs on the server in api/vehicles/order
	// But this is a good sanity check to make sure the client isn't sending garbage
	if (!isSafe.success) {
		console.error(
			"Invalid request body. Make sure you're sending the right format to api/vehicles/order:",
			isSafe.error
		);
		return { error: "Invalid request body." };
	}

	try {
		const res = await fetch("/api/vehicles/order", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userid, orderUpdates }),
		});

		return await res.json();
	} catch (error) {
		console.error("Error updating vehicle orders:", error);
		return { error: "Failed to update vehicle orders" };
	}
};
