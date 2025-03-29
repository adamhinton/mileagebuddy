// _______________________________________________________________
// This is (obviously) tests for Header.tsx
// _______________________________________________________________

import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { Header } from "@/components/Header/Header";
import { render } from "@testing-library/react";

// TODO hopefully I didn't forget to write these tests
describe("Header.tsx", () => {
	it("Renders without errors", () => {
		render(
			<TestReduxStore>
				<Header />
			</TestReduxStore>
		);
	});
});
