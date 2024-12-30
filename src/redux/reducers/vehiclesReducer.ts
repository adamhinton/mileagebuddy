// README:
// This is the meat and potatoes of the whole project
// User enters data about their vehicle, then we calculate how their cost per mile

// Vehicle factors:
// vehicleName
// year
// make
// model
// Gas cost per gallon
// Miles per gallon
// yearly maintenance cost (oil changes, tires, etc), approximated
// yearly insurance cost
// yearly registration cost
// yearly taxes
// yearly depreciation - this is tough to estimate. When do you expect to sell the car, and for how much?
// Monthly payments
// Monthly parking costs
// Monthly tolls
// Monthly car washes

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
