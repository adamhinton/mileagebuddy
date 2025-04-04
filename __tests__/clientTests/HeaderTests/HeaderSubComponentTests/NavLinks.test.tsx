// __________________________________________________________________
// This is (obviously) tests for NavLinks.tsx
// The component is pretty simple, so not much to test here
// __________________________________________________________________

import NavLinks from "@/components/Header/HeaderSubComponents/NavLinks";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("NavLinks.tsx", () => {
	it("Renders without errors", () => {
		render(<NavLinks />);
	});

	it("Renders links with correct text content", () => {
		const { getByText } = render(<NavLinks />);

		// Check for each link text
		const linkedInLink = getByText("Adam Hinton");
		expect(linkedInLink).toBeInTheDocument();

		const calculatorLink = getByText("Calculator");
		expect(calculatorLink).toBeInTheDocument();

		const sourceLink = getByText("Source");
		expect(sourceLink).toBeInTheDocument();
	});

	describe("Link Properties", () => {
		it("Has correct href for LinkedIn link", () => {
			const { getByText } = render(<NavLinks />);
			const linkedInLink = getByText("Adam Hinton");
			expect(linkedInLink).toHaveAttribute(
				"href",
				"https://www.linkedin.com/in/adam-hinton/"
			);
		});

		it("Has correct href for Calculator link", () => {
			const { getByText } = render(<NavLinks />);
			const calculatorLink = getByText("Calculator");
			expect(calculatorLink).toHaveAttribute("href", "/calculator");
		});

		it("Has correct href for Source link", () => {
			const { getByText } = render(<NavLinks />);
			const sourceLink = getByText("Source");
			expect(sourceLink).toHaveAttribute(
				"href",
				"https://github.com/adamhinton/mileagebuddy/"
			);
		});

		it("LinkedIn link opens in new tab", () => {
			const { getByText } = render(<NavLinks />);
			const linkedInLink = getByText("Adam Hinton");
			expect(linkedInLink).toHaveAttribute("target", "_blank");
		});
	});
});
