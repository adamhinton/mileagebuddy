// ______________________________________________________
// Tests for /app/calculator/page.tsx
// Everything within this page is tested in smaller components, so this test is very simple
// ______________________________________________________

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalculatorPage from "@/app/calculator/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";

describe("CalculatorPage", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<CalculatorPage />
			</TestReduxStore>
		);
	});
});
