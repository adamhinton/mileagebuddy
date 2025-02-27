// README
// This is the basic number input for the form used in the car mileage cost calculator
// Most of the inputs in that form will be numbers, and all of those numbers (so far) are compatible with this component
// So I hope this thing works because I'll be using it a lot.
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormNumInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param

// TODO: Fix num input leading zeroes

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import FormErrorMessage from "./FormErrorMessage";

type MileageCalcFormNumInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	path: Path<Vehicle_For_db_POST>;
	error?: string;
	subSchema: z.ZodNumber;
};

/**
 * Number input for small values (<5 digits)
 *
 *  @param path What you pass in to register(). For instance "gasVehicleData.gasCostPerGallon". Can make this a generic if we re-use this component in other forms
 *
 * @param error Auto-generated error message from react-hook-form by way of Zod schema validation
 *
 * @param subSchema The Zod schema for the number input. For instance BaseVehicleSchema.shape.fixedCosts.shape.inspectionCost. Note that it's extended from BaseVehicleSchema because things like VehicleSchemaForPOST are union types, and you can't access the shape of a union type
 *
 */
const MileageCalcFormNumInput = ({
	registerFn,
	error,
	path,
	subSchema,
	// TODO change this type when you're out of testing and using the real vehicle type
}: MileageCalcFormNumInputProps<Vehicle_For_db_POST>) => {
	const maxValue = subSchema.maxValue || undefined;

	// Can use input's register path as the id as well
	const id = path;

	// if isRequiredToBePositive, min is 0. otherwise it's schema.minValue. Otherwise it's undefined
	const isRequiredToBePositive = subSchema.nonnegative();
	const minValue = isRequiredToBePositive ? 0 : subSchema.minValue || undefined;

	// I wrote all sub-schemas with a description
	// If there's no description, this uses the key name as a backup
	// The key name would look a little funny to the user (like "gasCostPerGallon" instead of "Gas Cost Per Gallon") but it would be human-readable at least
	const label = subSchema.description || path.split(".").pop();

	const isRequired = !subSchema.isOptional();

	// Inputs can be as precise as two decimal places for gas cost or EV cost per charge purposes, but not more
	// All other inputs are incremented by the dollar
	// Note, I tried to add a step() attribute to the gas cost and cost per charge, but couldn't figure out how to access it here. So we do it this way instead.
	const step =
		path === "gasVehicleData.gasCostPerGallon" ||
		path === "electricVehicleData.costPerCharge"
			? "0.01"
			: "1";

	const testidInput = `${id}-input`;
	const testidLabel = `${id}-label`;

	return (
		<div>
			<label
				htmlFor={id}
				datatype={testidLabel}
				className={`${tailWindClassNames.mileageCalcForm.FORM_INPUT_LABEL}`}
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
				className={`${tailWindClassNames.mileageCalcForm.FORM_NUMBER_INPUT}`}
				type="number"
				{...registerFn(path, {
					valueAsNumber: true,
				})}
				max={maxValue}
				min={minValue}
				required={isRequired}
				// Not totally sure undefined is the right choice but it seems to work
				// TODO 0 is just for testing, move back to undefined
				defaultValue={0}
				step={step}
			/>
			{error && <FormErrorMessage errorMessage={error} path={path} />}{" "}
		</div>
	);
};

export default MileageCalcFormNumInput;
