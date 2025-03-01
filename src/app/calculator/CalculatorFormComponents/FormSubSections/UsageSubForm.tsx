// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the Usage sub-object
// Validated with UsageSchema
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { CollapsedOrNot } from "../../page";

type Props = {
	register: UseFormRegister<Vehicle_For_db_POST>;
	errors: FieldErrors<Vehicle_For_db_POST>;
	isCollapsed: CollapsedOrNot;

	onToggleCollapse: () => void;
};

const UsageSubForm = (props: Props) => {
	const { register, errors, isCollapsed, onToggleCollapse } = props;

	return (
		<FormSection
			title="Usage"
			id="usage"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
		>
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
