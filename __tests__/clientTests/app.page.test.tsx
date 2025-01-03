import Page from "../../src/app/page";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("Page", () => {
	it("renders without errors", () => {
		render(<Page />);
	});
});

describe("Sanity check", () => {
	it("2 + 2 = 4", () => {
		const twoPlusTwo = 2 + 2;
		expect(twoPlusTwo).toBe(4);
	});
});
