import TripPage from "@/app/trip/page";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import TestReduxStore from "../../src/app/utils/unitTestUtils/dummyReduxStore";

describe("TripPage", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<TripPage />
			</TestReduxStore>
		);
	});
	
	it("matches snapshot from 4.30.2025", () => {
		const { container } = render(
			<TestReduxStore>
				<TripPage />
			</TestReduxStore>
		);
		expect(container).toMatchSnapshot();
	});
});
