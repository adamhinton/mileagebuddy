// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the VehicleData sub-object
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import MileageCalcFormTextInput from "../MileageCalcFormTextInput";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { CollapsedOrNot } from "../../page";

// TODO pass in register

type Props = {
	register: UseFormRegister<Vehicle_For_db_POST>;
	errors: FieldErrors<Vehicle_For_db_POST>;
	isCollapsed: CollapsedOrNot;

	onToggleCollapse: () => void;
};

const VehicleDataSubForm = (props: Props) => {
	const { register, errors, isCollapsed, onToggleCollapse } = props;

	return (
		<FormSection
			title="Vehicle Data"
			id="vehicleData"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
		>
			<MileageCalcFormTextInput
				registerFn={register}
				path="vehicleData.vehicleName"
				subSchema={BaseVehicleSchema.shape.vehicleData.shape.vehicleName}
				error={errors.vehicleData?.vehicleName?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="vehicleData.year"
				subSchema={BaseVehicleSchema.shape.vehicleData.shape.year}
				error={errors.vehicleData?.year?.message}
			/>

			<MileageCalcFormTextInput
				registerFn={register}
				path="vehicleData.make"
				subSchema={BaseVehicleSchema.shape.vehicleData.shape.make}
				error={errors.vehicleData?.make?.message}
			/>

			<MileageCalcFormTextInput
				registerFn={register}
				path="vehicleData.model"
				subSchema={BaseVehicleSchema.shape.vehicleData.shape.model}
				error={errors.vehicleData?.model?.message}
			/>

			<MileageCalcFormTextInput
				registerFn={register}
				path="vehicleData.trim"
				subSchema={BaseVehicleSchema.shape.vehicleData.shape.trim}
				error={errors.vehicleData?.trim?.message}
			/>
		</FormSection>
	);
};

export default VehicleDataSubForm;
