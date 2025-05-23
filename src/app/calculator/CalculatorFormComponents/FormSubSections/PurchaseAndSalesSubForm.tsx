// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the PurchaseAndSales sub-object
// See VehicleSubSchemas for the corresponding structure

// NOTE: The subSchema passed in here is a little different from the others. Because PurchaseAndSalesSchema has built-in validation that the others don't (see its .refine and .describe in its definition), we need to get its innerType(). This is as simple as calling the innerType() in `schema={...}`

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection, { FormNavigationOptions } from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { boughtAtLessThanSoldAtError } from "@/app/zod/schemas/vehicles/VehicleSubSchemas";
import {
	type VehiclePATCHorPOST,
	type CollapsedOrNot,
} from "../VehicleCreationForm";

type Props = {
	register: UseFormRegister<VehiclePATCHorPOST>;
	errors: FieldErrors<VehiclePATCHorPOST>;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	formNavOptions: FormNavigationOptions;
};

const PurchaseAndSalesSubForm = (props: Props) => {
	const { register, errors, isCollapsed, formNavOptions, onToggleCollapse } =
		props;
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	// There is validation done to ensure that milesBoughtAt is less than or equal to willSellCarAtMiles. This is done in the zod schema at the object level (PurchaseAndSales) because it transcends two keys -- milesBoughtAt and willSellCarAtMiles. This is a little different from the other validations, which are done at the key level. Because of this, we need to check if the error is this specific error and display it differently. This is a little hacky but it works.
	const hasBoughtAtLessThanSoldtAtError =
		errors.purchaseAndSales?.message?.match(boughtAtLessThanSoldAtError) !==
		null;

	return (
		<FormSection
			title="Purchase and Sales"
			id="purchaseAndSales"
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
				path="purchaseAndSales.yearPurchased"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.yearPurchased
				}
				error={errors.purchaseAndSales?.yearPurchased?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.purchasePrice"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.purchasePrice
				}
				error={errors.purchaseAndSales?.purchasePrice?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.downPaymentAmount"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.downPaymentAmount
				}
				error={errors.purchaseAndSales?.downPaymentAmount?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAfterYears"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.willSellCarAfterYears
				}
				error={errors.purchaseAndSales?.willSellCarAfterYears?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.milesBoughtAt"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.milesBoughtAt
				}
				error={
					// See notes above on this error
					hasBoughtAtLessThanSoldtAtError
						? boughtAtLessThanSoldAtError
						: errors.purchaseAndSales?.milesBoughtAt?.message
				}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAtMiles"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.willSellCarAtMiles
				}
				error={errors.purchaseAndSales?.willSellCarAtMiles?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="purchaseAndSales.willSellCarAtPrice"
				subSchema={
					BaseVehicleSchema.shape.purchaseAndSales.innerType().shape
						.willSellCarAtPrice
				}
				error={errors.purchaseAndSales?.willSellCarAtPrice?.message}
			/>
		</FormSection>
	);
};

export default PurchaseAndSalesSubForm;
