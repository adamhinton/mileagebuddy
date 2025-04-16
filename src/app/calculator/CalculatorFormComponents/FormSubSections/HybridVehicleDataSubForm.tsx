// README
// This is one section of the vehicle creation/edit form
// It deals with creation of the HybridVehicleData sub-object
// See VehicleSubSchemas for the corresponding structure
// Note that this will only show up if user has a plug-in hybrid. Standard hybrids, for the purpose of our calculations, are just gas vehicles with better mpg, so they're treated as GasVehicles.

import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection, { FormNavigationOptions } from "../FormSection";
import { BaseVehicleSchema } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import MileageCalcFormNumInput from "../MileageCalcFormNumberInput";
import { Hybrid_Vehicle_For_DB_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import {
	type CollapsedOrNot,
	type VehiclePATCHorPOST,
} from "../VehicleCreationForm";

type Props = {
	register: UseFormRegister<VehiclePATCHorPOST>;
	// The form uses a union between EV, hybrid and gas vehicle for testing, but this component will only be called if it's specified as a hybrid vehicle, so we pass in a more specific type here
	errors: FieldErrors<Hybrid_Vehicle_For_DB_POST>;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	formNavOptions: FormNavigationOptions;
};

const HybridVehicleDataSubForm = (props: Props) => {
	const { register, errors, isCollapsed, formNavOptions, onToggleCollapse } =
		props;
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	return (
		<FormSection
			title="Hybrid Vehicle Data"
			id="hybridVehicleData"
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
			formNavOptions={{
				onNext,
				isLastSection,
				sectionIndex,
				totalSections,
			}}
		>
			{/* Gas components */}
			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.gasCostPerGallon"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.gasCostPerGallon
				}
				error={errors.hybridVehicleData?.gasCostPerGallon?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.milesPerGallonHighway"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.milesPerGallonHighway
				}
				error={errors.hybridVehicleData?.milesPerGallonHighway?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.milesPerGallonCity"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.milesPerGallonCity
				}
				error={errors.hybridVehicleData?.milesPerGallonCity?.message}
			/>

			{/* Electric components */}
			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.electricityCostPerKWh"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.electricityCostPerKWh
				}
				error={errors.hybridVehicleData?.electricityCostPerKWh?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.milesPerKWhHighway"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.milesPerKWhHighway
				}
				error={errors.hybridVehicleData?.milesPerKWhHighway?.message}
			/>

			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.milesPerKWhCity"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.milesPerKWhCity
				}
				error={errors.hybridVehicleData?.milesPerKWhCity?.message}
			/>

			{/* Usage pattern */}
			<MileageCalcFormNumInput
				registerFn={register}
				path="hybridVehicleData.percentElectricDriving"
				subSchema={
					BaseVehicleSchema.shape.hybridVehicleData.shape.percentElectricDriving
				}
				error={errors.hybridVehicleData?.percentElectricDriving?.message}
			/>
		</FormSection>
	);
};

export default HybridVehicleDataSubForm;
