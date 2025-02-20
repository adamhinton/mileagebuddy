"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the Calculator that calculates the cost per mile of a vehicle based on daily use.
// Also calculates the cost of any additional miles driven.
// This will be used to create (or edit) an object of type Vehicle, whose cost will be calculated with the function from calculateCarCostMain.
// Form validation will be done by Zod.

import { z } from "zod";
import {
	GasVehicleSchemaForPOST,
	ElectricVehicleSchemaForPOST,
} from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import { PurchaseAndSalesSchema } from "../zod/schemas/VehicleSubSchemas";
import mySubmitLogic from "./formActions";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "http";

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
	// // gasVehicleData: true,
	// vehicleData: true,
});

type SmallGasVehicleForTesting = z.infer<
	typeof smallGasVehicleSchemaForTesting
>;

const smallElectricVehicleSchemaForTesting = ElectricVehicleSchemaForPOST.pick({
	vehiclesOrder: true,
	// type: true,
	// // electricVehicleData: true,
	// vehicleData: true,
});

type SmallElectricVehicleForTesting = z.infer<
	typeof smallElectricVehicleSchemaForTesting
>;

const VehicleForTestingSchema = z.union([
	smallGasVehicleSchemaForTesting,
	smallElectricVehicleSchemaForTesting,
]);

export type VehicleForTesting = z.infer<typeof VehicleForTestingSchema>;

const CalculatorPage = () => {
	return (
		// 100% vh
		<section className="h-screen">
			<h1>Calculator Page</h1>

			<CalculateMileageForm />
		</section>
	);
};

export default CalculatorPage;

/**
 * Number input for small values (<5 digits)
 *
 * @param schema This is an item from the Vehicle schema that the function uses to determine factors like min and max value. For instance BaseVehicleSchema.shape.vehiclesOrder
 */
const MileageCalcFormNumInput = ({
	label,
	register,
	error,
	// The current value of the input in formValues
	// Useful when you want to edit a Vehicle so this value will already be pre-set
	formValue,
	subSchema,
}: {
	label: string;
	register: UseFormRegister<VehicleForTesting>;
	error: string | undefined;
	formValue: number;
	subSchema: z.ZodNumber;
}) => {
	const maxValue = subSchema.maxValue || undefined;

	// if isRequiredToBePositive, min is 0. otherwise it's schema.minValue. Otherwise it's undefined
	/**boolean */
	const isRequiredToBePositive = subSchema.nonnegative();
	const minValue = isRequiredToBePositive ? 0 : subSchema.minValue || undefined;

	const isRequired = subSchema.isOptional();

	console.log("error in number input component:", error);

	return (
		<div>
			<label htmlFor="vehiclesOrder">Vehicles Order</label>
			<input
				className="mileage-calc-form-number-input"
				type="number"
				{...register("vehiclesOrder", { valueAsNumber: true })}
				value={formValue}
				max={maxValue}
				min={minValue}
				required={isRequired}
			/>
			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}{" "}
		</div>
	);
};

const CalculateMileageForm = () => {
	const form = useForm<VehicleForTesting>({
		// This is how it knows to validate with zod
		resolver: zodResolver(VehicleForTestingSchema),
		// Can put default values here if needed: defaultValues: {...}
	});

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
			<MileageCalcFormNumInput
				label="Vehicles Order"
				register={register}
				error={errors.vehiclesOrder?.message || undefined}
				formValue={formValues.vehiclesOrder}
				subSchema={GasVehicleSchemaForPOST.shape.vehiclesOrder}
			/>
			<button className="submit" disabled={isSubmitting}>
				{isSubmitting ? "Loading" : "Submit"}
			</button>
		</form>
	);
};
