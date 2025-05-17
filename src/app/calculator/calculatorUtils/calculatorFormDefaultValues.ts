tr; //___________________________________________
// This is the default values for the vehicle creation form
// One set is for the edit mode, the other is for the creation mode
// These sets will be quite similar, so will share a lot of logic.
// I'm producing these values from a function because things like userid will need to be passed in.
// ___________________________________________

import { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { DeepPartial } from "react-hook-form";
import { VehiclePATCHorPOST } from "../CalculatorFormComponents/VehicleCreationForm";
import { Vehicle_For_db_PATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";

/** This file provides default values for the vehicle edit form and the vehicle creation form.
 *
 * Since most of those default values will be the same between those two, I'm defining those shared default values in this constant.
 */
const baseDefaultVehicleValues: DeepPartial<DeepReadonly<VehiclePATCHorPOST>> =
	{
		vehicleData: {
			vehicleName: "",
			year: 0,
			make: "",
			model: "",
			trim: "",
			highwayMPG: 0,
		},
		gasVehicleData: {
			gasCostPerGallon: 0,
			milesPerGallonHighway: 0,
			milesPerGallonCity: 0,
		},
		electricVehicleData: {
			costPerCharge: 0,
			milesPerCharge: 0,
		},
		hybridVehicleData: {
			gasCostPerGallon: 0,
			milesPerGallonHighway: 0,
			milesPerGallonCity: 0,
			electricityCostPerKWh: 0,
			milesPerKWhHighway: 0,
			milesPerKWhCity: 0,
			percentElectricDriving: 0,
		},
		purchaseAndSales: {
			yearPurchased: 0,
			purchasePrice: 0,
			downPaymentAmount: 0,
			willSellCarAfterYears: 0,
			milesBoughtAt: 0,
			willSellCarAtMiles: 0,
			willSellCarAtPrice: 0,
		},
		usage: {
			averageDailyMiles: 0,
			weeksPerYear: 0,
			percentHighway: 0,
			extraDistanceMiles: 0,
			extraDistancePercentHighway: 0,
		},
		fixedCosts: {
			yearlyInsuranceCost: 0,
			yearlyRegistrationCost: 0,
			yearlyTaxes: 0,
			monthlyLoanPayment: 0,
			monthlyWarrantyCost: 0,
			inspectionCost: 0,
			otherYearlyCosts: 0,
		},
		yearlyMaintenanceCosts: {
			oilChanges: 0,
			tires: 0,
			batteries: 0,
			brakes: 0,
			other: 0,
		},
		variableCosts: {
			monthlyParkingCosts: 0,
			monthlyTolls: 0,
			monthlyCarWashCost: 0,
			monthlyMiscellaneousCosts: 0,
			monthlyCostDeductions: 0,
		},
	} as const;

export const defaultVehicleValuesPOST = (
	userId: string
): DeepPartial<DeepReadonly<Vehicle_For_db_POST>> => {
	return {
		userid: userId,
		type: undefined,
		vehiclesOrder: 1,
		...baseDefaultVehicleValues,
	};
};

/**Default values to pass in when editing a vehicle
 * This ensures that the form is populated with a vehicle's relevant IDs etc
 *
 * NOTE: Initially the form is just populated with the data of the vehicle to be edited. These default values are only used after the user hits the "clear form" button but doesn't back out of the form.
 */
export const defaultVehicleValuesPATCH = (
	userId: string,
	vehicleToEdit: Vehicle_For_db_PATCH
): DeepPartial<Readonly<Vehicle_For_db_PATCH>> => {
	return {
		userid: vehicleToEdit.userid,
		type: vehicleToEdit.type,
		vehiclesOrder: 1,
		id: vehicleToEdit.id,

		vehicleData: {
			vehicleID: vehicleToEdit.vehicleData?.vehicleID,
		},

		usage: {
			vehicleID: vehicleToEdit.usage?.vehicleID,
		},

		fixedCosts: {
			vehicleID: vehicleToEdit.fixedCosts?.vehicleID,
		},

		yearlyMaintenanceCosts: {
			vehicleID: vehicleToEdit.yearlyMaintenanceCosts?.vehicleID,
		},

		variableCosts: {
			vehicleID: vehicleToEdit.variableCosts?.vehicleID,
		},

		purchaseAndSales: {
			vehicleID: vehicleToEdit.purchaseAndSales?.vehicleID,
		},

		...(vehicleToEdit.type === "gas"
			? {
					gasVehicleData: {
						vehicleID: vehicleToEdit.gasVehicleData?.vehicleID,
					},
				}
			: 0),

		...(vehicleToEdit.type === "electric"
			? {
					electricVehicleData: {
						vehicleID: vehicleToEdit.electricVehicleData?.vehicleID,
					},
				}
			: 0),

		...(vehicleToEdit.type === "hybrid"
			? {
					hybridVehicleData: {
						vehicleID: vehicleToEdit.hybridVehicleData?.vehicleID,
					},
				}
			: 0),
	};
};
