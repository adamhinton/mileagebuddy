"use server";

// README
// This helper function calculates the average fuel cost per mile for a vehicle
// This is informed by Vehicle.usage, aka the Usage type/schema
// Takes in to account the average percent of city and highway driving
// Returns the cost per mile in dollars, rounded to three decimal places
// This is one of the factors added up to calculate the true cost per mile of driving a vehicle.
// See calculateCarCostMain.ts to see how this is used in the overall calculation

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/**
 * Works with either GasVehicle or ElectricVehicle
 *
 * This is for the miles that the driver normally does daily, not any extra added miles
 *
 * Note: This obviously calculates in dollars, not cents, rounded to three decimal places.
 *
 * So for instance it'll return 0.109, aka 10.9 cents per mile
 *
 * Only async because server actions must be async
 *
 */
export const calcAvgFuelCostPerMileDollars = async (vehicle: Vehicle) => {
	const averagePercentHighwayOutOf100 = vehicle.usage.percentHighway;

	// Zod should prevent this, but just in case
	if (
		averagePercentHighwayOutOf100 < 0 ||
		averagePercentHighwayOutOf100 > 100
	) {
		throw new Error(
			"Percent highway is less than 0 or greater than 100. How did you even do that?"
		);
	}

	const averagePercentCityOutOf100 = 100 - averagePercentHighwayOutOf100;

	// Vehicle type is GasVehicle
	if (vehicle.type === "gas") {
		const { milesPerGallonCity, milesPerGallonHighway, gasCostPerGallon } =
			vehicle.gasVehicleData;

		const averageMilesPerGallon =
			(milesPerGallonCity * averagePercentCityOutOf100 +
				milesPerGallonHighway * averagePercentHighwayOutOf100) /
			100;

		const averagefuelCostPerMile =
			(1 / averageMilesPerGallon) * gasCostPerGallon;

		// return it rounded to three decimal places
		return Math.round(averagefuelCostPerMile * 1000) / 1000;
	}

	// Vehicle type is ElectricVehicle
	else if (vehicle.type === "electric") {
		const { electricVehicleData } = vehicle;

		const { costPerCharge, milesPerCharge } = electricVehicleData;

		const averagefuelCostPerMile = costPerCharge / milesPerCharge;

		// return it rounded to three decimal places
		return Math.round(averagefuelCostPerMile * 1000) / 1000;
	} else {
		// This should never ever happen, vehicle will always have either type "gas" or type "electric"
		// TS should really be smart enough not to make me do this, actually
		throw new Error(
			"Vehicle type is neither gas nor electric. How did you even do that?"
		);
	}
};
