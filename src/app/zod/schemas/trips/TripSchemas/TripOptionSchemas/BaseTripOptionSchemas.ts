// _________________________________________________________________
// This is schemas for TripOptions (obviously)
// Each Trip object can have multiple TripOptions
//    - Each TripOption is a different way to take the trip
//    - Each TripOption has a different cost
//    - One trip option mightnbe a flight, one might be a car, etc
//    - This app isn't actually concerned with the mode of travel, but rather the cost of each option
// _________________________________________________________________

import { z } from "zod";

export const TripOptionSchema = z.object({});
