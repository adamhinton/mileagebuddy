// _________________________________________________________________
// This is Trip schemas and TS types for DB PATCH requests
// _________________________________________________________________

import {
	LongDistanceTripSchema,
	ShortDistanceTripSchema,
	TripIDSchema,
	UserIdSchema,
} from "./BaseTripSchemas";

import { z } from "zod";

/**
 * This will be combined with long distance schema to make a single schema for PATCH requests
 */
const ShortDistanceTripSchemaForPATCH = ShortDistanceTripSchema.extend({
	userID: UserIdSchema,
	id: TripIDSchema,
});

/**
 * This will be combined with short distance schema to make a single schema for PATCH requests
 */
const LongDistanceTripSchemaForPATCH = LongDistanceTripSchema.extend({
	userID: UserIdSchema,
	id: TripIDSchema,
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

export type Trip_For_DB_PATCH = z.infer<typeof TripSchemaForPATCH>;
