"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the Calculator that calculates the cost per mile of a vehicle based on daily use.
// Also calculates the cost of any additional miles driven.
// This will be used to create (or edit) an object of type Vehicle, whose cost will be calculated with the function from calculateCarCostMain.
// Form validation will be done by Zod.

import { set, z } from "zod";
import {
	GasVehicleSchemaForPOST,
	ElectricVehicleSchemaForPOST,
} from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import mySubmitLogic from "./formActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MileageCalcFormNumInput from "./CalculatorFormComponents/MileageCalcFormNumberInput";
import { useState } from "react";
import FormSection from "./CalculatorFormComponents/FormSection";

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

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validaton. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

// INCREMENTAL CODING:
// Start with a very basic form
// Make a VehiclToBePostedSchema extension that just has one sub-object, maybe yearlyFixedCosts
// Get that up and running, then gradually add more
// Early on we want to make sure we can account for the difference between gas vehicles and EVs. There are already schemas for this - GasVehicleSchemaForPOST, ElectricVehicleSchemaForPOST -- but we need to make sure we have the form logic worked out for that.
// User will select "electric" or "gas" at the start of the form. The only difference between the two is whether there's a section for the sub-object gasVehicleData or ElectricVehicleData, shouldn't be too hard

// COMPONENTS:
// We'll make reusable tailwind components because a lot of these are going to be same-y
// Reusable number component
// I don't believe anything will ever be more than six digits long
// Reusable short form text input
// I don't believe there will ever be any long text inputs

// STRETCH:
// Real time calculations? Maybe broken down by section.

// Will start by writing the form for just one or two sections, thene expand from there

const smallGasVehicleSchemaForTesting = GasVehicleSchemaForPOST.pick({
	vehiclesOrder: true,
	// type: true,
	gasVehicleData: true,
	// vehicleData: true,
});

type SmallGasVehicleForTesting = z.infer<
	typeof smallGasVehicleSchemaForTesting
>;

// const smallElectricVehicleSchemaForTesting = ElectricVehicleSchemaForPOST.pick({
// 	vehiclesOrder: true,
// 	// type: true,
// 	electricVehicleData: true,
// 	// vehicleData: true,
// });

// type SmallElectricVehicleForTesting = z.infer<
// 	typeof smallElectricVehicleSchemaForTesting
// >;

const VehicleForTestingSchema = z.union([
	smallGasVehicleSchemaForTesting,
	smallGasVehicleSchemaForTesting,
]);

export type VehicleForTesting = z.infer<typeof VehicleForTestingSchema>;

const CalculatorPage = () => {
	return (
		<section className="h-screen p-4 sm:p-6 md:p-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl">Calculator Page</h1>

			<CalculateMileageForm />
		</section>
	);
};

export default CalculatorPage;

const CalculateMileageForm = () => {
	const [activeSection, setActiveSection] = useState(0);
	// Checkmark that user de-selects if they don't want to be auto-advanced to next section
	const [autoAdvance, setAutoAdvance] = useState(true);

	const form = useForm<VehicleForTesting>({
		// This is how it knows to validate with zod
		resolver: zodResolver(VehicleForTestingSchema),
		// Can put default values here if needed: defaultValues: {...}
	});

	// Dummy sections for testing, TODO update this with real vehicle sub-objects
	const sections = [
		{
			title: "Vehicle Type",
			fields: ["type"], // Radio for gas/electric
		},
		{
			title: "Basic Vehicle Information",
			fields: ["vehicleName", "year", "make", "model"],
		},
		{
			title: "Purchase & Sales Information",
			fields: ["purchasePrice", "yearPurchased", "downPaymentAmount"],
		},
		// ... more sections
	];

	const handleSectionComplete = (sectionIndex: number) => {
		if (autoAdvance && sectionIndex < sections.length - 1) {
			setActiveSection(sectionIndex + 1);
		}
	};

	const {
		register,
		/**
		 * built in RHF function that automatically performs zod validation,
		 * then passes the form data to whatever you pass as a callback in <form onSubmit={mySubmitFunction(callback)}>
		 */
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = form;
	const formValues = getValues();
	console.log("formValues inside form before submit:", formValues);
	console.log("errors inside form before submit:", errors);

	return (
		<form onSubmit={handleSubmit(mySubmitLogic)}>
			<div className="mb-4 flex items-center">
				<input
					type="checkbox"
					id="autoAdvance"
					checked={autoAdvance}
					onChange={(e) => setAutoAdvance(e.target.checked)}
					className="mr-2"
				/>
				<label htmlFor="autoAdvance">
					Automatically advance to next section
				</label>
			</div>

			{/* <MileageCalcFormNumInput
				id="vehiclesOrder"
				label="Vehicles Order"
				register={register}
				error={errors.vehiclesOrder?.message || undefined} 	
				formValue={formValues.vehiclesOrder}
				subSchema={GasVehicleSchemaForPOST.shape.vehiclesOrder}
				setValue={setValue}
			/> */}

			<FormSection
				title={"Gas Vehicle Data"}
				isActive={true}
				isCompleted={false}
				onComplete={() => {}}
			>
				<MileageCalcFormNumInput
					id="gasCostPerGallon"
					label="Gas Cost Per Gallon $"
					registerFn={register}
					path="gasVehicleData.gasCostPerGallon"
					error={errors.gasVehicleData?.gasCostPerGallon?.message || undefined}
					setValue={setValue}
					subSchema={
						GasVehicleSchemaForPOST.shape.gasVehicleData.shape.gasCostPerGallon
					}
				/>
			</FormSection>
			<button className="submit" disabled={isSubmitting}>
				{isSubmitting ? "Loading" : "Submit"}
			</button>
		</form>
	);
};
