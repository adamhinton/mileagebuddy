import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import TestReduxStore from "../../src/app/utils/unitTestUtils/dummyReduxStore";
import TripCreationPage from "@/app/trip_planner/page";

describe("TripPage", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<TripCreationPage />
			</TestReduxStore>
		);
	});

	it("matches snapshot from 4.30.2025", () => {
		const { container } = render(
			<TestReduxStore>
				<TripCreationPage />
			</TestReduxStore>
		);
		expect(container).toMatchSnapshot();
	});
});
