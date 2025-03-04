// ______________________________________________________
// The calculator form is broken in to multiple sub-sections (GasVehicleData, FixedCosts, Usage etc). Here I compile them all in to one component and call that component in the form.
// ______________________________________________________

import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
	Vehicle_For_db_POST,
	Gas_Vehicle_For_DB_POST,
	Electric_Vehicle_For_DB_POST,
} from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import VehicleDataSubForm from "../CalculatorFormComponents/FormSubSections/VehicleDataSubForm";
import PurchaseAndSalesSubForm from "../CalculatorFormComponents/FormSubSections/PurchaseAndSalesSubForm";
import UsageSubForm from "../CalculatorFormComponents/FormSubSections/UsageSubForm";
import FixedCostsSubForm from "../CalculatorFormComponents/FormSubSections/FixedCostsSubForm";
import YearlyMaintenanceCostsSubForm from "../CalculatorFormComponents/FormSubSections/YearlyMaintenanceCostsSubForm";
import VariableCostsSubForm from "../CalculatorFormComponents/FormSubSections/VariableCostsSubForm";
import GasVehicleDataSubForm from "../CalculatorFormComponents/FormSubSections/GasVehicleDataSubForm";
import ElectricVehicleDataSubForm from "../CalculatorFormComponents/FormSubSections/ElectricVehicleDataSubForm";
import { CollapsibleSectionTitles } from "../calculatorUtils/FormNavUtils";
import { CollapsedOrNot } from "../page";

type FormSubSectionsProps = {
	register: UseFormRegister<Vehicle_For_db_POST>;
	errors: FieldErrors<Vehicle_For_db_POST>;
	collapsedSections: Record<CollapsibleSectionTitles, CollapsedOrNot>;
	toggleSectionCollapse: (sectionId: CollapsibleSectionTitles) => void;
	goToNextSection: (sectionId: CollapsibleSectionTitles) => void;
	formSectionOrder: Readonly<CollapsibleSectionTitles[]>;
	watchedVehicleType: string | undefined;
};

const FormSubSections = ({
	register,
	errors,
	collapsedSections,
	toggleSectionCollapse,
	goToNextSection,
	formSectionOrder,
	watchedVehicleType,
}: FormSubSectionsProps) => {
	return (
		<>
			{/* If vehicle is gas, display gas vehicle questions. If electric, display EV questions */}
			{watchedVehicleType === "gas" ? (
				<GasVehicleDataSubForm
					register={register}
					errors={errors as unknown as FieldErrors<Gas_Vehicle_For_DB_POST>}
					isCollapsed={collapsedSections.gasVehicleData}
					onToggleCollapse={() => toggleSectionCollapse("gasVehicleData")}
					formNavOptions={{
						onNext: () => goToNextSection("gasVehicleData"),
						isLastSection: false,
						sectionIndex: formSectionOrder.indexOf("gasVehicleData"),
						totalSections: formSectionOrder.length,
					}}
				/>
			) : watchedVehicleType === "electric" ? (
				<ElectricVehicleDataSubForm
					register={register}
					errors={
						errors as unknown as FieldErrors<Electric_Vehicle_For_DB_POST>
					}
					isCollapsed={collapsedSections.electricVehicleData}
					onToggleCollapse={() => toggleSectionCollapse("electricVehicleData")}
					formNavOptions={{
						onNext: () => goToNextSection("electricVehicleData"),
						isLastSection: false,
						sectionIndex: formSectionOrder.indexOf("electricVehicleData"),
						totalSections: formSectionOrder.length,
					}}
				/>
			) : null}

			{/* User has to specify vehicle type (gas or electric) before seeing the rest of the form */}
			{watchedVehicleType && (
				<>
					<VehicleDataSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.vehicleData}
						onToggleCollapse={() => toggleSectionCollapse("vehicleData")}
						formNavOptions={{
							onNext: () => goToNextSection("vehicleData"),
							isLastSection: false,
							sectionIndex: formSectionOrder.indexOf("vehicleData"),
							totalSections: formSectionOrder.length,
						}}
					/>
					<PurchaseAndSalesSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.purchaseAndSales}
						onToggleCollapse={() => toggleSectionCollapse("purchaseAndSales")}
						formNavOptions={{
							onNext: () => goToNextSection("purchaseAndSales"),
							isLastSection: false,
							sectionIndex: formSectionOrder.indexOf("purchaseAndSales"),
							totalSections: formSectionOrder.length,
						}}
					/>
					<UsageSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.usage}
						onToggleCollapse={() => toggleSectionCollapse("usage")}
						formNavOptions={{
							onNext: () => goToNextSection("usage"),
							isLastSection: false,
							sectionIndex: formSectionOrder.indexOf("usage"),
							totalSections: formSectionOrder.length,
						}}
					/>
					<FixedCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.fixedCosts}
						onToggleCollapse={() => toggleSectionCollapse("fixedCosts")}
						formNavOptions={{
							onNext: () => goToNextSection("fixedCosts"),
							isLastSection: false,
							sectionIndex: formSectionOrder.indexOf("fixedCosts"),
							totalSections: formSectionOrder.length,
						}}
					/>
					<YearlyMaintenanceCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.yearlyMaintenanceCosts}
						onToggleCollapse={() =>
							toggleSectionCollapse("yearlyMaintenanceCosts")
						}
						formNavOptions={{
							onNext: () => goToNextSection("yearlyMaintenanceCosts"),
							isLastSection: false,
							sectionIndex: formSectionOrder.indexOf("yearlyMaintenanceCosts"),
							totalSections: formSectionOrder.length,
						}}
					/>
					<VariableCostsSubForm
						register={register}
						errors={errors}
						isCollapsed={collapsedSections.variableCosts}
						onToggleCollapse={() => toggleSectionCollapse("variableCosts")}
						formNavOptions={{
							onNext: () => goToNextSection("variableCosts"),
							isLastSection: true,
							sectionIndex: formSectionOrder.indexOf("variableCosts"),
							totalSections: formSectionOrder.length,
						}}
					/>
				</>
			)}
		</>
	);
};

export default FormSubSections;
