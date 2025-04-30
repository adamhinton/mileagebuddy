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

	it("Toggles error message when re-rendered with different error prop", () => {
		const { rerender } = render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
				error="This is an error"
			/>
		);
		const error = screen.getByText("This is an error");
		expect(error).toBeVisible();

		// Re-render without error
		rerender(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
			/>
		);
		const noError = screen.queryByTestId("vehicleData.vehicleName-error");
		expect(noError).toBeNull();

		// Re-render with different error
		rerender(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
				error="A different error"
			/>
		);
		const newError = screen.getByText("A different error");
		expect(newError).toBeVisible();
	});
});

describe("Text Input Specific", () => {
	it("enforces maxLength from schema", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().max(5)}
			/>
		);
		const input = screen.getByTestId("vehicleData.vehicleName-input");

		expect(input).toHaveAttribute("maxLength", "5");
	});

	it("enforces minLength from schema", () => {
		render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().min(5)}
			/>
		);
		const input = screen.getByTestId("vehicleData.vehicleName-input");

		expect(input).toHaveAttribute("minLength", "5");
	});
});

describe("Snapshot Tests", () => {
	it("matches snapshot for basic text input from 4.30.2025", () => {
		const { container } = render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().describe("My Vehicle Name")}
			/>
		);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for required text field from 4.30.2025", () => {
		const { container } = render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().nonempty()}
			/>
		);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for text input with error from 4.30.2025", () => {
		const { container } = render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string()}
				error="This is an error message"
			/>
		);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for text input with length constraints from 4.30.2025", () => {
		const { container } = render(
			<MileageInputTextTestWrapper
				path="vehicleData.vehicleName"
				schema={z.string().min(5).max(20)}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
