import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/**
 * Works with either GasVehicle or ElectricVehicle
 *
 * This is for the miles that the driver normally does daily, not any extra added miles
 *
 */
export const calcAvgFuelCostPerMile = (vehicle: Vehicle) => {
	const averagePercentHighway = vehicle.usage.percentHighway;
	const averagePercentCity = 1 - averagePercentHighway;

	// Vehicle type is GasVehicle
	if (vehicle.type === "gas") {
		const { milesPerGallonCity, milesPerGallonHighway, gasCostPerGallon } =
			vehicle.gasVehicleData;

		const averageMilesPerGallon =
			milesPerGallonCity * averagePercentCity +
			milesPerGallonHighway * averagePercentHighway;

		const averagefuelCostPerMile =
			(1 / averageMilesPerGallon) * gasCostPerGallon;

		/**This is for the average/normal daily miles they drive */
		return averagefuelCostPerMile;
	}

	// Vehicle type is ElectricVehicle
	if (vehicle.type === "electric") {
		const { electricVehicleData } = vehicle;

		const { costPerCharge, milesPerCharge } = electricVehicleData;

		const averagefuelCostPerMile = costPerCharge / milesPerCharge;

		return averagefuelCostPerMile;
	}
};
