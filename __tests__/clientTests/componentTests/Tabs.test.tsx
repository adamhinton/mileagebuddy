// ______________________________________________________________________
// This is (obviously) tests for Tabs.tsx
// These are internal navigation links
// This is rendered in the test using a dummy redux store
// TODO stretch: Test for non-authenticated users too. Not all tabs are visible to them. Just customize dummy redux store
// ______________________________________________________________________

import Tabs from "@/components/Tabs";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
// We're going to mock this
import { usePathname } from "next/navigation";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

describe("Tabs.tsx", () => {
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
		// Tells the component that we're on the dashboard page
		(usePathname as jest.Mock).mockReturnValue("/dashboard");
	});

	it("Renders without errors", () => {
		renderTabsWithRedux();
	});

	it("Renders all navigation tabs", () => {
		const { getByText } = renderTabsWithRedux();

		expect(getByText("Login")).toBeVisible();
		expect(getByText("Dashboard")).toBeVisible();
		expect(getByText("Calculator")).toBeVisible();
		expect(getByText("About")).toBeVisible();

		// Sanity check
		expect(() => getByText("I shouldn't exist")).toThrow();
	});

	it("Applies active styling to the current tab", () => {
		const { getByText } = renderTabsWithRedux();

		// Get the active tab element
		const activeTab = getByText("Dashboard").closest("a");

		// Check that it has the active styling classes
		expect(activeTab).toHaveClass(
			"mileage-calc-tabs-link mileage-calc-tabs-link--active"
		);

		// Should not have the hover classes that inactive tabs have
		expect(activeTab).not.toHaveClass("hover:bg-background-highlight");
	});

	it("Applies inactive styling to non-active tabs", () => {
		const { getByText } = renderTabsWithRedux();

		// Get a non-active tab element
		const inactiveTab = getByText("Login").closest("a");

		// Should not have the active styling classes
		expect(inactiveTab).not.toHaveClass("hover:bg-background-highlight");

		// Should have hover classes that active tabs don't have
		expect(inactiveTab).toHaveClass(
			"mileage-calc-tabs-link mileage-calc-tabs-link--inactive"
		);
	});

	it("Sets aria-current attribute only on active tab", () => {
		const { getByText } = renderTabsWithRedux();

		const activeTab = getByText("Dashboard").closest("a");
		const inactiveTab = getByText("Login").closest("a");

		expect(activeTab).toHaveAttribute("aria-current", "page");
		expect(inactiveTab).not.toHaveAttribute("aria-current");
	});

	it("Does not prevent default behavior when clicking inactive tabs", () => {
		const { getByText } = renderTabsWithRedux();
		const inactiveTab = getByText("Login").closest("a");

		const mockEvent = { preventDefault: jest.fn() };

		fireEvent.click(inactiveTab!, mockEvent);

		expect(mockEvent.preventDefault).not.toHaveBeenCalled();
	});
});

/**
 * Render Tabs component with a mocked Redux store
 */
const renderTabsWithRedux = () => {
	return render(
		<TestReduxStore>
			<Tabs />
		</TestReduxStore>
	);
};
