// ______________________________________________________
// Tests for AllFormSubSections.tsx
// This component is just a wrapper for multiple FormSubSection components
// Those components are all thoroughly tested individually, so this test is quite basic
// ______________________________________________________

import FormSubSections from "@/app/calculator/CalculatorFormComponents/AllFormSubSections";
import { render, RenderOptions } from "@testing-library/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CollapsibleSectionTitles } from "@/app/calculator/calculatorUtils/FormNavUtils";
import {
	CollapsedOrNot,
	VehiclePATCHorPOST,
} from "@/app/calculator/CalculatorFormComponents/VehicleCreationForm";
import "@testing-library/jest-dom";

// Create mock default props
const createMockProps = () => {
	const mockRegister = jest.fn().mockImplementation((name) => ({
		name,
		onChange: jest.fn(),
		onBlur: jest.fn(),
	})) as unknown as UseFormRegister<VehiclePATCHorPOST>;

	const mockErrors = {} as FieldErrors<VehiclePATCHorPOST>;

	const mockSectionOrder: Readonly<CollapsibleSectionTitles[]> = [
		"gasVehicleData",
		"vehicleData",
		"purchaseAndSales",
		"usage",
		"fixedCosts",
		"yearlyMaintenanceCosts",
		"variableCosts",
	];

	const mockCollapsedSections: Record<
		CollapsibleSectionTitles,
		CollapsedOrNot
	> = {
		gasVehicleData: "isCollapsed",
		electricVehicleData: "isCollapsed",
		vehicleData: "isCollapsed",
		purchaseAndSales: "isCollapsed",
		usage: "isCollapsed",
		fixedCosts: "isCollapsed",
		yearlyMaintenanceCosts: "isCollapsed",
		variableCosts: "isCollapsed",
	};

	return {
		register: mockRegister,
		errors: mockErrors,
		collapsedSections: mockCollapsedSections,
		toggleSectionCollapse: jest.fn(),
		goToNextSection: jest.fn(),
		formSectionOrder: mockSectionOrder,
		watchedVehicleType: "gas" as const,
	};
};

// Helper render function
function renderFormSubSections(customProps = {}, options?: RenderOptions) {
	const defaultProps = createMockProps();
	return render(
		<FormSubSections {...defaultProps} {...customProps} />,
		options
	);
}

describe("AllFormSubSections.tsx", () => {
	it("renders without errors", () => {
		renderFormSubSections();
	});

	it("renders with gas vehicle type", () => {
		renderFormSubSections({ watchedVehicleType: "gas" });
	});

	it("renders with electric vehicle type", () => {
		renderFormSubSections({ watchedVehicleType: "electric" });
	});

	it("renders correct sections with gas vehicle type", () => {
		const { queryByText } = renderFormSubSections({
			watchedVehicleType: "gas",
		});
		expect(queryByText("Gas Vehicle Data")).toBeInTheDocument();
		expect(queryByText("Electric Vehicle Data")).not.toBeInTheDocument();
		// Should show common sections
		expect(queryByText("Vehicle Data")).toBeInTheDocument();
	});

	it("renders correct sections with electric vehicle type", () => {
		const { queryByText } = renderFormSubSections({
			watchedVehicleType: "electric",
		});
		// Should show electric form but not gas
		expect(queryByText("Electric Vehicle Data")).toBeInTheDocument();
		expect(queryByText("Gas Vehicle Data")).not.toBeInTheDocument();
		// Should show common sections
		expect(queryByText("Vehicle Data")).toBeInTheDocument();
	});

	it("calls toggleSectionCollapse when section is toggled", () => {
		const toggleSectionCollapse = jest.fn();
		const { getByText } = renderFormSubSections({
			toggleSectionCollapse,
			watchedVehicleType: "gas",
		});

		const sectionHeader = getByText("Gas Vehicle Data");
		sectionHeader.click();
		expect(toggleSectionCollapse).toHaveBeenCalledWith("gasVehicleData");
	});
});
