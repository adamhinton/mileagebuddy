// ________________________________________________________________
// This is (obviously) tests for /dashboard/page.tsx
// All components within this are thoroughly tested individually, so this is just a smoke test to make sure the page loads and the components are rendered correctly
// ______________________________________________________________

import DashboardPage from "@/app/dashboard/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { render } from "@testing-library/react";

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
});
