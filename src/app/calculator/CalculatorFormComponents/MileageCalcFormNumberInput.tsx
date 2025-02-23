// README
// This is the basic number input for the form used in the car mileage cost calculator
// Most of the inputs in that form will be numbers, and all of those numbers (so far) are compatible with this component
// So I hope this thing works because I'll be using it a lot.
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormNumInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param

import {
	FieldValues,
	Path,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import { VehicleForTesting } from "../page";
import { z } from "zod";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type MileageCalcFormNumInputProps<TFieldValues extends FieldValues> = {
	id: string;
	registerFn: UseFormRegister<TFieldValues>;
	// What you pass in to register(). For instance "gasVehicleData.gasCostPerGallon"
	path: Path<TFieldValues>;
	error?: string;
	setValue: UseFormSetValue<TFieldValues>;
	subSchema: z.ZodNumber;
};

/**
 * Number input for small values (<5 digits)
 *
 * @param schema This is an item from the Vehicle schema that the function uses to determine factors like min and max value. For instance BaseVehicleSchema.shape.vehiclesOrder
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
	id,
	registerFn,
	error,
	path,
	subSchema,
}: MileageCalcFormNumInputProps<VehicleForTesting>) => {
	const maxValue = subSchema.maxValue || undefined;

	// if isRequiredToBePositive, min is 0. otherwise it's schema.minValue. Otherwise it's undefined
	const isRequiredToBePositive = subSchema.nonnegative();
	const minValue = isRequiredToBePositive ? 0 : subSchema.minValue || undefined;

	/**All of these should have a describe(), hopefully I didn't miss any */
	// TODO When component is complete, write tests that none of these say ZodNumber, because that's the default if description is missing
	const label = subSchema.description;

	const isRequired = subSchema.isOptional();

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
				className={`${tailWindClassNames.MILEAGE_CALC_FORM_NUMBER_INPUT}`}
				type="number"
				{...registerFn(path, {
					valueAsNumber: true,
				})}
				max={maxValue}
				min={minValue}
				required={isRequired}
				defaultValue={0}
				// Inputs can be as precise as three decimal places (for gas cost purposes) but not more
				// Most inputs don't need this much precision, but it doesn't hurt anything if they are to three decimal places so I won't stop the user
				step="0.001"
			/>
			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}{" "}
		</div>
	);
};

export default MileageCalcFormNumInput;
