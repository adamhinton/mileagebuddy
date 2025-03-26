// README
// This is the meat and potatoes of the whole MileageBuddy project.
// This is the form where user creates a Vehicle object, which will be used to calculate the cost of driving that vehicle.
// The form is broken down into sections, each of which corresponds to a sub-object of the Vehicle object.
// Also calculates the cost of any additional miles driven.
// Form validation will be done by Zod.
// Errors: Form displays input errors next to each input (if there is an error), as well as a summary of the first three sections with errors at the top of the form.
// Persistence: If user navigates away or exits the page before finishing the form, the form state is saved to localStorage and restored when user returns.
// User can also clear the form with the Clear Form button.
// EDIT MODE: This form can be used to either edit a vehicle or create a new one, depending on the props passed in. There is minimal UI difference between these mods.
// Testing: Tested in VehicleCreationForm.test.tsx

// TODO: VCF isn't clearing on form submit (not on edit submit at least)

import { Vehicle_For_db_PATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo, useState, useRef } from "react";
import { z, ZodSchema } from "zod";
import {
	CollapsibleSectionTitles,
	useFormNavigation,
} from "../calculatorUtils/FormNavUtils";
import getSavedFormValuesFromLocalStorage from "../calculatorUtils/getSavedFormValuesFromLocalStorage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorSummary from "./FormErrorSummary";
import Button from "../../components/Button";
import FormSubSections from "./AllFormSubSections";
import formSubmitLogic from "../calculatorUtils/formSubmitLogic";
import {
	defaultVehicleValuesPATCH,
	defaultVehicleValuesPOST,
} from "../calculatorUtils/calculatorFormDefaultValues";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

/** Prevent typos by making sure localStorage persisted data is always accessed the same way */
export const LOCAL_STORAGE_FORM_DATA_KEY = "mileageFormData";

/**Better way of toggling collapsed state than true or false */
export type CollapsedOrNot = "isCollapsed" | "isNotCollapsed";

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
	schema: z.ZodSchema;
	vehicleToEdit?: Vehicle_For_db_PATCH;
};

// Edit existing vehicle mode
// How to call this:
/* <VehicleCreationOrEditForm
				mode="editVehicle"
				schema={VehicleSchemaForPATCH}
				vehicleToEdit={firstVehicle}
			/> */
type FormPropsEditMode = FormPropsBase & {
	mode: "editVehicle";
	vehicleToEdit: Vehicle_For_db_PATCH;
	schema: ZodSchema<Vehicle_For_db_PATCH>;
};

// Add new vehicle mode
// How to call this:
/* <VehicleCreationOrEditForm
				mode="newVehicle"
				schema={VehicleToBePostedSchema}
			/> */

type FormPropsNewVehicleMode = FormPropsBase & {
	mode: "newVehicle";
	schema: ZodSchema<Vehicle_For_db_POST>;
};

// Edit mode or new vehicle creation mode
// Not totally sure I structured this generic according to best practices, but it does the job.
type FormProps = FormPropsEditMode | FormPropsNewVehicleMode;
/** This has two slightly different props structures based on if it's in edit mode or new vehicle creation mode
 *
 * For edit mode, see FormPropsEditMode
 * For new vehicle creation mode, see FormPropsNewVehicleMode
 */
