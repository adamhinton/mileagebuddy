import DashboardPage from "@/app/dashboard/page";
import TestReduxStore from "../testutils/clientTestUtils/reduxtestutils/dummyReduxStore";
import { render } from "@testing-library/react";

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
});
