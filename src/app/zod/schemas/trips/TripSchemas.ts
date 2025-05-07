// _________________________________________________________________
// This is schemas for the Trip features
// Users input data about a trip they want to take, and it helps them understand the cost of various transportation options
//    - Based on whether they take their own vehicle, public transit, flight etc
// _________________________________________________________________

import { z } from "zod";
import { TripOptionSchema } from "./TripOptionSchemas";
import { DeepReadonly } from "next/dist/shared/lib/deep-readonly";

/**
 * Don't use this Schema
 * It's the grandaddy schema that we infer (and extend) trip types for DB post, patch, get etc, as well as for form validation
 */
export const BaseTripSchema = z.object({
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
	notes: z.string().max(500).nullish().describe("Notes"),

	// Fields relevant for calculation (stricter validation where applicable)
	// User defines this, influences available/relevant options/UI
	tripType: z
		// Form asks user more TripOptions questions for long distance than short distance
		.enum(["SHORT_DISTANCE", "LONG_DISTANCE"])
		.describe("Trip Type (Short/Long)"),
	// Estimated round-trip driving distance (if driving is an option)
	roundTripDrivingDistanceMiles: z
		.number()
		.positive("Must be positive")
		.nullish()
		.describe("Round Trip Driving Distance (miles)"),

	tripOptions: z.array(TripOptionSchema).describe("Trip options"),
});

/**
 * This is the schema for short distance trips
 * It's combined with the long distance schema to make a single schema
 */
export const ShortDistanceTripSchema = BaseTripSchema.extend({
	tripType: z.literal("SHORT_DISTANCE"),
});

/**
 * This is the schema for long distance trips
 * It's combined with the short distance schema to make a single schema
 */
export const LongDistanceTripSchema = BaseTripSchema.extend({
	tripType: z.literal("LONG_DISTANCE"),
	departureDate: z.coerce.date().nullish().describe("Departure Date"),
	returnDate: z.coerce.date().nullish().describe("Return Date"),
	// Estimated round-trip driving distance (if driving is an option)
	localDrivingDistanceMiles: z
		.number()
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
const UserIdSchema = z.string().uuid().describe("User ID");

/**
 * This is combined with long distance schema to make a single schema for POST requests
 */
const ShortDistanceTripSchemaForPOST = ShortDistanceTripSchema.extend({
	// Need userid for creation
	userid: UserIdSchema,
});

/**
 * This is combined with short distance schema to make a single schema for POST requests
 */
const LongDistanceTripSchemaForPOST = LongDistanceTripSchema.extend({
	// Need userid for creation
	userid: UserIdSchema,
});

/**
 * Defining an ID schema for consistency because this will be used in several places
 */
const TripIDSchema = z.string().uuid().describe("Trip ID");

/**Schema for validating TRIP to be posted to DB
 *
 * Had to define schemas and combine them here because zod doesn't just let you add userid to the base schema,
 * because the base schema is already a discriminated union
 *
 * Which is incredibly stupid, but whatever
 */
export const TripSchemaForPOST = z.discriminatedUnion("tripType", [
	ShortDistanceTripSchemaForPOST,
	LongDistanceTripSchemaForPOST,
]);
export type Trip_For_DB_POST = DeepReadonly<z.infer<typeof TripSchemaForPOST>>;

/**
 * This will be combined with long distance schema to make a single schema for PATCH requests
 */
const ShortDistanceTripSchemaForPATCH = ShortDistanceTripSchema.extend({
	userid: UserIdSchema,
	tripID: TripIDSchema,
});

/**
 * This will be combined with short distance schema to make a single schema for PATCH requests
 */
const LongDistanceTripSchemaForPATCH = LongDistanceTripSchema.extend({
	userid: UserIdSchema,
	tripID: TripIDSchema,
});

/**
 * Schema for validating TRIP to be patched in DB
 *
 * All fields are included - must pass in entire Trip object - but only the ones that are actually changed will be updated
 *
 * We don't need to pass in a partial because Trips don't have that many details and the user won't have that many Trips,
 *
 * so hyper-optimization isn't necessary
 */
export const TripSchemaForPATCH = z.discriminatedUnion("tripType", [
	ShortDistanceTripSchemaForPATCH,
	LongDistanceTripSchemaForPATCH,
]);
