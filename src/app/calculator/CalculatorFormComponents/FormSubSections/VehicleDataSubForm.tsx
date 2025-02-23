/* eslint-disable @typescript-eslint/no-unused-vars */
// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the VehicleData sub-object
// See VehicleSubSchemas for the corresponding structure

import { GasVehicleSchemaForPOST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import FormSection from "../FormSection";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";

// TODO pass in register

const VehicleDataSubForm = () => {
	return (
		<FormSection title="Vehicle Data">
			<div>bob</div>
		</FormSection>
	);
};

export default VehicleDataSubForm;
