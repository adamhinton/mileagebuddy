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

import { Vehicle_For_db_PATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	useEffect,
	useMemo,
	useState,
	useRef,
	SetStateAction,
	Dispatch,
} from "react";
import { z, ZodSchema } from "zod";
import {
	CollapsibleSectionTitles,
	useFormNavigation,
} from "../calculatorUtils/FormNavUtils";
import getSavedFormValuesFromLocalStorage from "../calculatorUtils/getSavedFormValuesFromLocalStorage";
import { DeepPartial, useForm } from "react-hook-form";
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
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { useRouter } from "next/navigation";
import CreateAccountNudge from "@/components/CreateAccountNudge";

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
		hybridVehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	});

	/**Shows bullet-pointed errors at top of form after user hits submit */
	const [isShowErrorSummary, setisShowErrorSummary] = useState(false);
	const errorSummaryRef = useRef<HTMLDivElement>(null);

	const savedLocalStorageValues: DeepPartial<Vehicle> =
		getSavedFormValuesFromLocalStorage();

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
	}, [watch]);

	/**Wrapper to give this a clearer name
	 * Clears all form values and removes persisted form data from localStorage
	 *
	 * Note to self: This is a mess. Apologies to my future self. For some reason RHF's reset() functionality wasn't working, so I had to do some wonky stuff with react state.
	 */
	const clearAllFormValues = () => {
		// set all form sections 	to be collapsed first because for some reason this wasn't working if they weren't collapsed
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
			watchedVehicleType === "gas"
				? "gasVehicleData"
				: watchedVehicleType === "electric"
					? "electricVehicleData"
					: "hybridVehicleData",
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

	// new vehicles should always come first in user's list
	setValue("vehiclesOrder", 1);
	setValue("userid", userId);

	const dispatch = useAppDispatch();

	const formStyles = tailWindClassNames.mileageCalcForm;
	const layoutStyles = tailWindClassNames.layout;

	// Submit logic uses this to redirect to /dashboard after form submission
	const router = useRouter();

	// If user isn't logged in, show nudge to create an account instead of vehicle creation form
	if (!loggedInUser) {
		return <CreateAccountNudge />;
	}

	return (
		<form
			onSubmit={handleSubmit((formData) => {
				formSubmitLogic(formData, dispatch, clearAllFormValues, router);
			})}
			className={layoutStyles.CONTAINER} // Changed from styles.FORM_CONTAINER
		>
			{isShowErrorSummary && Object.keys(errors).length > 0 && (
				<div ref={errorSummaryRef}>
					<FormErrorSummary errors={errors} />
				</div>
			)}

			<div className={formStyles.FORM_HEADER}>
				<h1 className={formStyles.FORM_TITLE}>
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

			{/* TODO make this look better at smaller screen sizes */}
			<div className={formStyles.RADIO_GROUP_CONTAINER}>
				<h3 className={formStyles.RADIO_GROUP_TITLE}>Vehicle Type</h3>

				<div className={formStyles.RADIO_GROUP}>
					<label
						className={`${formStyles.RADIO_LABEL} ${
							watchedVehicleType === "gas"
								? formStyles.RADIO_LABEL_SELECTED
								: ""
						}`}
					>
						<input
							type="radio"
							value="gas"
							{...register("type", { required: true })}
							className={formStyles.RADIO_INPUT}
						/>
						<span className={formStyles.RADIO_TEXT}>Gas / Standard Hybrid</span>
					</label>
					<label
						className={`${formStyles.RADIO_LABEL} ${
							watchedVehicleType === "electric"
								? formStyles.RADIO_LABEL_SELECTED
								: ""
						}`}
					>
						<input
							type="radio"
							value="electric"
							{...register("type", { required: true })}
							className={formStyles.RADIO_INPUT}
						/>
						<span className={formStyles.RADIO_TEXT}>Electric</span>
					</label>
					{/* Same thing for plug-in hybrid */}
					<label
						className={`${formStyles.RADIO_LABEL} ${
							watchedVehicleType === "hybrid"
								? formStyles.RADIO_LABEL_SELECTED
								: ""
						}`}
					>
						<input
							type="radio"
							value="hybrid"
							{...register("type", { required: true })}
							className={formStyles.RADIO_INPUT}
						/>
						<span className={formStyles.RADIO_TEXT}>Plug-in Hybrid</span>
					</label>
				</div>

				{errors.type && (
					<p className={formStyles.RADIO_ERROR}>Please select a vehicle type</p>
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

			<div className={formStyles.FORM_FOOTER}>
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

const collapseAllSections = (
	setCollapsedSections: Dispatch<
		SetStateAction<Record<CollapsibleSectionTitles, CollapsedOrNot>>
	>
) => {
	setCollapsedSections({
		gasVehicleData: "isCollapsed",
		vehicleData: "isCollapsed",
		electricVehicleData: "isCollapsed",
		hybridVehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	});
};
