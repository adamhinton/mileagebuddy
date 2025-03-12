import DashboardPage from "@/app/dashboard/page";
import TestReduxStore from "../../src/app/utils/unitTestUtils/dummyReduxStore";
import { render, screen } from "@testing-library/react";

// Not sure why I had to do this here
// See https://stackoverflow.com/questions/62410948/why-does-jest-dom-give-the-error-typeerror-expect-not-tobevisible-is-not
import "@testing-library/jest-dom";

describe("Sanity check", () => {
	it("should be true", () => {
		expect(true).toBe(true);
	});
});

describe("/dashboard", () => {
	it("Renders without errors", () => {
		render(
			<TestReduxStore>
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

		expect(screen.getByText("Ford F-150")).toBeVisible();
		expect(screen.getByText("Toyota Camry")).toBeVisible();
		expect(screen.getByText("Tesla Model 3")).toBeVisible();
		expect(screen.getByText("Nissan Leaf")).toBeVisible();

		// Sanity check
		const shouldntExist = "This vehicle shouldn't exist";
		expect(screen.queryByText(shouldntExist)).toBeNull();
	});
});
