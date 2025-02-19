// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the Calculator that calculates the cost per mile of a vehicle based on daily use.
// Also calculates the cost of any additional miles driven.
// This will be used to create (or edit) an object of type Vehicle, whose cost will be calculated with the function from calculateCarCostMain.
// Form validation will be done by Zod.

// Styling:
// Efficient, accessible, clean, responsive. Use color schemes we already have. Update globals.css with new form styling if needed.

// SPECS:
// Frontend: react-hook-form (I think?) with zod validation. Then submit to server action; once that comes back happy, update redux state.
// Stretch: optimistic UI updates
// Backend: server actions, also with zod validation. Then submit created (or patched) vehicle to /api/vehicles
// Zod validation on both client and server
// There will be lots of inputs, figure out how to break that up
// Multiple pages? Like one for each sub-object of vehicle? (yearlyMaintenanceCosts, yearlyFixedCosts etc)
// Or collapsible sections?
// Definitely not just one long form
// Input error specs:
// Line-item errors on bad input, probably in red right above that inut
// Focus page on the first error if it pops up after submit
// Ideally show error before they hit submit
// Display error summary at top of form too; ideally clickable ones that take user to relevant section

// Specifics of form inputs:
// Radio button near the start for gas vs electric
// Work out how to update form state for gas vs electric
// Make sure units are very clear (dollars, gallons etc)

// TYPES
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validaton. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form

// INCREMENTAL CODING:
// Start with a very basic form
// Make a VehiclToBePostedSchema extension that just has one sub-object, maybe yearlyFixedCosts
// Get that up and running, then gradually add more
// Early on we want to make sure we can account for the difference between gas vehicles and EVs. There are already schemas for this - GasVehicleSchemaForPOST, ElectricVehicleSchemaForPOST -- but we need to make sure we have the form logic worked out for that.
// User will select "electric" or "gas" at the start of the form. The only difference between the two is whether there's a section for the sub-object gasVehicleData or ElectricVehicleData, shouldn't be too hard

// STRETCH:
// Real time calculations? Maybe broken down by section.

// Will start by writing the form for just one or two sections, thene expand from there

const smallGasVehicleSchemaForTesting = GasVehicleSchemaForPOST.pick({
	vehiclesOrder: true,
	type: true,
	// gasVehicleData: true,
	vehicleData: true,
});

type SmallGasVehicleForTesting = z.infer<
	typeof smallGasVehicleSchemaForTesting
>;

const smallElectricVehicleSchemaForTesting = ElectricVehicleSchemaForPOST.pick({
	vehiclesOrder: true,
	type: true,
	// electricVehicleData: true,
	vehicleData: true,
});

type SmallElectricVehicleForTesting = z.infer<
	typeof smallElectricVehicleSchemaForTesting
>;

const CalculatorPage = () => {
	return (
		// 100% vh
		<section className="h-screen">
			<h1>Calculator Page</h1>
		</section>
	);
};

export default CalculatorPage;
