// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the VariableCosts sub-object
// Validated with VariableCostsSchema
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
	// These next four props are form navigation stuff
	onNext: () => void;
	isLastSection: boolean;
	sectionIndex: number;
	totalSections: number;
};

const VariableCostsSubForm = (props: Props) => {
	const {
		register,
		errors,
		isCollapsed,
		onToggleCollapse,
		isLastSection,
		sectionIndex,
		totalSections,
		onNext,
	} = props;

	return (
		<FormSection
			title="Variable Costs"
			id="variableCosts"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
			onNext={onNext}
			isLastSection={isLastSection}
			sectionIndex={sectionIndex}
			totalSections={totalSections}
		>
			<MileageCalcFormNumInput
				registerFn={register}
				path="variableCosts.monthlyParkingCosts"
				subSchema={
					BaseVehicleSchema.shape.variableCosts.shape.monthlyParkingCosts
				}
				error={errors.variableCosts?.monthlyParkingCosts?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="variableCosts.monthlyTolls"
				subSchema={BaseVehicleSchema.shape.variableCosts.shape.monthlyTolls}
				error={errors.variableCosts?.monthlyTolls?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="variableCosts.monthlyCarWashCost"
				subSchema={
					BaseVehicleSchema.shape.variableCosts.shape.monthlyCarWashCost
				}
				error={errors.variableCosts?.monthlyCarWashCost?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="variableCosts.monthlyMiscellaneousCosts"
				subSchema={
					BaseVehicleSchema.shape.variableCosts.shape.monthlyMiscellaneousCosts
				}
				error={errors.variableCosts?.monthlyMiscellaneousCosts?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="variableCosts.monthlyCostDeductions"
				subSchema={
					BaseVehicleSchema.shape.variableCosts.shape.monthlyCostDeductions
				}
				error={errors.variableCosts?.monthlyCostDeductions?.message}
			/>
		</FormSection>
	);
};

export default VariableCostsSubForm;
