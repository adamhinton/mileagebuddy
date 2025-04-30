import Page from "../../src/app/page";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import TestReduxStore from "../../src/app/utils/unitTestUtils/dummyReduxStore";

// Added this because form submit logic uses router to push to /dashboard on success, and the test renders were getting errors without it
// Fixes the error: "Invariant: Expected app router to be mounted"
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

describe("Page", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<Page />
			</TestReduxStore>
		);
	});
	
	it("matches snapshot from 4.30.2025", () => {
		const { container } = render(
			<TestReduxStore>
				<Page />
			</TestReduxStore>
		);
		expect(container).toMatchSnapshot();
	});
});

describe("Sanity check", () => {
	it("2 + 2 = 4", () => {
		const twoPlusTwo = 2 + 2;
		expect(twoPlusTwo).toBe(4);
	});
});
