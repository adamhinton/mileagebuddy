"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

// README
// This is the main file for the algorithm that calculates the true cost of owning a car
// The primary function is exported from here
// It takes in an object of type Vehicle and performs various calculations to estimate the true cost per mile driven
// This is currently (1.28.25) a WIP and will develop as the project evolves.

// PLAN:
// "use server" at the top of each file
// Make CarCostResults type. With zod schema?
// TEST EXTENSIVELY
// Write sub-functions for each part of the calculation
// TEST EXTENSIVELY
// Write tests for each sub-function
// TEST EXTENSIVELY
// Did I mention TEST EXTENSIVELY?
// Really, I'll regret it if I don't have thorough unit tests.
// TEST EXTENSIVELY

export const calculateCarCostMain = (vehicle: Vehicle) => {
	vehicle.id;
};
