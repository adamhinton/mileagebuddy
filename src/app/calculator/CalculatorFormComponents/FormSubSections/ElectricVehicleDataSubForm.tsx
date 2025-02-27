// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the ElectricVehicleData sub-object
// Obviously, user will only see this if they're creating an electric vehicle. If it's gas they'll see the GasVehicleDataSubForm
// All other sub-forms are the same between vehicle types.
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import { SmallElectricVehicleForTesting, VehicleForTesting } from "../../page";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";

type Props = {
	register: UseFormRegister<VehicleForTesting>;
	// The form uses a union between EV and gas vehicle for testing, but this component will only be called if it's specified as an electric vehicle, so we pass in a more specific type here
	errors: FieldErrors<SmallElectricVehicleForTesting>;
};

const ElectricVehicleDataSubForm = (props: Props) => {
	const { register, errors } = props;

	return (
		<FormSection title="Electric Vehicle Data">
			<MileageCalcFormNumInput
				registerFn={register}
				path="electricVehicleData.costPerCharge"
				subSchema={
					BaseVehicleSchema.shape.electricVehicleData.shape.costPerCharge
				}
				error={errors.electricVehicleData?.costPerCharge?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="electricVehicleData.milesPerCharge"
				subSchema={
					BaseVehicleSchema.shape.electricVehicleData.shape.milesPerCharge
				}
				error={errors.electricVehicleData?.milesPerCharge?.message}
			/>
		</FormSection>
	);
};

export default ElectricVehicleDataSubForm;
