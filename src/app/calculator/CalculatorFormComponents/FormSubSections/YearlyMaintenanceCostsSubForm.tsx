// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the YearlyMaintenanceCosts sub-object
// Validated with YearlyMaintenanceCostsSchema
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

const YearlyMaintenanceCostsSubForm = (props: Props) => {
	const { register, errors, isCollapsed, onToggleCollapse } = props;

	return (
		<FormSection
			title="Yearly Maintenance Costs"
			id="yearlyMaintenanceCosts"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
		>
			<MileageCalcFormNumInput
				registerFn={register}
				path="yearlyMaintenanceCosts.oilChanges"
				subSchema={
					BaseVehicleSchema.shape.yearlyMaintenanceCosts.shape.oilChanges
				}
				error={errors.yearlyMaintenanceCosts?.oilChanges?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="yearlyMaintenanceCosts.tires"
				subSchema={BaseVehicleSchema.shape.yearlyMaintenanceCosts.shape.tires}
				error={errors.yearlyMaintenanceCosts?.tires?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="yearlyMaintenanceCosts.batteries"
				subSchema={
					BaseVehicleSchema.shape.yearlyMaintenanceCosts.shape.batteries
				}
				error={errors.yearlyMaintenanceCosts?.batteries?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="yearlyMaintenanceCosts.brakes"
				subSchema={BaseVehicleSchema.shape.yearlyMaintenanceCosts.shape.brakes}
				error={errors.yearlyMaintenanceCosts?.brakes?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="yearlyMaintenanceCosts.other"
				subSchema={BaseVehicleSchema.shape.yearlyMaintenanceCosts.shape.other}
				error={errors.yearlyMaintenanceCosts?.other?.message}
			/>
		</FormSection>
	);
};

export default YearlyMaintenanceCostsSubForm;
