"use client";

// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the form where user creates a Vehicle object, which will be used to calculate the cost of driving that vehicle.
// The form is broken down into sections, each of which corresponds to a sub-object of the Vehicle object.
// Also calculates the cost of any additional miles driven.
// Form validation will be done by Zod.
// Errors: Form displays input errors next to each input (if there is an error), as well as a summary of the first three sections with errors at the top of the form.
// Persistence: If user navigates away or exits the page before finishing the form, the form state is saved to localStorage and restored when user returns.
// User can also clear the form with a button.
// EDIT MODE: This form can be used to either edit a vehicle or create a new one, depending on the props passed in. There is minimal UI difference between these mods.

import { useState, useMemo, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Vehicle_For_db_POST,
	VehicleToBePostedSchema,
} from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import FormErrorSummary from "./CalculatorFormComponents/FormErrorSummary";
import {
	CollapsibleSectionTitles,
	useFormNavigation,
} from "./calculatorUtils/FormNavUtils";
import FormSubSections from "./CalculatorFormComponents/AllFormSubSections";
import getSavedFormValuesFromLocalStorage from "./calculatorUtils/getSavedFormValuesFromLocalStorage";
import FormButton from "./CalculatorFormComponents/FormButton";
import {
	Vehicle_For_db_PATCH,
	VehicleSchemaForPATCH,
} from "../utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { z } from "zod";

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validation. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

// TODO:
// Edit functionality
// Default values:
// // Figure out where to save these
// // Make input default values actually save to form values; right now user has to tab over input
// General styling improvements. Animations, transitions etc
// Make this file a bit smaller, abstractify some stuff (already done, can do more)
// Make CollapsibleSectionTitles type a tuple of literals so as to be the one source of truth for the order

// Stretch: optimistic UI updates

/** Prevent typos by making sure localStorage persisted data is always accessed the same way */
export const LOCAL_STORAGE_FORM_DATA_KEY = "mileageFormData";

/**Better way of toggling collapsed state than true or false */
export type CollapsedOrNot = "isCollapsed" | "isNotCollapsed";

const CalculatorPage = () => {
	return (
		<section className="h-screen p-4 sm:p-6 md:p-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl">Calculator Page</h1>
			<CalculateMileageForm
				mode="editVehicle"
				vehicle={{} as unknown as Vehicle_For_db_PATCH}
				schema={VehicleSchemaForPATCH}
			/>
		</section>
	);
};

/**
 * If edit mode, Vehicle_For_db_PATCH. If new vehicle mode, Vehicle_For_db_POST
 *
 * This will be used in the various sub-components of the form
 */
export type VehiclePATCHorPOST = Vehicle_For_db_POST | Vehicle_For_db_PATCH;

// Base props
// This allows invalid states, don't use it. See extended prop types just below
type FormPropsBase = {
	mode: "editVehicle" | "newVehicle";
	// The vehicle to be edited, if in edit mode
	vehicle?: Vehicle_For_db_PATCH;
	schema: typeof VehicleToBePostedSchema | typeof VehicleSchemaForPATCH;
};

// Edit existing vehicle mode
type FormPropsEditMode = FormPropsBase & {
	mode: "editVehicle";
	// Vehicle to edit
	vehicle: Vehicle_For_db_PATCH;
	schema: typeof VehicleSchemaForPATCH;
};

// Add new vehicle mode
type FormPropsNewVehicleMode = FormPropsBase & {
	mode: "newVehicle";
	// No vehicle to edit
	vehicle: never;
	schema: typeof VehicleToBePostedSchema;
};

type FormProps = FormPropsEditMode | FormPropsNewVehicleMode;

const CalculateMileageForm = (props: FormProps) => {
	const { mode, vehicle, schema } = props;

	type EditSchemaOrPOSTSchema = z.infer<typeof schema>;

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

	const savedLocalStorageValues = getSavedFormValuesFromLocalStorage();

	// Form setup
	const form = useForm<EditSchemaOrPOSTSchema>({
		// This is how you tell rhf to use zod for validation
		resolver: zodResolver(
			mode === "editVehicle" ? VehicleSchemaForPATCH : VehicleToBePostedSchema
		),
		// If in edit mode, populate form with vehicle to be edited
		// If in vehicle creation mode, populate form with saved form values from localStorage (if they exist)
		defaultValues: mode === "editVehicle" ? vehicle : savedLocalStorageValues,
	});

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = form;

	const formValues = getValues();

	// For persisting form data in localStorage
	// const watchAllFields = watch(); // Watch all fields

	// Every time user changes a form value, save it to localStorage
	// This will be loaded back into the form if user navigates away and comes back
	useEffect(() => {
		const subscription = watch((value) => {
			// Only persist if we have values
			if (Object.keys(value).length > 0) {
				localStorage.setItem(
					LOCAL_STORAGE_FORM_DATA_KEY,
					JSON.stringify(value)
				);
			}
		});

		// Cleanup subscription on unmount
		return () => subscription.unsubscribe();
	}, [watch]); // watch function from react-hook-form is stable

	/**Wrapper to give this a clearer name
	 * Clears all form values and removes persisted form data from localStorage
	 */
	const clearAllFormValues = () => {
		// Remove persisted form data
		localStorage.removeItem(LOCAL_STORAGE_FORM_DATA_KEY);

		// Reset all form values
		reset({}); // Pass empty object to reset all fields to undefined
	};

	// TODO: Flesh out onSubmit. Shouldn't be hard, just pass it to POST function. Maybe we need to specify this lives on the server?
	// Note: r-h-f does Zod validation automatically so we don't need to instate that manually
	// This runs after form validation has succeeded so we're safe to clear form values
	const mySubmitLogic: SubmitHandler<Vehicle_For_db_POST> = async (
		formData
	) => {
		console.log("formData:", formData);

		// When you write the code to send the form data to the server, make sure to call clearAllFormValues() AFTER the server responds with a success
		clearAllFormValues();
	};

	/**Changes the displayed form section when user indicates that they have a gas or EV
	 *
	 * Can't just use formValues.type for this because the component won't re-render when that changes
	 */
	const watchedVehicleType = watch("type");

	/**The order form sections are listed in, for form navigation purposes
	 * Not totally sure why I have to use useMemo, but the linter yelled at me until I did it this way
	 */
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

			{/* User can click this to clear all form values */}
			<FormButton
				onClick={clearAllFormValues}
				text="Clear Form"
				variant="primary"
				isConfirmationRequired={true}
				confirmationDialogOptions={{
					title: "Clear Form",
					message: "Are you sure you want to clear the form?",
					confirmButtonText: "Clear",
					cancelButtonText: "Cancel",
				}}
			/>

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

			{/* This part does a lot of heavy lifting
			It's all the form sections, one for each sub-object of Vehicle */}
			<FormSubSections
				register={register}
				errors={errors}
				collapsedSections={collapsedSections}
				toggleSectionCollapse={toggleSectionCollapse}
				goToNextSection={goToNextSection}
				formSectionOrder={formSectionOrder}
				watchedVehicleType={watchedVehicleType}
			/>

			<FormButton
				text={isSubmitting ? "Loading" : "Submit"}
				className="submit"
				isDisabled={isSubmitting}
				onClick={() => {
					setisShowErrorSummary(errors ? true : false);
				}}
				isConfirmationRequired={false}
				type={"submit"}
			></FormButton>
		</form>
	);
};

export default CalculatorPage;
