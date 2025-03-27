// ________________________________________________________________
// This is (obviously) tests for /dashboard/page.tsx
// All components within this are thoroughly tested individually, so this is just a smoke test to make sure the page loads and the components are rendered correctly

// Note: All this page does is render <Dashboard/>. So these tests are the same as the tests for Dashboard.tsx
// ______________________________________________________________

import DashboardPage from "@/app/dashboard/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { render, screen } from "@testing-library/react";

// Not sure why I had to do this here
// See https://stackoverflow.com/questions/62410948/why-does-jest-dom-give-the-error-typeerror-expect-not-tobevisible-is-not
import "@testing-library/jest-dom";

// Added this because Dashboard uses router for navigation, and the test renders were getting errors without it
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

describe("dashboard/page.tsx", () => {
	it("Renders without crashing when passed a list of vehicles", () => {
		render(
			// Dummy redux store for testing
			// This fake store has a list of vehicles by default so I don't have to pass one in
			<TestReduxStore>
				<DashboardPage />
			</TestReduxStore>
		);
	});

	it("Renders without crashing when passed an empty list of vehicles", () => {
		render(
			<TestReduxStore vehicles={[]}>
				<DashboardPage />
			</TestReduxStore>
		);
	});

	it("Displays vehicle name of each vehicle in the redux store", () => {
		render(
			<TestReduxStore>
				<DashboardPage />
			</TestReduxStore>
		);

		expect(screen.getByText("Toyota Camry")).toBeVisible();
		expect(screen.getByText("Tesla Model 3")).toBeVisible();
		expect(screen.getByText("Nissan Leaf")).toBeVisible();

		// Sanity check
		const shouldntExist = "This vehicle shouldn't exist";
		expect(screen.queryByText(shouldntExist)).toBeNull();
	});
});
