"use client";

// _____________________________________________
// This is the TripOptions DB interactions meant to be called from the client
// You call this from your CLIENT components and it hits the API endpoints for you
// This code runs on the client; does not expose any sensitive information
// Validation: TripOptions are validated here on the client, and also validated on the server before being sent to the db
// TODO test all these functions
// _____________________________________________

import {
	TripOption,
	TripOptionSchema,
} from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/BaseTripOptionSchemas";

/**
 * Get all TripOptions for a Trip by its tripID
 *
 * Middleware verifies this trip belongs to the authenticated user
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/tripOptions/route.ts GET for the associated endpoint
 *
 * @param tripID
 * @returns An array of TripOptions for the Trip if they exist, or an empty array if they don't
 */
export const getTripOptionsByTripIDClient = async (
	tripID: string
): Promise<TripOption[]> => {
	try {
		const res = await fetch(`/api/trips/tripoptions?tripid=${tripID}`, {
			method: "GET",
			headers: { accept: "application/json" },
		});
		const tripOptions = (await res.json()) as unknown as TripOption[];

		tripOptions.forEach((tripOption) => {
			const isTripOption = TripOptionSchema.safeParse(tripOption);
			if (!isTripOption.success && process.env.NODE_ENV === "development") {
				console.error(
					"TripOption from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
					isTripOption.error.errors
				);
				throw new Error("TripOption failed validation");
			}
		});

		return tripOptions;
	} catch (error) {
		console.error("Error fetching trip options by trip ID:", error);
		throw error;
	}
};

/**
 * Get a single TripOption by its ID
 *
 * Middleware verifies this trip option belongs to the authenticated user
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/tripOptions/route.ts GET for the associated endpoint
 *
 * @param tripOptionID
 * @returns An array with a single TripOption if it exists, or an empty array if it doesn't
 */
export const getSingleTripOptionByIdClient = async (
	tripOptionID: number
): Promise<[TripOption?]> => {
	try {
		const res = await fetch(
			`/api/trips/tripoptions?tripoptionid=${tripOptionID}`,
			{
				method: "GET",
				headers: { accept: "application/json" },
			}
		);
		const tripOption = (await res.json()) as unknown as TripOption[];

		if (tripOption.length === 0) {
			return [];
		}

		const isTripOption = TripOptionSchema.safeParse(tripOption[0]);
		if (!isTripOption.success && process.env.NODE_ENV === "development") {
			console.error(
				"TripOption from GET failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
				isTripOption.error.errors
			);
			throw new Error("TripOption failed validation");
		}

		return tripOption as unknown as [TripOption?];
	} catch (error) {
		console.error("Error fetching single trip option by ID:", error);
		throw error;
	}
};

/**
 * Delete a TripOption by its ID
 *
 * Middleware verifies this trip option belongs to the authenticated user
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/tripOptions/route.ts DELETE for the associated endpoint
 *
 * @param tripOptionID
 * @returns the tripOptionID if deletion was successful, or an error object if it failed
 */
export const deleteTripOptionByIdClient = async (
	tripOptionID: number
): Promise<number | { error: string }> => {
	try {
		const res = await fetch(
			`/api/trips/tripoptions?tripoptionid=${tripOptionID}`,
			{
				method: "DELETE",
				headers: { accept: "application/json" },
			}
		);
		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.error || "Failed to delete trip option" };
		}
		return tripOptionID;
	} catch (error) {
		console.error("Error deleting trip option by ID:", error);
		return { error: "Failed to delete trip option" };
	}
};

/**
 * Create a new TripOption for a Trip
 *
 * Middleware verifies this trip belongs to the authenticated user
 *
 * This is the client-side function that calls the API endpoint
 *
 * See api/trips/tripOptions/route.ts POST for the associated endpoint
 *
 * @param tripID
 * @param tripOptionData
 * @returns The created TripOption if successful, or an error object if it failed
 */
export const insertTripOptionToDBClient = async (
	tripID: string,
	tripOptionData: TripOption
): Promise<TripOption | { error: string }> => {
	try {
		const res = await fetch(`/api/trips/tripoptions?tripid=${tripID}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(tripOptionData),
		});

		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.error || "Failed to create trip option" };
		}

		const createdTripOption = (await res.json()) as unknown as TripOption;

		const isTripOption = TripOptionSchema.safeParse(createdTripOption);
		if (!isTripOption.success && process.env.NODE_ENV === "development") {
			console.error(
				"Created TripOption from POST failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
				isTripOption.error.errors
			);
			throw new Error("Created TripOption failed validation");
		}

		return createdTripOption;
	} catch (error) {
		console.error("Error creating trip option:", error);
		return { error: "Failed to create trip option" };
	}
};

export const updateTripOptionInDBClient = async (
	tripOption: TripOption
): Promise<TripOption | { error: string }> => {
	try {
		const res = await fetch(`/api/trips/tripoptions`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(tripOption),
		});

		if (!res.ok) {
			const errorData = await res.json();
			return { error: errorData.error || "Failed to update trip option" };
		}

		const updatedTripOption = (await res.json()) as unknown as TripOption;

		const isTripOption = TripOptionSchema.safeParse(updatedTripOption);
		if (!isTripOption.success && process.env.NODE_ENV === "development") {
			console.error(
				"Updated TripOption from PATCH failed validation. Probably there's a mismatch between the db and the Zod schema. \n Did you change the db without changing the Zod schema, or vice-versa?",
				isTripOption.error.errors
			);
			throw new Error("Updated TripOption failed validation");
		}

		return updatedTripOption;
	} catch (error) {
		console.error("Error updating trip option:", error);
		return { error: "Failed to update trip option" };
	}
};
