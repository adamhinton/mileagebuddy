import CalculatorPage from "@/app/calculator/page";
import { render } from "@testing-library/react";

describe("Sanity check", () => {
	it("should pass", () => {
		expect(1 + 1).toBe(2);
	});
});

describe("Calculator page", () => {
	it("Renders without errors", () => {
		render(<CalculatorPage />);
	});
});
