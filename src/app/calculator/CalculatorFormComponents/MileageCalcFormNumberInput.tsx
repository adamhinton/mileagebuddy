// README
// This is the basic number input for the form used in the car mileage cost calculator
// Most of the inputs in that form will be numbers, and all of those numbers (so far) are compatible with this component
// So I hope this thing works because I'll be using it a lot.
// This has a <label> too, but MileageCalcFormNumInputAndLabel was an annoyingly long name
// Confused about the subschema being passed in? See the jsdoc for subSchema param
// Note, this is closely related to MileageCalcFormTextInput.tsx, which is just different enough to warrant its own component

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import FormErrorMessage from "./FormErrorMessage";
import { VehiclePATCHorPOST } from "./VehicleCreationForm";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type MileageCalcFormNumInputProps<TFieldValues extends FieldValues> = {
	registerFn: UseFormRegister<TFieldValues>;
	path: Path<VehiclePATCHorPOST>;
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
}: MileageCalcFormNumInputProps<VehiclePATCHorPOST>) => {
	const maxValue = subSchema.maxValue || undefined;
	const minValue =
		subSchema.minValue || (subSchema.nonnegative() ? 0 : undefined);
	const id = path;
	const isRequired = !subSchema.isOptional();
	const label = subSchema.description || path.split(".").pop();

	// Inputs can be as precise as two decimal places for gas cost or EV cost per charge purposes, but not more
	// All other inputs are incremented by the dollar
	const step =
		path === "gasVehicleData.gasCostPerGallon" ||
		path === "electricVehicleData.costPerCharge"
			? "0.01"
			: "1";

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

			<div className="relative rounded-md shadow-sm">
				<input
					id={id}
					data-testid={testidInput}
					className={`${styles.FORM_NUMBER_FIELD} ${error ? styles.FORM_NUMBER_FIELD_ERROR : ""}`}
					type="number"
					{...registerFn(path, {
						valueAsNumber: true,
					})}
					max={maxValue}
					min={minValue}
					required={isRequired}
					step={step}
					aria-describedby={error ? `${id}-error` : undefined}
				/>
			</div>

			{error && <FormErrorMessage errorMessage={error} path={path} />}
		</div>
	);
};

export default MileageCalcFormNumInput;
