// _______________________________________________________________
// This is (obviously) tests for ProfileDropdown.tsx
// The component is pretty simple, so not much to test here
// _______________________________________________________________

import ProfileDropdown from "@/components/Header/HeaderSubComponents/ProfileDropdown";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const createMockProps = (overrides = {}) => ({
	user: { id: "test-user-id", email: "test@example.com", isDarkMode: false },
	isProfileDropdownOpen: false,
	setIsProfileDropdownOpen: jest.fn(),
	handleSignOut: jest.fn(),
	profileDropdownRef: { current: document.createElement("div") },
	...overrides,
});

describe("ProfileDropdown.tsx", () => {
	it("Renders without errors", () => {
		const mockProps = createMockProps();
		render(<ProfileDropdown {...mockProps} />);
	});

	describe("Dropdown Behavior", () => {
		it("Does not show dropdown menu when closed", () => {
			const mockProps = createMockProps({ isProfileDropdownOpen: false });
			const { queryByText } = render(<ProfileDropdown {...mockProps} />);

			const emailElement = queryByText("test@example.com");
			expect(emailElement).not.toBeInTheDocument();

			// The Sign Out button should not be visible
			const signOutButton = queryByText(/sign out/i);
			expect(signOutButton).not.toBeInTheDocument();
		});

		it("Shows dropdown menu when open", () => {
			const mockProps = createMockProps({ isProfileDropdownOpen: true });
			const { getByText } = render(<ProfileDropdown {...mockProps} />);

			const dropdownMenu =
				getByText("test@example.com").closest("div.absolute");
			expect(dropdownMenu).toBeInTheDocument();
			expect(dropdownMenu).toBeVisible();
		});

		it("Displays correct user email in the dropdown", () => {
			const customEmail = "custom.user@test.com";
			const mockProps = createMockProps({
				isProfileDropdownOpen: true,
				user: { id: "test-id", email: customEmail, isDarkMode: false },
			});

			const { getByText } = render(<ProfileDropdown {...mockProps} />);

			const emailElement = getByText(customEmail);
			expect(emailElement).toBeInTheDocument();
			expect(emailElement).toBeVisible();
		});
	});

	describe("Interaction", () => {
		it("Toggles dropdown when profile button is clicked", () => {
			const setIsProfileDropdownOpenMock = jest.fn();
			const mockProps = createMockProps({
				isProfileDropdownOpen: false,
				setIsProfileDropdownOpen: setIsProfileDropdownOpenMock,
			});

			render(<ProfileDropdown {...mockProps} />);

			const profileButton = screen.getByTestId("profile-icon");
			fireEvent.click(profileButton);

			expect(setIsProfileDropdownOpenMock).toHaveBeenCalledWith(true);

			const openMockProps = createMockProps({
				isProfileDropdownOpen: true,
				setIsProfileDropdownOpen: setIsProfileDropdownOpenMock,
			});

			setIsProfileDropdownOpenMock.mockReset();

			render(<ProfileDropdown {...openMockProps} />);

			fireEvent.click(profileButton);
		});

		it("Calls handleSignOut when sign out button is clicked", () => {
			// Setup with dropdown open
			const handleSignOutMock = jest.fn();
			const mockProps = createMockProps({
				isProfileDropdownOpen: true,
				handleSignOut: handleSignOutMock,
			});

			const { getByRole } = render(<ProfileDropdown {...mockProps} />);

			const signOutButton = getByRole("button", { name: /sign out/i });
			fireEvent.click(signOutButton);

			// Assert that handleSignOut was called
			expect(handleSignOutMock).toHaveBeenCalled();
		});
	});
});
