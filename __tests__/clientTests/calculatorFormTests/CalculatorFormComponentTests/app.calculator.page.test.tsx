// ______________________________________________________
// Tests for /app/calculator/page.tsx
// Everything within this page is tested in smaller components, so this test is very simple
// ______________________________________________________

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalculatorPage from "@/app/calculator/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";

// Added this because form submit logic uses router to push to /dashboard on success, and the test renders were getting errors without it
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
		// Add other router properties or methods as needed for your tests
	})),
	usePathname: jest.fn(() => "/"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe("CalculatorPage", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<CalculatorPage />
			</TestReduxStore>
		);
	});
});
