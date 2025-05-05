// _________________________________________________________________
// This is schemas for the Trip features
// Users input data about a trip they want to take, and it helps them understand the cost of various transportation options
//    - Based on whether they take their own vehicle, public transit, flight etc
// _________________________________________________________________

import { z } from "zod";
import { TripOptionSchema } from "./TripOptionSchemas";

/**
 * Don't use this Schema
 * It's the grandaddy schema that we infer (and extend) trip types for DB post, patch, get etc, as well as for form validation
 */
export const BaseTripSchema = z.object({
	tripOptions: z.array(TripOptionSchema).describe("Trip options"),
});
