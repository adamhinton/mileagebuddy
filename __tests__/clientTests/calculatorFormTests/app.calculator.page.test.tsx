import CalculatorPage from "@/app/calculator/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { render } from "@testing-library/react";

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

	it("matches snapshot from 4.30.2025", () => {
		const { container } = render(
			<TestReduxStore>
				<CalculatorPage />
			</TestReduxStore>
		);
		expect(container).toMatchSnapshot();
	});
});
