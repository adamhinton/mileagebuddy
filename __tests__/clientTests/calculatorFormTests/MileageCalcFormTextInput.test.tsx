// README
// This is test for the MileageCalcFormTextInput component (obviously)
// It shares a lot of logic with MileageCalcFormNumInput, so these two tests share a utils file and many of the tests will look similar

import { MileageInputTextTestWrapper } from "@/app/utils/unitTestUtils/mileageCalculatorFormutils/MileageCalcInputTestUtils";
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
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().describe("My Vehicle Name")}
			/>
		);
		const label = screen.getByText("My Vehicle Name");
		const input = screen.getByTestId("vehicleData.vehicleName-input");

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

describe("Text Input Specific", () => {
	// it("enforces maxLength from schema", () => {});
	// it("enforces minLength from schema", () => {});
	// it("accepts valid text input", () => {});
});
