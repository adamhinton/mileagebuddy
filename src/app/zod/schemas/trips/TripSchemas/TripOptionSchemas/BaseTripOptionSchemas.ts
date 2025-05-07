// _________________________________________________________________
// This is schemas for TripOptions (obviously)
// Each Trip object can have multiple TripOptions
//    - Each TripOption is a different way to take the trip
//    - Each TripOption has a different cost
//    - One trip option might be a flight, one might be a car, etc
//    - This app isn't actually concerned with the mode of travel, but rather the cost of each option
// _________________________________________________________________

// TOOD make sure trip id is tracked properly, not sure yet where/when to put it

import { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { z } from "zod";

/**
 * Base schema with common fields for all trip options
 * Not for direct use - extended by specific option types
 */
const _BaseTripOptionSchema = z.object({
	name: z.string().trim().min(1).max(100).describe("Option name"),
	notes: z.string().trim().max(500).nullish().describe("Notes"),

	// This is our discriminator field
	// We don't care what OTHER is - flight, train, whatever
	transportMode: z.enum(["OWN_VEHICLE", "OTHER"]),

	// Common cost fields
	parkingCosts: z.number().nonnegative().default(0).describe("Parking costs"),
	tollCosts: z.number().nonnegative().default(0).describe("Toll costs"),
	additionalCosts: z
		.number()
		.max(500_000)
		.nonnegative()
		.default(0)
		.describe("Other travel-related costs"),
});

/**
 * Schema for when user takes their own vehicle
 */
export const OwnVehicleTripOptionSchema = _BaseTripOptionSchema.extend({
	transportMode: z.literal("OWN_VEHICLE"),
	vehicleId: z.number().describe("ID of user's vehicle"),
	// No need for transportation cost fields - will be calculated from vehicle data and trip distance
});

/**
 * Schema for when user takes any other transportation mode
 */
export const OtherTripOptionSchema = _BaseTripOptionSchema.extend({
	transportMode: z.literal("OTHER"),
	// Display name of transportation type (flight, train, etc.) - just for user reference
	// Options like flight, train, bus, etc or "other". User can pick form these
	transportationType: z
		.enum(["Flight", "Train", "Bus", "Rental Car", "Other"])
		.describe("Type of transportation"),
	transportationCostToDestination: z
		.number()
		.nonnegative()
		.describe("Cost to reach destination"),
	transportationCostAtDestination: z
		.number()
		.nonnegative()
		.default(0)
		.describe("Local transportation costs"),
});

/**
 * Combined schema for all trip options
 */
export const TripOptionSchema = z.discriminatedUnion("transportMode", [
	OwnVehicleTripOptionSchema,
	OtherTripOptionSchema,
]);

/**
 * Options for how a user gets to destination
 *    - Own vehicle
 *    - Other (flight, train, etc.)
 */
export type TripOption = DeepReadonly<z.infer<typeof TripOptionSchema>>;
