// ______________________________________________________________________
// This is (obviously) tests for Tabs.tsx
// These are internal navigation links
// ______________________________________________________________________

import Tabs from "@/components/Tabs";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
// We're going to mock this
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

describe("Tabs.tsx", () => {
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
		// Default mock implementation
		(usePathname as jest.Mock).mockReturnValue("/dashboard");
	});

	it("Renders without errors", () => {
		render(<Tabs />);
	});

	it("Renders all navigation tabs", () => {
		const { getByText } = render(<Tabs />);

		// Check that all tabs from the myTabs array are rendered
		expect(getByText("Login")).toBeVisible();
		expect(getByText("Dashboard")).toBeVisible();
		expect(getByText("Calculator")).toBeVisible();
		expect(getByText("About")).toBeVisible();

		// Sanity check
		expect(() => getByText("I shouldn't exist")).toThrow();
	});

	it("Applies active styling to the current tab", () => {
		// Mock that we're on the dashboard page
		(usePathname as jest.Mock).mockReturnValue("/dashboard");

		const { getByText } = render(<Tabs />);

		// Get the active tab element
		const activeTab = getByText("Dashboard").closest("a");

		// Check that it has the active styling classes
		expect(activeTab).toHaveClass("bg-primary-50");
		expect(activeTab).toHaveClass("text-primary");
		expect(activeTab).toHaveClass("font-semibold");
		expect(activeTab).toHaveClass("border-b-2");
		expect(activeTab).toHaveClass("border-primary");

		// Should not have the hover classes that inactive tabs have
		expect(activeTab).not.toHaveClass("hover:bg-background-highlight");
	});

	it("Applies inactive styling to non-active tabs", () => {
		// Mock that we're on the dashboard page
		(usePathname as jest.Mock).mockReturnValue("/dashboard");

		const { getByText } = render(<Tabs />);

		// Get a non-active tab element
		const inactiveTab = getByText("Login").closest("a");

		// Should not have the active styling classes
		expect(inactiveTab).not.toHaveClass("bg-primary-50");
		expect(inactiveTab).not.toHaveClass("text-primary");
		expect(inactiveTab).not.toHaveClass("font-semibold");
		expect(inactiveTab).not.toHaveClass("border-b-2");
		expect(inactiveTab).not.toHaveClass("border-primary");

		// Should have hover classes that active tabs don't have
		expect(inactiveTab).toHaveClass("hover:bg-background-highlight");
		expect(inactiveTab).toHaveClass("hover:text-primary");
		expect(inactiveTab).toHaveClass("transition-colors");
	});

	it("Sets aria-current attribute only on active tab", () => {
		// Mock that we're on the dashboard page
		(usePathname as jest.Mock).mockReturnValue("/dashboard");

		const { getByText } = render(<Tabs />);

		// Get active tab element
		const activeTab = getByText("Dashboard").closest("a");
		// Get a non-active tab element
		const inactiveTab = getByText("Login").closest("a");

		// Check aria-current attribute
		expect(activeTab).toHaveAttribute("aria-current", "page");
		expect(inactiveTab).not.toHaveAttribute("aria-current");
	});

	it("Does not prevent default behavior when clicking inactive tabs", () => {
		// Mock that we're on the dashboard page
		(usePathname as jest.Mock).mockReturnValue("/dashboard");

		const { getByText } = render(<Tabs />);
		const inactiveTab = getByText("Login").closest("a");

		// Create a mock event
		const mockEvent = { preventDefault: jest.fn() };

		// Simulate a click on an inactive tab
		fireEvent.click(inactiveTab!, mockEvent);

		// Check that preventDefault was NOT called
		expect(mockEvent.preventDefault).not.toHaveBeenCalled();
	});
});
