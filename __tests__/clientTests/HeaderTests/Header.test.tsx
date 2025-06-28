// _______________________________________________________________
// This is (obviously) tests for Header.tsx
// _______________________________________________________________

import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { Header } from "@/components/Header/Header";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// The signOut function was making the tests fail
// signOut isn't used in our unit tests so we can mock it to oblivion
jest.mock("@supabase/ssr", () => ({
	createBrowserClient: jest.fn(() => ({
		auth: {
			signOut: jest.fn(() => Promise.resolve({ error: null })),
		},
	})),
}));

jest.mock("isows", () => ({}));

const renderHeader = () => {
	return render(
		<TestReduxStore>
			<Header />
		</TestReduxStore>
	);
};

describe("Header.tsx", () => {
	describe("Basic Rendering", () => {
		it("Renders without errors", () => {
			renderHeader();
		});

		it("Renders the title", () => {
			renderHeader();

			const logoText = screen.getByText("MileageBuddy");
			expect(logoText).toBeVisible();
		});
	});

	describe("Navigation Elements", () => {
		it("Renders NavLinks component", () => {
			renderHeader();

			// NavLinks should be present
			const navLinks = screen.getByRole("navigation", { hidden: true });
			expect(navLinks).toBeInTheDocument();
		});
	});

	describe("User Interaction", () => {
		it("Shows profile dropdown when profile button is clicked", () => {
			// Render with logged-in user
			renderHeader();

			// Find profile button
			const profileButton = screen.getByRole("button", { name: /profile/i });

			// Click to open dropdown
			fireEvent.click(profileButton);

			// Email should now be visible in dropdown
			const emailAfterClick = screen.getByText("testuser@example.com");
			expect(emailAfterClick).toBeVisible();
		});

		it("Hides profile dropdown when clicked outside", () => {
			renderHeader();

			// Find and click profile button to open dropdown
			const profileButton = screen.getByRole("button", { name: /profile/i });
			fireEvent.click(profileButton);

			// Email should be visible
			const userEmail = screen.getByText("testuser@example.com");
			expect(userEmail).toBeVisible();

			// Click outside (the header element)
			fireEvent.mouseDown(document.body);

			// Email should now be hidden
			expect(userEmail).not.toBeVisible();
		});
	});

	describe("Snapshot tests", () => {
		it("matches snapshot of default state from 4.30.2025", () => {
			const { container } = renderHeader();
			expect(container).toMatchSnapshot();
		});

		it("matches snapshot with profile dropdown open from 4.30.2025", () => {
			const { container } = renderHeader();

			// Find profile button
			const profileButton = screen.getByRole("button", { name: /profile/i });

			// Click to open dropdown
			fireEvent.click(profileButton);

			expect(container).toMatchSnapshot();
		});
	});
});
