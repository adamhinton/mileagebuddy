// __________________________________________________________________________
// This is schemas for TripOption DB POST operations
// __________________________________________________________________________

import { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { TripOptionSchema } from "./BaseTripOptionSchemas";
import { z } from "zod";

/**
 * Schema for POST operations - no ID needed
 *
 * Not sure yet if Trip id is needed
 */
export const TripOptionSchemaForPOST = TripOptionSchema;
export type TripOption_For_DB_POST = DeepReadonly<
	z.infer<typeof TripOptionSchemaForPOST>
>;
