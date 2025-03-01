"use client";

// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the form where user creates a Vehicle object, which will be used to calculate the cost of driving that vehicle.
// The form is broken down into sections, each of which corresponds to a sub-object of the Vehicle object.
// Also calculates the cost of any additional miles driven.
// Form validation will be done by Zod.
// Form displays input errors next to each input (if there is an error), as well as a summary of the first three sections with errors at the top of the form.

import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
	Gas_Vehicle_For_DB_POST,
	Electric_Vehicle_For_DB_POST,
} from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import { useCallback } from "react";
import mySubmitLogic from "./formActions";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import VehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/VehicleDataSubForm";
import PurchaseAndSalesSubForm from "./CalculatorFormComponents/FormSubSections/PurchaseAndSalesSubForm";
import UsageSubForm from "./CalculatorFormComponents/FormSubSections/UsageSubForm";
import FixedCostsSubForm from "./CalculatorFormComponents/FormSubSections/FixedCostsSubForm";
import YearlyMaintenanceCostsSubForm from "./CalculatorFormComponents/FormSubSections/YearlyMaintenanceCostsSubForm";
import VariableCostsSubForm from "./CalculatorFormComponents/FormSubSections/VariableCostsSubForm";
import GasVehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/GasVehicleDataSubForm";
import ElectricVehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/ElectricVehicleDataSubForm";
import FormErrorSummary from "./CalculatorFormComponents/FormErrorSummary";

// TODO:
// Next buttons? Tie to (un)collapsing
// // Maybe delete auto-advance checkbox if so
// Edit functionality
// Animations or something
// Persist form data on page refresh
// Default values:
// // Figure out where to save these
// // Make input default values actually save to form values; right now user has to tab over input
// More tests
// Make this file a bit smaller, abstractify some stuff

// SPECS:
// Stretch: optimistic UI updates
// Specifics of form inputs:

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validaton. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

// STRETCH:
// Real time calculations? Maybe broken down by section.

const CalculatorPage = () => {
	return (
		<section className="h-screen p-4 sm:p-6 md:p-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl">Calculator Page</h1>

			<CalculateMileageForm />
		</section>
	);
};

/**Better way of toggling collapsed state than true or false */
export type CollapsedOrNot = "isCollapsed" | "isNotCollapsed";

export default CalculatorPage;

const CalculateMileageForm = () => {
	const [collapsedSections, setCollapsedSections] = useState<
		Record<
			// This type is dumb, TODO fix it with an omit instead. It's because it doesn't recognize keys unique to gas or EVs if I just use keyof Vehicle_For_db_POST
			keyof Gas_Vehicle_For_DB_POST | keyof Electric_Vehicle_For_DB_POST,
			CollapsedOrNot
		>
		// @ts-expect-error I omitted irrelevant keys; TODO make better type for this and the other stuff in this file that uses the keyof thingy above
	>({
		// Set initial collapsed state for each section (true = collapsed)
		gasVehicleData: "isNotCollapsed",
		vehicleData: "isCollapsed",
		electricVehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	});

	console.log("collapsedSections:", collapsedSections);

	/**Toggle collapsed state of a section */
	const toggleSectionCollapse = useCallback(
		(
			sectionId:
				| keyof Gas_Vehicle_For_DB_POST
				| keyof Electric_Vehicle_For_DB_POST
		) => {
			setCollapsedSections((prev) => ({
				...prev,
				[sectionId]: !prev[sectionId],
			}));
		},
		[]
	);

	// Checkmark that user de-selects if they don't want to be auto-advanced to next section
	const [autoAdvance, setAutoAdvance] = useState(true);

	// Show the error summary at the top of the form
	const [isShowErrorSummary, setisShowErrorSummary] = useState(false);

	const form = useForm<Vehicle_For_db_POST>({
		// This is how it knows to validate with zod
		resolver: zodResolver(VehicleToBePostedSchema),
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
		watch,
		formState: { errors, isSubmitting },
	} = form;

	const formValues = getValues();
	console.log("formValues inside form before submit:", formValues);
	console.log("errors inside form before submit:", errors);

	// Comes first by default
	setValue("vehiclesOrder", 1);

	// Using this instead of formValues.type because this way the form re-renders when watchedVehicleType changes
	const watchedVehicleType = watch("type");

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

			{isShowErrorSummary && <FormErrorSummary errors={errors} />}

			<div className="ml-4">
				<label className="mr-4">
					<input
						type="radio"
						value="gas"
						{...register("type", { required: true })}
						className="mr-1"
					/>
					Gas
				</label>
				<label>
					<input
						type="radio"
						value="electric"
						{...register("type", { required: true })}
						className="mr-1"
					/>
					Electric
				</label>
			</div>

			{/* If vehicle is gas, display gas vehicle questions. If electric, display EV questions */}
			{watchedVehicleType === "gas" ? (
				<GasVehicleDataSubForm
					register={register}
					errors={errors as unknown as FieldErrors<Gas_Vehicle_For_DB_POST>}
					isCollapsed={collapsedSections.gasVehicleData}
					onToggleCollapse={() => toggleSectionCollapse("gasVehicleData")}
				/>
			) : watchedVehicleType === "electric" ? (
				<ElectricVehicleDataSubForm
					register={register}
					errors={
						errors as unknown as FieldErrors<Electric_Vehicle_For_DB_POST>
					}
					isCollapsed={collapsedSections.electricVehicleData}
					onToggleCollapse={() => toggleSectionCollapse("electricVehicleData")}
				/>
			) : null}

			{/* User has to specify vehicle type (gas or electric) before seeing the rest of the form
			 Each of these sub-forms is a sub-object of Vehicle_For_db_POST
			*/}
			{watchedVehicleType && (
				<>
					<VehicleDataSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.vehicleData}
						onToggleCollapse={() => toggleSectionCollapse("vehicleData")}
					/>
					<PurchaseAndSalesSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.purchaseAndSales}
						onToggleCollapse={() => toggleSectionCollapse("purchaseAndSales")}
					/>
					<UsageSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.usage}
						onToggleCollapse={() => toggleSectionCollapse("usage")}
					/>
					<FixedCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.fixedCosts}
						onToggleCollapse={() => toggleSectionCollapse("fixedCosts")}
					/>
					<YearlyMaintenanceCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.yearlyMaintenanceCosts}
						onToggleCollapse={() =>
							toggleSectionCollapse("yearlyMaintenanceCosts")
						}
					/>
					<VariableCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.variableCosts}
						onToggleCollapse={() => toggleSectionCollapse("variableCosts")}
					/>

					<button
						className="submit"
						disabled={isSubmitting}
						onClick={() => {
							setisShowErrorSummary(errors ? true : false);
						}}
					>
						{isSubmitting ? "Loading" : "Submit"}
					</button>
				</>
			)}
		</form>
	);
};
