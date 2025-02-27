// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the FixedCosts sub-object
// Validated with FixedCostsSchema
// See VehicleSubSchemas for the corresponding structure

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../FormSection";
import { VehicleForTesting } from "../../page";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";

// TODO pass in register

type Props = {
	register: UseFormRegister<Vehicle_For_db_POST>;
	errors: FieldErrors<Vehicle_For_db_POST>;
};

const FixedCostsSubForm = (props: Props) => {
	const { register, errors } = props;

	return (
		<FormSection title="Fixed Costs">
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.yearlyInsuranceCost"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.yearlyInsuranceCost}
				error={errors.fixedCosts?.yearlyInsuranceCost?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.yearlyRegistrationCost"
				subSchema={
					BaseVehicleSchema.shape.fixedCosts.shape.yearlyRegistrationCost
				}
				error={errors.fixedCosts?.yearlyRegistrationCost?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.yearlyTaxes"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.yearlyTaxes}
				error={errors.fixedCosts?.yearlyTaxes?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.monthlyLoanPayment"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.monthlyLoanPayment}
				error={errors.fixedCosts?.monthlyLoanPayment?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.monthlyWarrantyCost"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.monthlyWarrantyCost}
				error={errors.fixedCosts?.monthlyWarrantyCost?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.inspectionCost"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.inspectionCost}
				error={errors.fixedCosts?.inspectionCost?.message}
			/>
			<MileageCalcFormNumInput
				registerFn={register}
				path="fixedCosts.otherYearlyCosts"
				subSchema={BaseVehicleSchema.shape.fixedCosts.shape.otherYearlyCosts}
				error={errors.fixedCosts?.otherYearlyCosts?.message}
			/>
		</FormSection>
	);
};

export default FixedCostsSubForm;
