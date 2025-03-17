// MileageCalcFormTextInput.tsx
// This is the basic text input for the form used in the car mileage cost calculator
// It's based on MileageCalcFormNumberInput.tsx, more or less the same thing but with text, and it's wider to accommodate up to 30 characters
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormTextInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param
// Note, this is closely related to MileageCalcFormNumberInput.tsx, which is just different enough to warrant its own component

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import FormErrorMessage from "./FormErrorMessage";
import { VehiclePATCHorPOST } from "./VehicleCreationForm";

type MileageCalcFormTextInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	// Edit mode or new vehicle mode
	// Only difference for this component is that in edit mode, the input will be pre-filled with the existing value
	path: Path<VehiclePATCHorPOST>;
	error?: string;
	subSchema: z.ZodString;
};

/**
 * Text input for small values (<30 chars)
 *
 *  @param path What you pass in to register(). For instance "vehicleData.vehicleName". Can make this a generic if we re-use this component in other forms
 *
 * @param error Auto-generated error message from react-hook-form by way of Zod schema validation
 *
 * @param subSchema The Zod schema for the text input. For instance BaseVehicleSchema.shape.vehicleData.shape.vehicleName. Note that it's extended from BaseVehicleSchema because things like VehicleSchemaForPOST are union types, and you can't access the shape of a union type
 *
 */
const MileageCalcFormTextInput = ({
	registerFn,
	error,
	path,
	subSchema,
}: MileageCalcFormTextInputProps<VehiclePATCHorPOST>) => {
	const maxLength = subSchema.maxLength || undefined;
	const minLength = subSchema.minLength || undefined;

	// Can use input's register path as the id as well
	const id = path;

	const isRequired = !subSchema.isOptional();

	// I wrote all sub-schemas with a description
	// If there's no description, this uses the key name as a backup
	// The key name would look a little funny to the user (like "gasCostPerGallon" instead of "Gas Cost Per Gallon") but it would be human-readable at least
	const label = subSchema.description || path.split(".").pop();

	const testidInput = `${id}-input`;
	const testidLabel = `${id}-label`;

	return (
		<div className="mb-4">
			<label
				htmlFor={id}
				data-testid={testidLabel}
				className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1"
			>
				{label}
				{isRequired && (
					<span className="ml-1 text-red-500 dark:text-red-400">*</span>
				)}
			</label>
			<input
				id={id}
				data-testid={testidInput}
				className={`block w-full sm:w-80 md:w-64 px-3 py-2 sm:text-sm border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm 
				focus:ring-primary focus:border-primary dark:focus:ring-primary-500 dark:focus:border-primary-500
				bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
				// Different styling if there's an error
				${error ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500" : ""}
				disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed`}
				type="text"
				{...registerFn(path)}
				required={isRequired}
				maxLength={maxLength}
				minLength={minLength}
				aria-describedby={error ? `${id}-error` : undefined}
			/>
			{error && <FormErrorMessage errorMessage={error} path={path} />}
		</div>
	);
};

export default MileageCalcFormTextInput;