const VehicleCreationOrEditForm = (props: FormProps) => {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const userId = loggedInUser ? loggedInUser.id : "testid";
	console.log("userId:", userId);

	const { mode, vehicleToEdit, schema } = props;

	// User can collapse or uncollapse form sections
	// Hitting "next" in a section also scrolls to the next section and uncollapses it
	// This state (obviously) tracks which sections are collapsed or not
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
	const errorSummaryRef = useRef<HTMLDivElement>(null);

	const savedLocalStorageValues = getSavedFormValuesFromLocalStorage();

	const [hasResetFormValues, setHasResetFormValues] = useState(false);

	// Form setup
	const form = useForm<VehiclePATCHorPOST>({
		// This is how you tell rhf to use zod for validation
		resolver: zodResolver(schema),
		// If in edit mode, populate form with vehicle to be edited
		// If in vehicle creation mode, populate form with saved form values from localStorage (if they exist)
		defaultValues:
			mode === "editVehicle"
				? hasResetFormValues
					? defaultVehicleValuesPATCH(userId, vehicleToEdit!)
					: vehicleToEdit!
				: savedLocalStorageValues || defaultVehicleValuesPOST(userId),
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

	// When error summary becomes visible and has errors, scroll to it
	useEffect(() => {
		if (
			isShowErrorSummary &&
			Object.keys(errors).length > 0 &&
			errorSummaryRef.current
		) {
			errorSummaryRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}, [isShowErrorSummary, errors]);

	useEffect(() => {
		if (hasResetFormValues) {
			reset(
				mode === "editVehicle"
					? defaultVehicleValuesPATCH(userId, vehicleToEdit!)
					: defaultVehicleValuesPOST(userId)
			);
			setHasResetFormValues(false);
		}
	}, [hasResetFormValues, mode, reset, userId, vehicleToEdit]);

	const formValues = getValues();

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
	 *
	 * Note to self: This is a mess. Apologies to my future self. For some reason RHF's reset() functionality wasn't working, so I had to do some wonky stuff with react state.
	 */
	const clearAllFormValues = () => {
		// set all form sections 	to be collapsed first because for some reason this wasn't working if they weren't collapsed
		// @ts-expect-error - I'm tired and don't want to deal with typing this. TODO Stretch loop around to this
		collapseAllSections(setCollapsedSections);

		// Remove persisted form data
		localStorage.removeItem(LOCAL_STORAGE_FORM_DATA_KEY);

		setHasResetFormValues(true);

		// Reset all form values except pre-set ones that aren't defined by the user
		reset(
			mode === "editVehicle"
				? defaultVehicleValuesPATCH(userId, vehicleToEdit!)
				: defaultVehicleValuesPOST(userId)
		);
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
	setValue("userid", userId);

	const dispatch = useAppDispatch();

	const styles = tailWindClassNames.mileageCalcForm;

	return (
		<form
			onSubmit={handleSubmit((formData) => {
				formSubmitLogic(formData, dispatch, clearAllFormValues);
			})}
			className={styles.FORM_CONTAINER}
		>
			{isShowErrorSummary && Object.keys(errors).length > 0 && (
				<div ref={errorSummaryRef}>
					<FormErrorSummary errors={errors} />
				</div>
			)}

			<div className={styles.FORM_HEADER}>
				<h1 className={styles.FORM_TITLE}>
					{mode === "editVehicle"
						? `Edit ${vehicleToEdit?.vehicleData?.vehicleName || "Vehicle"}`
						: "Create New Vehicle"}
				</h1>

				<Button
					onClick={clearAllFormValues}
					text="Clear Form"
					variant="secondary"
					isConfirmationRequired={true}
					confirmationDialogOptions={{
						title: "Clear Form",
						message: "Are you sure you want to clear all form data?",
						confirmButtonText: "Clear",
						cancelButtonText: "Cancel",
					}}
					className="self-start"
				/>
			</div>

			<div className="p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
				<h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200 mb-2">
					Vehicle Type
				</h3>

				<div className="flex items-center gap-3 mb-2">
					<label
						className={`flex flex-1 items-center gap-2 bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 rounded-md cursor-pointer border hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors
						${
							watchedVehicleType === "gas"
								? "border-primary dark:border-primary-200"
								: "border-neutral-200 dark:border-neutral-600"
						}`}
					>
						<input
							type="radio"
							value="gas"
							{...register("type", { required: true })}
							className="text-primary focus:ring-primary h-3.5 w-3.5"
						/>
						<span className="text-sm">Gas Vehicle</span>
					</label>
					<label
						className={`flex flex-1 items-center gap-2 bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 rounded-md cursor-pointer border hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors
						${
							watchedVehicleType === "electric"
								? "border-primary dark:border-primary-200"
								: "border-neutral-200 dark:border-neutral-600"
						}`}
					>
						<input
							type="radio"
							value="electric"
							{...register("type", { required: true })}
							className="text-primary focus:ring-primary h-3.5 w-3.5"
						/>
						<span className="text-sm">Electric Vehicle</span>
					</label>
				</div>

				{errors.type && (
					<p className="text-xs text-red-600 dark:text-red-400">
						Please select a vehicle type
					</p>
				)}
			</div>

			{/* All form sections */}
			<FormSubSections
				register={register}
				errors={errors}
				collapsedSections={collapsedSections}
				toggleSectionCollapse={toggleSectionCollapse}
				goToNextSection={goToNextSection}
				formSectionOrder={formSectionOrder}
				watchedVehicleType={watchedVehicleType}
			/>

			<div className={styles.FORM_FOOTER}>
				<Button
					text={isSubmitting ? "Saving..." : "Save Vehicle"}
					className="px-6 py-2.5"
					isDisabled={isSubmitting}
					onClick={() => {
						setisShowErrorSummary(Object.keys(errors).length > 0);
					}}
					isConfirmationRequired={false}
					type="submit"
					variant="primary"
				/>
			</div>
		</form>
	);
};

export default VehicleCreationOrEditForm;

// I typed this out when I was tired and frustrated. It's technical debt.  Stretch type this better when you have a chance.
const collapseAllSections = (
	setCollapsedSections: (myObj: unknown) => void
) => {
	setCollapsedSections({
		// ts-expect-error - I'm tired and don't want to deal with typing this. TODO Stretch loop around to this
		gasVehicleData: "isCollapsed",
		vehicleData: "isCollapsed",
		electricVehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	});
};
