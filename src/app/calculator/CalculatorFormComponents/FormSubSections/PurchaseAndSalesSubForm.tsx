// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the PurchaseAndSales sub-object
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import { VehicleForTesting } from "../../page";
import MileageCalcFormTextInput from "../MileageCalcFormTextInput";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";

// TODO pass in register

type Props = {
	register: UseFormRegister<VehicleForTesting>;
	errors: FieldErrors<VehicleForTesting>;
};

const PurchaseAndSalesSubForm = (props: Props) => {
	const { register, errors } = props;

	return (
		<FormSection title="Purchase and Sales">
			<div>test</div>
		</FormSection>
	);
};

export default PurchaseAndSalesSubForm;
