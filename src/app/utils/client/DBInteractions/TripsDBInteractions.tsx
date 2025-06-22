"use client";

import { Trip } from "@/app/zod/schemas/trips/TripSchemas/BaseTripSchemas";
import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";

// _________________________________________
// This is the Trips DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the client; does not expose any sensitive information
// Validation: Tripss are validated here on the client, and also validated on the server before being sent to the db
// _________________________________________

/**
 * Get all Trips for a user by their userID
 *
 * Middleware verifies the userID is valid and the user is authenticated
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/route.ts GET for the associated endpoint
 * @param userID
 * @returns Promise<Trip[]>
 */
export const getTripsByUserIDClient = async (
	userID: string
): Promise<Trip[]> => {
	try {
		const res = await fetch(`/api/trips?userid=${userID}`, {
			method: "GET",
			headers: { accept: "application/json" },
		});
		const trips: Trip[] = await res.json();
		console.log("trips in getTripsByUserIDClient:", trips);

		// TODO Trips: reinstate this validation when we have TripOptions sorted out
		// Validating GET receipts to notify me in dev if something is wrong
		// trips.forEach((trip) => {
		// 	const isTrip = TripSchema.safeParse(trip);
		// 	// Only erroring in dev bc it's not the user's problem if the data is a little off.
		// 	if (!isTrip.success && process.env.NODE_ENV === "development") {
		// 		console.error(
		// 			"Trip from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
		// 			isTrip.error.errors
		// 		);
		// 		throw new Error("Trip failed validation");
		// 	}
		// });
		return trips;
	} catch (error) {
		console.error("Error fetching trips by user ID:", error);
		throw error;
	}
};

/**
 * Get a single Trip by its ID
 *
 * Middleware verifies this trip belongs to the authenticated user
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/route.ts GET for the associated endpoint
 * @param tripID
 * @returns An array with a single Trip if it exists, or an empty array if it doesn't
 */
export const getSingleTripByIdClient = async (
	tripId: number
): Promise<[Trip] | []> => {
	try {
		// const res = await fetch(`/api/trips?tripid=${tripId}`, {
		// 	method: "GET",
		// 	headers: { accept: "application/json" },
		// });
		// Refactor the above to use our test userid
		const res = await fetch(
			`/api/trips?userid=0488323f-5e5c-4bb2-b188-75bdaf6eb527&tripid=${tripId}`,
			{
				method: "GET",
				headers: { accept: "application/json" },
			}
		);
		const data = await res.json();
		console.log("data:", data);

		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		const trip = data[0];

		// TODO Trips: reinstate this validation when we have TripOptions sorted out
		// Validate the trip
		// const isTrip = TripSchema.safeParse(trip);
		// if (!isTrip.success && process.env.NODE_ENV === "development") {
		// 	console.error(
		// 		"Trip from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
		// 		isTrip.error.errors
		// 	);
		// 	throw new Error("Trip failed validation");
		// }

		return [trip];
	} catch (error) {
		console.error("Error fetching trip by ID:", error);
		throw error;
	}
};

/**
 * Attempts to add a new Trip to the DB
 *
 * This is the client-side function that calls the API endpoint
 *
 * Note, TripOptions are added separately
 *
 * Returns the new Trip if successful, and an error if unsuccessful
 *
 * See api/trips/route.ts POST for the associated endpoint
 */
export const insertTripToDBClient = async (
	trip: Trip_For_DB_POST
): Promise<Trip | { error: string }> => {
	try {
		const res = await fetch("/api/trips", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(trip),
		});

		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.error || "Failed to add trip" };
		}

		const newTrip: Trip = await res.json();

		// TODO Trips: reinstate this validation when we have TripOptions sorted out
		// Validate the new trip
		// This might be overkill because middleware and react-hook-form should already validate this, but things can change and validation is cheap so this is fine
		// Can refactor if we get a lot of traffic.
		// const isTrip = TripSchema.safeParse(newTrip);
		// if (!isTrip.success && process.env.NODE_ENV === "development") {
		// 	console.error(
		// 		"New trip from POST failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
		// 		isTrip.error.errors
		// 	);
		// 	throw new Error("New trip failed validation");
		// }

		return newTrip;
	} catch (error) {
		console.error("Error adding trip to DB:", error);
		return { error: "Failed to add trip" };
	}
};

/**
 * Attempts to delete a Trip from the DB
 *
 * This is the client-side function that calls the API endpoint
 *
 * Returns success status and an error message if unsuccessful
 *
 * See api/trips/route.ts DELETE for the associated endpoint
 */
export const deleteTripFromDBClient = async (
	tripId: number
): Promise<{ success: boolean; error?: string }> => {
	try {
		const res = await fetch(`/api/trips?tripid=${tripId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
		});

		if (!res.ok) {
			const errorData = await res.json();
			return {
				success: false,
				error: errorData.error || "Failed to delete trip",
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting trip from DB:", error);
		return { success: false, error: "Failed to delete trip" };
	}
};

/**
 * Attempts to update a Trip in the DB
 *
 * This is the client-side function that calls the API endpoint
 *
 * Returns the updated Trip if successful, and an error if unsuccessful
 *
 * See api/trips/route.ts PATCH for the associated endpoint
 */
export const updateTripInDBClient = async (
	trip: Trip_For_DB_PATCH
): Promise<Trip | { error: string }> => {
	try {
		const res = await fetch(`/api/trips?tripid=${trip.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(trip),
		});

		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.error || "Failed to update trip" };
		}

		const updatedTrip: Trip = await res.json();

		// TODO Trips: reinstate this validation when we have TripOptions sorted out
		// Validate the updated trip
		// const isTrip = TripSchema.safeParse(updatedTrip);
		// if (!isTrip.success && process.env.NODE_ENV === "development") {
		// 	console.error(
		// 		"Updated trip from PATCH failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
		// 		isTrip.error.errors
		// 	);
		// 	throw new Error("Updated trip failed validation");
		// }

		return updatedTrip;
	} catch (error) {
		console.error("Error updating trip in DB:", error);
		return { error: "Failed to update trip" };
	}
};
