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
	it("renders with label from path when schema has no description", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
			/>
		);
		const label = screen.getByText("vehicleName");

		expect(label).toBeVisible();
	});
	it("shows required asterisk for required fields", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().nonempty()}
			/>
		);
		const label = screen.getByText("*");

		expect(label).toBeVisible();
	});
	it("displays error message when error prop provided", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
				error="This is an error"
			/>
		);
		const error = screen.getByTestId("vehicleData.vehicleName-error");

		expect(error).toBeVisible();
		expect(error).toHaveTextContent("This is an error");
	});
	it("hides error message when error prop is undefined", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
			/>
		);
		const error = screen.queryByTestId("vehicleData.vehicleName-error");

		expect(error).toBeNull();
	});
	// it("Toggles error message when re-rendered with different error prop", () => {});
});

describe("Text Input Specific", () => {
	// it("enforces maxLength from schema", () => {});
	// it("enforces minLength from schema", () => {});
	// it("accepts valid text input", () => {});
});
