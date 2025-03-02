//____________________________________
// This is (obviously) tests for FormErrorMessage.test.tsx
// The component is fairly simple
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
});
