// ___________________________________________________________________
// This is (obviously) tests for Dashboard.tsx
// All components within this are thoroughly tested individually, so this is just a high level test to make sure it doesn't crash
// Note that all dashboard/page.tsx does is render <Dashboard/>, so the "renders without errors" tests are the same as the tests for app.dashboard.page.test.tsx
// Not sure if it's best practices to duplicate tests like that, but it's only two tests and I figure two is better than none
//  __________________________________________________________________

import Dashboard from "@/app/dashboard/components/Dashboard";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { render } from "@testing-library/react";

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

describe("Dashboard.tsx", () => {
	describe("Renders without crashing", () => {
		it("Renders without crashing when passed a list of vehicles", () => {
			render(
				// Dummy redux store for testing
				// This fake store has a list of vehicles by default so I don't have to pass one in
				<TestReduxStore>
					<Dashboard />
				</TestReduxStore>
			);
		});

		it("Renders without crashing when passed an empty list of vehicles", () => {
			render(
				<TestReduxStore vehicles={[]}>
					<Dashboard />
				</TestReduxStore>
			);
		});
	});
});
