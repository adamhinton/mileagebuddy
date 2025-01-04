import TripPage from "@/app/trip/page";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import TestReduxStore from "../../src/redux/dummyReduxStore";

describe("TripPage", () => {
	it("renders without errors", () => {
		render(
			<TestReduxStore>
				<TripPage />
			</TestReduxStore>
		);
	});
});
