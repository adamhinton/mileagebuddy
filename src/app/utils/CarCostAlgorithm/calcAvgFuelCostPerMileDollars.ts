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
 */
export const calcAvgFuelCostPerMileDollars = (vehicle: Vehicle) => {
	const averagePercentHighwayOutOf100 = vehicle.usage.percentHighway;
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
