// README
// This test gets environment variables from jest.setup.ts
// Look there if those vars are undefined.

import RootLayout from "@/app/layout";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

// dummy children to pass in to RootLayout
const dummyTestChildren = <div>Test</div>;

describe("Page", () => {
	beforeAll(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: jest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});
	it("renders without errors", () => {
		render(<RootLayout>{dummyTestChildren}</RootLayout>);
	});
});
