// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the Usage sub-object
// Validated with UsageSchema
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection, { FormNavigationOptions } from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { CollapsedOrNot, VehiclePATCHorPOST } from "../VehicleCreationForm";

type Props = {
	register: UseFormRegister<VehiclePATCHorPOST>;
	errors: FieldErrors<VehiclePATCHorPOST>;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	formNavOptions: FormNavigationOptions;
};

const UsageSubForm = (props: Props) => {
	const { register, errors, isCollapsed, formNavOptions, onToggleCollapse } =
		props;
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	return (
		<FormSection
			title="Usage"
			id="usage"
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
