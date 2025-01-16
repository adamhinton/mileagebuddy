// NOTE: To get the type of sub-objects within Vehicles, do this:
// const fixedCosts: Vehicle["fixedCosts"] = ...

import { QueryData } from "@supabase/supabase-js";
import { getVehiclesByUserIdQuery } from "../queries/GetVehiclesQueries";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type Vehicles = QueryData<typeof exampleGetVehiclesByUserQuery>;

// type of single Vehicle
export type Vehicle = Vehicles[number];
