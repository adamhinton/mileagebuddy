// MileageCalcFormTextInput.tsx
// This is the basic text input for the form used in the car mileage cost calculator
// It's based on MileageCalcFormNumberInput.tsx, more or less the same thing but with text, and it's wider to accommodate up to 30 characters
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormTextInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { VehicleForTesting } from "../page";
import { z } from "zod";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type MileageCalcFormTextInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	path: Path<VehicleForTesting>;
	error?: string;
	subSchema: z.ZodString;
};

/**
 * Text input for small values (<30 chars)
 *
 *  @param path What you pass in to register(). For instance "vehicleData.vehicleName"
 *
 * @param error Auto-generated error message from react-hook-form by way of Zod schema validation
 *
 * @param subSchema The Zod schema for the text input. For instance BaseVehicleSchema.shape.vehicleData.shape.vehicleName. Note that it's extended from BaseVehicleSchema because things like VehicleSchemaForPOST are union types, and you can't access the shape of a union type
 *
 * TODO write tests for text input once you've finished coding it
 */
const MileageCalcFormTextInput = ({
	registerFn,
	error,
	path,
	subSchema,
	// TODO change this type when you're out of testing and using the real vehicle type
}: MileageCalcFormTextInputProps<VehicleForTesting>) => {
	const maxLength = subSchema.maxLength || undefined;
	const minLength = subSchema.minLength || undefined;

	// Can use input's register path as the id as well
	const id = path;

	const isRequired = subSchema.isOptional();

	// I wrote all sub-schemas with a description
	// If there's no description, this uses the key name as a backup
	// The key name would look a little funny to the user (like "gasCostPerGallon" instead of "Gas Cost Per Gallon") but it would be human-readable at least
	const label = subSchema.description || path.split(".").pop();

	return (
		<div>
			<label
				htmlFor={id}
				className="text-sm font-medium text-neutral-text mr-1"
			>
				{label}
				{isRequired && <span className="text-red-500 ml-1">*</span>}
			</label>
			<input
				id={id}
				className={`${tailWindClassNames.MILEAGE_CALC_FORM_NUMBER_INPUT}`}
				type="text"
				{...registerFn(path)}
				required={isRequired}
				// Not totally sure undefined is the right choice
				defaultValue={undefined}
				maxLength={maxLength}
				minLength={minLength}
			/>
			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
		</div>
	);
};

export default MileageCalcFormTextInput;
