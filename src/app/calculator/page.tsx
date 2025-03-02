"use client";

// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the form where user creates a Vehicle object, which will be used to calculate the cost of driving that vehicle.
// The form is broken down into sections, each of which corresponds to a sub-object of the Vehicle object.
// Also calculates the cost of any additional miles driven.
// Form validation will be done by Zod.
// Form displays input errors next to each input (if there is an error), as well as a summary of the first three sections with errors at the top of the form.

import { useState, useMemo } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
	Gas_Vehicle_For_DB_POST,
	Electric_Vehicle_For_DB_POST,
} from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import mySubmitLogic from "./formActions";
import VehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/VehicleDataSubForm";
import PurchaseAndSalesSubForm from "./CalculatorFormComponents/FormSubSections/PurchaseAndSalesSubForm";
import UsageSubForm from "./CalculatorFormComponents/FormSubSections/UsageSubForm";
import FixedCostsSubForm from "./CalculatorFormComponents/FormSubSections/FixedCostsSubForm";
import YearlyMaintenanceCostsSubForm from "./CalculatorFormComponents/FormSubSections/YearlyMaintenanceCostsSubForm";
import VariableCostsSubForm from "./CalculatorFormComponents/FormSubSections/VariableCostsSubForm";
import GasVehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/GasVehicleDataSubForm";
import ElectricVehicleDataSubForm from "./CalculatorFormComponents/FormSubSections/ElectricVehicleDataSubForm";
import FormErrorSummary from "./CalculatorFormComponents/FormErrorSummary";
import {
	CollapsibleSectionTitles,
	useFormNavigation,
} from "./calculatorUtils/FormNavUtils";

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validation. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

/**Better way of toggling collapsed state than true or false */
export type CollapsedOrNot = "isCollapsed" | "isNotCollapsed";

const CalculatorPage = () => {
	return (
		<section className="h-screen p-4 sm:p-6 md:p-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl">Calculator Page</h1>
			<CalculateMileageForm />
		</section>
	);
};

const CalculateMileageForm = () => {
	// User can collapse or uncollapse form sections
	// Hitting "next" in a section also scrolls to the next section and uncollapses it
	// This state (obviously) tracks which sections are collapsed or not)
	const [collapsedSections, setCollapsedSections] = useState<
		Record<CollapsibleSectionTitles, CollapsedOrNot>
	>({
		gasVehicleData: "isNotCollapsed",
		vehicleData: "isCollapsed",
		electricVehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	});

	/**Shows bullet-pointed errors at top of form after user hits submit */
	const [isShowErrorSummary, setisShowErrorSummary] = useState(false);

	// Form setup
	const form = useForm<Vehicle_For_db_POST>({
		// This is how you tell rhf to use zod for validation
		resolver: zodResolver(VehicleToBePostedSchema),
	});

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors, isSubmitting },
	} = form;

	const formValues = getValues();

	/**Changes the displayed form section when user indicates that they have a gas or EV
	 *
	 * Can't just use formValues.type for this because the component won't re-render when that changes
	 */
	const watchedVehicleType = watch("type");

	/**The order form sections are listed in, for form navigation purposes */
	const formSectionOrder = useMemo(() => {
		const formSectionOrder: Readonly<CollapsibleSectionTitles[]> = [
			watchedVehicleType === "gas" ? "gasVehicleData" : "electricVehicleData",
			"vehicleData",
			"purchaseAndSales",
			"usage",
			"fixedCosts",
			"yearlyMaintenanceCosts",
			"variableCosts",
		] as const;

		return formSectionOrder;
	}, [watchedVehicleType]);

	// Get form navigation utils from custom hook
	const { goToNextSection, toggleSectionCollapse } = useFormNavigation(
		formSectionOrder,
		setCollapsedSections
	);

	console.log("formValues inside form before submit:", formValues);
	console.log("errors inside form before submit:", errors);

	// new vehicles should always come first in user's list
	setValue("vehiclesOrder", 1);

	return (
		<form onSubmit={handleSubmit(mySubmitLogic)}>
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
					onNext={() => goToNextSection("gasVehicleData")}
					isLastSection={false}
					sectionIndex={formSectionOrder.indexOf("gasVehicleData")}
					totalSections={formSectionOrder.length}
				/>
			) : watchedVehicleType === "electric" ? (
				<ElectricVehicleDataSubForm
					register={register}
					errors={
						errors as unknown as FieldErrors<Electric_Vehicle_For_DB_POST>
					}
					isCollapsed={collapsedSections.electricVehicleData}
					onToggleCollapse={() => toggleSectionCollapse("electricVehicleData")}
					onNext={() => goToNextSection("electricVehicleData")}
					isLastSection={false}
					sectionIndex={formSectionOrder.indexOf("electricVehicleData")}
					totalSections={formSectionOrder.length}
				/>
			) : null}

			{/* User has to specify vehicle type (gas or electric) before seeing the rest of the form */}
			{watchedVehicleType && (
				<>
					<VehicleDataSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.vehicleData}
						onToggleCollapse={() => toggleSectionCollapse("vehicleData")}
						onNext={() => goToNextSection("vehicleData")}
						isLastSection={false}
						sectionIndex={formSectionOrder.indexOf("vehicleData")}
						totalSections={formSectionOrder.length}
					/>
					<PurchaseAndSalesSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.purchaseAndSales}
						onToggleCollapse={() => toggleSectionCollapse("purchaseAndSales")}
						onNext={() => goToNextSection("purchaseAndSales")}
						isLastSection={false}
						sectionIndex={formSectionOrder.indexOf("purchaseAndSales")}
						totalSections={formSectionOrder.length}
					/>
					<UsageSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.usage}
						onToggleCollapse={() => toggleSectionCollapse("usage")}
						onNext={() => goToNextSection("usage")}
						isLastSection={false}
						sectionIndex={formSectionOrder.indexOf("usage")}
						totalSections={formSectionOrder.length}
					/>
					<FixedCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.fixedCosts}
						onToggleCollapse={() => toggleSectionCollapse("fixedCosts")}
						onNext={() => goToNextSection("fixedCosts")}
						isLastSection={false}
						sectionIndex={formSectionOrder.indexOf("fixedCosts")}
						totalSections={formSectionOrder.length}
					/>
					<YearlyMaintenanceCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.yearlyMaintenanceCosts}
						onToggleCollapse={() =>
							toggleSectionCollapse("yearlyMaintenanceCosts")
						}
						onNext={() => goToNextSection("yearlyMaintenanceCosts")}
						isLastSection={false}
						sectionIndex={formSectionOrder.indexOf("yearlyMaintenanceCosts")}
						totalSections={formSectionOrder.length}
					/>
					<VariableCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.variableCosts}
						onToggleCollapse={() => toggleSectionCollapse("variableCosts")}
						onNext={() => goToNextSection("variableCosts")}
						isLastSection={true}
						sectionIndex={formSectionOrder.indexOf("variableCosts")}
						totalSections={formSectionOrder.length}
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

export default CalculatorPage;
