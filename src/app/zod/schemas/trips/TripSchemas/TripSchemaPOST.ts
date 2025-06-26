// _________________________________________________________________
// This is Trip schemas and TS types for DB POST requests
// _________________________________________________________________

import { z } from "zod";

import { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import {
	LongDistanceTripSchema,
	ShortDistanceTripSchema,
	UserIdSchema,
} from "./BaseTripSchemas";

/**
 * This is combined with long distance schema to make a single schema for POST requests
 */
const ShortDistanceTripSchemaForPOST = ShortDistanceTripSchema.extend({
	// Need userid for creation
	userID: UserIdSchema,
});

/**
 * This is combined with short distance schema to make a single schema for POST requests
 */
const LongDistanceTripSchemaForPOST = LongDistanceTripSchema.extend({
	// Need userid for creation
	userID: UserIdSchema,
});

/**Schema for validating Trip to be POSTed to DB
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
