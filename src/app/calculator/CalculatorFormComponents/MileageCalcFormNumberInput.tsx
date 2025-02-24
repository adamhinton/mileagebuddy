// README
// This is the basic number input for the form used in the car mileage cost calculator
// Most of the inputs in that form will be numbers, and all of those numbers (so far) are compatible with this component
// So I hope this thing works because I'll be using it a lot.
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormNumInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param

// TODO: Fix num input leading zeroes

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { VehicleForTesting } from "../page";
import { z } from "zod";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type MileageCalcFormNumInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	path: Path<VehicleForTesting>;
	error?: string;
	subSchema: z.ZodNumber;
};

/**
 * Number input for small values (<5 digits)
 *
 *  @param path What you pass in to register(). For instance "gasVehicleData.gasCostPerGallon"
 *
 * @param error Auto-generated error message from react-hook-form by way of Zod schema validation
 *
 * @param subSchema The Zod schema for the number input. For instance BaseVehicleSchema.shape.fixedCosts.shape.inspectionCost. Note that it's extended from BaseVehicleSchema because things like VehicleSchemaForPOST are union types, and you can't access the shape of a union type
 *
 * TODO write tests for num input once you've finished coding it
 */
const MileageCalcFormNumInput = ({
	registerFn,
	error,
	path,
	subSchema,
	// TODO change this type when you're out of testing and using the real vehicle type
}: MileageCalcFormNumInputProps<VehicleForTesting>) => {
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

	const isRequired = subSchema.isOptional();

	// Inputs can be as precise as two decimal places for gas cost or EV cost per charge purposes, but not more
	// All other inputs are incremented by the dollar
	const step =
		path === "gasVehicleData.gasCostPerGallon" ||
		"electricVehicleData.costPerCharge"
			? "0.01"
			: "1";

	return (
		<div>
			<label
				htmlFor={id}
				className={`${tailWindClassNames.mileageCalcForm.FORM_INPUT_LABEL}`}
			>
				{label}
				{isRequired && <span className="text-red-500 ml-1">*</span>}
			</label>
			<input
				id={id}
				className={`${tailWindClassNames.mileageCalcForm.FORM_NUMBER_INPUT}`}
				type="number"
				{...registerFn(path, {
					valueAsNumber: true,
				})}
				max={maxValue}
				min={minValue}
				required={isRequired}
				// Not totally sure undefined is the right choice
				defaultValue={undefined}
				step={step}
			/>
			{error && (
				<p
					className={
						tailWindClassNames.mileageCalcForm.mileageCalcForm
							.FORM_ERROR_MESSAGE
					}
				>
					{error}
				</p>
			)}{" "}
		</div>
	);
};

export default MileageCalcFormNumInput;
