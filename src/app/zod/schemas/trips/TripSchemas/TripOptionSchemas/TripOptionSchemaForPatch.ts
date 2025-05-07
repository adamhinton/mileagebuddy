// __________________________________________________________________________
// Schemas and types for PATCH DB operations

// Due to zod limitations we have to separate the schema, extend it, then combine it again
// __________________________________________________________________________

import { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import {
	OtherTripOptionSchema,
	OwnVehicleTripOptionSchema,
} from "./BaseTripOptionSchemas";
import { z } from "zod";
import { TripIDSchema } from "../BaseTripSchemas";

const TripOptionIDSchema = z.string().uuid();

/**
 * We have to combine this with "other" option schema to make a single schema for PATCH requests
 */
const OwnVehicleTripOptionSchemaForPATCH = OwnVehicleTripOptionSchema.extend({
	id: TripOptionIDSchema,
	tripId: TripIDSchema,
});

/**
 * We have to combine this with own vehicle schema to make a single schema for PATCH requests
 */
const OtherTripOptionSchemaForPATCH = OtherTripOptionSchema.extend({
	id: TripOptionIDSchema,
	tripId: TripIDSchema,
});

/**
 * Schema for PATCH operations - includes ID
 */
export const TripOptionSchemaForPATCH = z.discriminatedUnion("transportMode", [
	OwnVehicleTripOptionSchemaForPATCH,
	OtherTripOptionSchemaForPATCH,
]);

export type TripOption_For_DB_PATCH = DeepReadonly<
	z.infer<typeof TripOptionSchemaForPATCH>
>;
