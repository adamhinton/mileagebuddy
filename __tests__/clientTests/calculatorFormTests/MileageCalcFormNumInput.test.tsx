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

	it("renders with label from path when schema has no description", () => {
		render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
			/>
		);
		const label = screen.getByText("milesPerGallonCity");

		expect(label).toBeVisible();
	});

	it("shows required asterisk for required fields", () => {
		render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				// Defaults to not optional
				schema={z.number().nonnegative()}
			/>
		);
		const label = screen.getByText("*");

		expect(label).toBeVisible();
	});

	it("displays error message when error prop provided", () => {
		render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
				error="This is an error"
			/>
		);
		const error = screen.getByText("This is an error");

		expect(error).toBeVisible();
		expect(error).toHaveTextContent("This is an error");
	});

	it("hides error message when error prop is undefined", () => {
		render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
			/>
		);
		const error = screen.queryByTestId(
			"gasVehicleData.milesPerGallonCity-error"
		);

		expect(error).toBeNull();
	});

	it("Toggles error message when re-rendered with different error prop", () => {
		const { rerender } = render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
				error="This is an error"
			/>
		);
		const error = screen.getByText("This is an error");
		expect(error).toBeVisible();

		// Re-render without error
		rerender(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
			/>
		);
		const noError = screen.queryByTestId(
			"gasVehicleData.milesPerGallonCity-error"
		);
		expect(noError).toBeNull();

		// Re-render with different error
		rerender(
			<MileageInputNumTestWrapper
				path="gasVehicleData.milesPerGallonCity"
				schema={z.number()}
				error="A different error"
			/>
		);
		const newError = screen.getByText("A different error");
		expect(newError).toBeVisible();
	});
});

describe("Number Input Specific", () => {
	it("enforces min value of 0 for nonnegative fields", () => {
		render(
			<MileageInputNumTestWrapper
				path="electricVehicleData.costPerCharge"
				schema={z.number().nonnegative()}
			/>
		);
		const input = screen.getByTestId("electricVehicleData.costPerCharge-input");

		expect(input).toHaveAttribute("min", "0");
	});

	it("enforces max value from schema", () => {
		render(
			<MileageInputNumTestWrapper
				path="yearlyMaintenanceCosts.batteries"
				schema={z.number().max(100)}
			/>
		);
		const input = screen.getByTestId("yearlyMaintenanceCosts.batteries-input");

		expect(input).toHaveAttribute("max", "100");
	});

	// Allows user to input two decimal places for gas/charging cost fields
	// All other fields increment by the dollar
	it('uses step="0.01" for gas/charging cost fields', () => {
		render(
			<MileageInputNumTestWrapper
				path="gasVehicleData.gasCostPerGallon"
				schema={z.number()}
			/>
		);
		const input = screen.getByTestId("gasVehicleData.gasCostPerGallon-input");

		expect(input).toHaveAttribute("step", "0.01");

		render(
			<MileageInputNumTestWrapper
				path="electricVehicleData.costPerCharge"
				schema={z.number()}
			/>
		);
		const input2 = screen.getByTestId(
			"electricVehicleData.costPerCharge-input"
		);

		expect(input2).toHaveAttribute("step", "0.01");
	});
	// it('uses step="1" for other number fields', () => {});
	// it("converts input value to number type", () => {});
});
