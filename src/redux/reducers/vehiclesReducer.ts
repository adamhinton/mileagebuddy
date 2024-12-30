// README:
// This is the meat and potatoes of the whole project
// User enters data about their vehicle, then we calculate how their cost per mile

// All fields are required because they'll be 0 if they don't apply
export type Vehicle = {
	vehicleName: string;
	year: number;
	make: string;
	model: string;
	gasCostPerGallon: number;
	milesPerGallon: number;
	yearlyMaintenanceCost: number;
	yearlyInsuranceCost: number;
	yearlyRegistrationCost: number;
	yearlyTaxes: number;
	yearlyDepreciation: number;
	monthlyPayments: number;
	monthlyParkingCosts: number;
	monthlyTolls: number;
	monthlyCarWashes: number;
};
