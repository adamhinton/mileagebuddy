import CalculatorPage from "@/app/calculator/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { render } from "@testing-library/react";

describe("Sanity check", () => {
	it("should pass", () => {
		expect(1 + 1).toBe(2);
	});
});

describe("Calculator page", () => {
	it("Renders without errors", () => {
		render(
			<TestReduxStore>
				<CalculatorPage />
			</TestReduxStore>
		);
	});
});
