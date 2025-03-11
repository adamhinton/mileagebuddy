// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the YearlyMaintenanceCosts sub-object
// Validated with YearlyMaintenanceCostsSchema
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection, { FormNavigationOptions } from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import {
	type CollapsedOrNot,
	type VehiclePATCHorPOST,
} from "../VehicleCreationForm";

type Props = {
	register: UseFormRegister<VehiclePATCHorPOST>;
	errors: FieldErrors<VehiclePATCHorPOST>;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	formNavOptions: FormNavigationOptions;
};

const YearlyMaintenanceCostsSubForm = (props: Props) => {
	const { register, errors, isCollapsed, formNavOptions, onToggleCollapse } =
		props;
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	return (
		<FormSection
			title="Yearly Maintenance Costs"
			id="yearlyMaintenanceCosts"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
			formNavOptions={{
				onNext,
				isLastSection,
				sectionIndex,
				totalSections,
			}}
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
