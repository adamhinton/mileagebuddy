// README
// This is test for the MileageCalcFormNumInput component (obviously)
// It shares a lot of logic with MileageCalcFormTextInput, so these two tests share a utils file and many of the tests will look similar

import { MileageInputNumTestWrapper } from "@/app/utils/unitTestUtils/mileageCalculatorFormutils/MileageCalcInputTestUtils";
import { render, screen } from "@testing-library/react";
// Importing this is essential for stuff like toBeVisible()
import "@testing-library/jest-dom";
import { z } from "zod";

describe("Sanity check", () => {
	it("should pass", () => {
		expect(1 + 1).toBe(2);
	});
});

// This test is run for both components
describe("Common Input Behavior", () => {
	it("Renders without errors", () => {
		render(
			<MileageInputNumTestWrapper
				path="yearlyMaintenanceCosts.batteries"
				schema={z.number().describe("My Vehicle Number")}
			/>
		);
		const label = screen.getByText("My Vehicle Number");
		const input = screen.getByTestId("yearlyMaintenanceCosts.batteries-input");

		expect(input).toBeVisible();
		expect(label).toBeVisible();
	});
	// it("renders with label from schema description", () => {});
	// it("renders with label from path when no description", () => {});
	// it("shows required asterisk for required fields", () => {});
	// it("does not show required asterisk for optional fields", () => {});
	// it("displays error message when error prop provided", () => {});
	// it("hides error message when error prop is undefined", () => {});
	// it("Toggles error message when re-rendered with different error prop", () => {});
});

describe("Number Input Specific", () => {
	it("enforces min value of 0 for nonnegative fields", () => {});
	it("enforces max value from schema", () => {});
	it('uses step="0.01" for gas/charging cost fields', () => {});
	it('uses step="1" for other number fields', () => {});
	it("converts input value to number type", () => {});
});
