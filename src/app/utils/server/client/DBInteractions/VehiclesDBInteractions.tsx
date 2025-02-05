"use client";

// README:
// This is the DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the server so as not to expose our endpoints to the client
// TODO: Implement validation on client before sending to server
// I pass in the site's url (AKA process.env.VERCEL_URL) because I had trouble getting this URL on the server; TODO: Figure out how to get site URL on the server

import { Vehicle, Vehicles } from "../../types/VehicleTypes/GetVehicleTypes";
import { Vehicle_For_db_PATCH } from "../../types/VehicleTypes/PATCHVehicleTypes";
import { Vehicle_For_db_POST } from "../../types/VehicleTypes/POSTVehicleTypes";

// TODO: Validate Vehicles on frontend

const baseUrl = new URL(
	process.env.NEXT_PUBLIC_VERCEL_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
		: "http://localhost:3000"
).href;
console.log("baseUrl:", baseUrl);

const API_BASE_URL = process.env.API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);

/** See api/vehicles/route.ts GET for the associated endpoint */
export const getVehiclesByUserIDClient = async (
	userID: string
	// baseUrl: string
): Promise<Vehicles> => {
	try {
		console.log("blah blah blah");
		const res = await fetch(`${baseUrl}api/vehicles?userid=${userID}`, {
			method: "GET",
			headers: { accept: "application/json" },
		});
		console.log("res:", res);
		const data: Vehicles = await res.json();
		console.log("data:", data);

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
	// baseUrl: string
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
	// baseUrl: string
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
	// baseUrl: string
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
	// baseUrl: string
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
