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
			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.yearPurchased"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.shape.yearPurchased}
				error={errors.yearPurchased?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.purchasePrice"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.purchasePrice}
				error={errors.purchasePrice?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.downPaymentAmount"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.downPaymentAmount}
				error={errors.downPaymentAmount?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAfterYears"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.willSellCarAfterYears
				}
				error={errors.willSellCarAfterYears?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.milesBoughtAt"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.milesBoughtAt}
				error={errors.milesBoughtAt?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAtMiles"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.willSellCarAtMiles}
				error={errors.willSellCarAtMiles?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAtPrice"
				subSchema={BaseVehicleSchema.shape.purchaseAndSales.willSellCarAtPrice}
				error={errors.willSellCarAtPrice?.message}
			/>
		</FormSection>
	);
};

export default PurchaseAndSalesSubForm;
