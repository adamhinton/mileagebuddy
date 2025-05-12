// MileageCalcFormTextInput.tsx
// This is the basic text input for the form used in the car mileage cost calculator
// It's based on MileageCalcFormNumberInput.tsx, more or less the same thing but with text, and it's wider to accommodate up to 30 characters
// This has a <label> too, but MileageCalcFormTextInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param
// Note, this is closely related to MileageCalcFormNumberInput.tsx, which is just different enough to warrant its own component

// TODO stretch: This was originally built just for mileage form; make it more extendable since it's used in the Trip form now too

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import FormErrorMessage from "./FormErrorMessage";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type MileageCalcFormTextInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	// Edit mode or new vehicle mode
	// Only difference for this component is that in edit mode, the input will be pre-filled with the existing value
	path: Path<TFieldValues>;
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
const MileageCalcFormTextInput = <TFieldValues extends FieldValues>({
	registerFn,
	error,
	path,
	subSchema,
}: MileageCalcFormTextInputProps<TFieldValues>) => {
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

	const styles = tailWindClassNames.mileageCalcForm;

	return (
		<div className="mb-4">
			<label
				htmlFor={id}
				data-testid={testidLabel}
				className={styles.FORM_LABEL}
			>
				{label}
				{isRequired && <span className={styles.REQUIRED_ASTERISK}>*</span>}
			</label>
			<input
				id={id}
				data-testid={testidInput}
				className={`${styles.FORM_TEXT_FIELD} ${error ? styles.FORM_TEXT_FIELD_ERROR : ""}`}
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
