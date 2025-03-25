// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the GasVehicleData sub-object
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection, { FormNavigationOptions } from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { Gas_Vehicle_For_DB_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import {
	type CollapsedOrNot,
	type VehiclePATCHorPOST,
} from "../VehicleCreationForm";

type Props = {
	register: UseFormRegister<VehiclePATCHorPOST>; // The form uses a union between EV and gas vehicle for testing, but this component will only be called if it's specified as a gas vehicle, so we pass in a more specific type here
	errors: FieldErrors<Gas_Vehicle_For_DB_POST>;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	formNavOptions: FormNavigationOptions;
};

const GasVehicleDataSubForm = (props: Props) => {
	const { register, errors, isCollapsed, formNavOptions, onToggleCollapse } =
		props;
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	return (
		<FormSection
			title="Gas Vehicle Data"
			id="gasVehicleData"
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
				path="gasVehicleData.gasCostPerGallon"
				subSchema={
					BaseVehicleSchema.shape.gasVehicleData.shape.gasCostPerGallon
				}
				error={errors.gasVehicleData?.gasCostPerGallon?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="gasVehicleData.milesPerGallonHighway"
				subSchema={
					BaseVehicleSchema.shape.gasVehicleData.shape.milesPerGallonHighway
				}
				error={errors.gasVehicleData?.milesPerGallonHighway?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="gasVehicleData.milesPerGallonCity"
				subSchema={
					BaseVehicleSchema.shape.gasVehicleData.shape.milesPerGallonCity
				}
				error={errors.gasVehicleData?.milesPerGallonCity?.message}
			/>
		</FormSection>
	);
};

export default GasVehicleDataSubForm;
