// README
// This is the basic number input for the form used in the car mileage cost calculator
// Most of the inputs in that form will be numbers, and all of those numbers (so far) are compatible with this component
// So I hope this thing works because I'll be using it a lot.
// TODO write tests for this once it's finalized
// This has a <label> too, but MileageCalcFormNumInputAndLabel was an annoyingly long name

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
	label: string;
	registerFn: UseFormRegister<TFieldValues>;
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
 * TODO write tests for num input once you've finished coding it
 */
const MileageCalcFormNumInput = ({
	id,
	label,
	registerFn,
	/**The actual key in the schema object. For instance "gasVehicleData.gasCostPerGallon" */
	// registerString,
	error,
	path,
	subSchema,
}: MileageCalcFormNumInputProps<VehicleForTesting>) => {
	const maxValue = subSchema.maxValue || undefined;

	// if isRequiredToBePositive, min is 0. otherwise it's schema.minValue. Otherwise it's undefined
	/**boolean */
	const isRequiredToBePositive = subSchema.nonnegative();
	const minValue = isRequiredToBePositive ? 0 : subSchema.minValue || undefined;

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
			/>
			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}{" "}
		</div>
	);
};

export default MileageCalcFormNumInput;
