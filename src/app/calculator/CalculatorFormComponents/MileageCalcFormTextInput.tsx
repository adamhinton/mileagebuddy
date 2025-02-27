// MileageCalcFormTextInput.tsx
// This is the basic text input for the form used in the car mileage cost calculator
// It's based on MileageCalcFormNumberInput.tsx, more or less the same thing but with text, and it's wider to accommodate up to 30 characters
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormTextInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import FormErrorMessage from "./FormErrorMessage";

type MileageCalcFormTextInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	path: Path<Vehicle_For_db_POST>;
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
	// TODO change this type when you're out of testing and using the real vehicle type
}: MileageCalcFormTextInputProps<Vehicle_For_db_POST>) => {
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
		<div>
			<label
				htmlFor={id}
				data-testid={testidLabel}
				className="text-sm font-medium text-neutral-text mr-1"
			>
				{label}
				{isRequired && (
					<span
						className={tailWindClassNames.mileageCalcForm.REQUIRED_ASTERISK}
					>
						*
					</span>
				)}
			</label>
			<input
				id={id}
				data-testid={testidInput}
				className={`${tailWindClassNames.mileageCalcForm.FORM_TEXT_INPUT}`}
				type="text"
				{...registerFn(path)}
				required={isRequired}
				// TODO bob is just for testing, move back to undefined
				// Not totally sure undefined is the right choice
				defaultValue={"bob"}
				maxLength={maxLength}
				minLength={minLength}
			/>
			{error && <FormErrorMessage errorMessage={error} path={path} />}
		</div>
	);
};

export default MileageCalcFormTextInput;
