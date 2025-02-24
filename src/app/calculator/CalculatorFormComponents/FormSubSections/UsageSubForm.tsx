// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the Usage sub-object
// Validated with UsageSchema
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import { VehicleForTesting } from "../../page";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";

type Props = {
	register: UseFormRegister<VehicleForTesting>;
	errors: FieldErrors<VehicleForTesting>;
};

const UsageSubForm = (props: Props) => {
	const { register, errors } = props;

	return (
		<FormSection title="Usage">
			<MileageCalcFormNumInput
				registerFn={register}
				path="usage.averageDailyMiles"
				subSchema={BaseVehicleSchema.shape.usage.shape.averageDailyMiles}
				error={errors.usage?.averageDailyMiles?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="usage.weeksPerYear"
				subSchema={BaseVehicleSchema.shape.usage.shape.weeksPerYear}
				error={errors.usage?.weeksPerYear?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="usage.percentHighway"
				subSchema={BaseVehicleSchema.shape.usage.shape.percentHighway}
				error={errors.usage?.percentHighway?.message}
			/>
		</FormSection>
	);
};

export default UsageSubForm;
