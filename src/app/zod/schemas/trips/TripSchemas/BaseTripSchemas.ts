// _________________________________________________________________
// This is schemas for the Trip features
// Users input data about a trip they want to take, and it helps them understand the cost of various transportation options
//    - Based on whether they take their own vehicle, public transit, flight etc
// Schemas and types for POST and PATCH are defined elsewhere in this directory

// NOTE: We are only concerned with items that do the following:
//    - Help the user understand their trip
//    - Help the app calculate the cost of a particular trip option
// So we don't care about things like hotel or food costs, etc.

// Trips are divided into two types:
//    - Short distance trips
//    - Long distance trips

// Each trip can have multiple TripOptions
//    - Each TripOption is a different way to take the trip

// DB operations: There are separate schemas for POST and PATCH requests
// _________________________________________________________________

import { z } from "zod";
import { TripOptionSchema } from "./TripOptionSchemas/BaseTripOptionSchemas";
import { DeepReadonly } from "next/dist/shared/lib/deep-readonly";

/**
 * Don't use this Schema
 * It's the grandaddy schema that we infer (and extend) trip types for DB post, patch, get etc, as well as for form validation
 */
export const _BaseTripSchema = z.object({
	// Basic details, common to all trips
	// This stuff isn't used for calculations - only for helping the user understand their trip
	// So we're liberal in what inputs we accept here
	name: z
		.string()
		.trim()
		.min(1, "Trip name is required")
		.max(100)
		.trim()
		.describe("Trip Name"),
	destination: z
		.string()
		.trim()
		.min(1, "Destination is required")
		.max(100)
		.trim()
		.describe("Destination"),
	origin: z
		.string()
		.trim()
		.max(100)
		.trim()
		.nullish()
		.default("Home")
		.describe("Origin (Default: Home)"),
	notes: z.string().trim().max(500).nullish().describe("Notes"),

	// Fields relevant for calculation (stricter validation where applicable)
	// User defines this, influences available/relevant options/UI
	tripType: z
		// Form asks user more TripOptions questions for long distance than short distance
		.enum(["SHORT_DISTANCE", "LONG_DISTANCE"])
		.describe("Trip Type"),
	// Estimated round-trip driving distance (if driving is an option)
	roundTripDrivingDistanceMiles: z
		.number()
		.max(50000, "Must be less than 10,000 miles")
		.positive("Must be positive")
		.nullish()
		.describe("Round Trip Driving Distance (miles)"),

	tripOptions: z
		.array(TripOptionSchema)
		.describe("Trip options")
		.max(50, "Max 50 trip options"),
});

/**
 * This is the schema for short distance trips
 * It's combined with the long distance schema to make a single schema
 *
 * Has slightly fewer fields than long distance
 */
export const ShortDistanceTripSchema = _BaseTripSchema.extend({
	tripType: z.literal("SHORT_DISTANCE"),
});

/**
 * This is the schema for long distance trips
 * It's combined with the short distance schema to make a single schema
 *
 * Has slightly more fields than short distance
 */
export const LongDistanceTripSchema = _BaseTripSchema.extend({
	tripType: z.literal("LONG_DISTANCE"),
	departureDate: z.coerce.date().nullish().describe("Departure Date"),
	returnDate: z.coerce.date().nullish().describe("Return Date"),
	// Estimated round-trip driving distance (if driving is an option)
	localDrivingDistanceMiles: z
		.number()
		.max(50000, "Must be less than 50,000 miles")
		.positive("Must be positive")
		.int()
		.nullish()
		.describe("Local Driving Distance at destination (miles)"),
});

/**Trip a user takes */
export const TripSchema = z.discriminatedUnion("tripType", [
	ShortDistanceTripSchema,
	LongDistanceTripSchema,
]);

/**
 * Trip a user takes
 */
export type Trip = DeepReadonly<z.infer<typeof TripSchema>>;

// Have to use this in several places so keeping this DRY
export const UserIdSchema = z.string().uuid();

/**
 * Defining an ID schema for consistency because this will be used in several places
 */
export const TripIDSchema = z.string().uuid();
