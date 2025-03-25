//____________________________________
// This is (obviously) tests for FormErrorMessage.test.tsx
// The component is very simple, so there's not much to test
//____________________________________

import FormErrorMessage from "@/app/calculator/CalculatorFormComponents/FormErrorMessage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("FormErrorMessage.tsx", () => {
	it("Renders without errors", () => {
		render(<FormErrorMessage errorMessage="Test Error Message" />);
	});

	it("Displays the error message", () => {
		render(<FormErrorMessage errorMessage="Test Error Message" />);
		const errorMessage = screen.getByText("Test Error Message");
		expect(errorMessage).toBeVisible();
	});

	it("Has the correct testid derived from path if path is passed in", () => {
		render(
			<FormErrorMessage
				errorMessage="Test Error Message"
				path="electricVehicleData"
			/>
		);
		const errorMessage = screen.getByTestId("electricVehicleData-error");
		expect(errorMessage).toBeVisible();
	});

	// Because testid is derived from the path
	it("Does not have an id or testid when path is not provided", () => {
		render(<FormErrorMessage errorMessage="Test Error Message" />);
		// Get by text since there's no testid to query by
		const errorMessage = screen.getByText("Test Error Message");
		// The element should not have an id when path is not provided
		expect(errorMessage).not.toHaveAttribute("id");
		expect(errorMessage).not.toHaveAttribute("data-testid");
	});

	it("Creates correct testid from nested path", () => {
		render(
			<FormErrorMessage
				errorMessage="Test Error Message"
				path="vehicleData.model"
			/>
		);
		expect(screen.getByTestId("vehicleData.model-error")).toBeInTheDocument();
	});

	it("Renders correctly without a path", () => {
		render(<FormErrorMessage errorMessage="Test Error Message" />);
		const errorMessage = screen.getByText("Test Error Message");
		expect(errorMessage).toBeVisible();
		expect(errorMessage).not.toHaveAttribute("id");
		expect(errorMessage).not.toHaveAttribute("data-testid");
	});

	it("Updates error message dynamically", () => {
		const { rerender } = render(
			<FormErrorMessage
				errorMessage="Initial Error Message"
				path="vehicleData.model"
			/>
		);
		let errorMessage = screen.getByText("Initial Error Message");
		expect(errorMessage).toBeVisible();

		rerender(
			<FormErrorMessage
				errorMessage="Updated Error Message"
				path="vehicleData.model"
			/>
		);
		errorMessage = screen.getByText("Updated Error Message");
		expect(errorMessage).toBeVisible();
	});
});
