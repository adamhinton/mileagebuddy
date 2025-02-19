// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the Calculator that calculates the cost per mile of a vehicle based on daily use.
// Also calculates the cost of any additional miles driven.
// This will be used to create (or edit) an object of type Vehicle, whose cost will be calculated with the function from calculateCarCostMain.
// Form validation will be done by Zod. The exact mechanism for that is TBD, I'm not sure what people use to write complex forms in 2025.

// SPECS:
// There will be lots of inputs, figure out how to break that up
// Multiple pages? Like one for each sub-object of vehicle? (yearlyMaintenanceCosts, yearlyFixedCosts etc)
// Or collapsible sections?
// Definitely not just one long form
// Input error specs:
// Line-item errors on bad input, probably in red right above that inut
// Focus page on the first error if it pops up after submit
// Ideally show error before they hit submit

// Will start by writing the form for just one or two sections, thene expand from there

const CalculatorPage = () => {
	return (
		// 100% vh
		<section className="h-screen">
			<h1>Calculator Page</h1>
		</section>
	);
};

export default CalculatorPage;
