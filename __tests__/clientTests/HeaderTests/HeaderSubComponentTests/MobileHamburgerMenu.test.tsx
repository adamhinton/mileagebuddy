// ________________________________________________________________________
// This is (obviously) tests for MobileHamburgerMenu.tsx
// The component is pretty simple, so not much to test here
// ________________________________________________________________________

import MobileHamburgerMenu from "@/components/Header/HeaderSubComponents/MobileHamburgerMenu";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// mock setIsMobileMenuOpen

describe("MobileHamburgerMenu.tsx", () => {
	it("Renders without errors with menu closed", () => {
		render(
			<MobileHamburgerMenu
				isMobileMenuOpen={false}
				setIsMobileMenuOpen={jest.fn()}
			/>
		);
	});

	describe("Component Display States", () => {
		it("displays hamburger icon when menu is closed", () => {
			const { container } = render(
				<MobileHamburgerMenu
					isMobileMenuOpen={false}
					setIsMobileMenuOpen={jest.fn()}
				/>
			);

			// Check that the hamburger icon path is present
			const hamburgerPath = container.querySelector(
				'path[d="M4 6h16M4 12h16M4 18h16"]'
			);
			expect(hamburgerPath).toBeInTheDocument();

			// Make sure X icon is not present
			const xPath = container.querySelector('path[d="M6 18L18 6M6 6l12 12"]');
			expect(xPath).not.toBeInTheDocument();
		});

		it("displays X icon when menu is open", () => {
			const { container } = render(
				<MobileHamburgerMenu
					isMobileMenuOpen={true}
					setIsMobileMenuOpen={jest.fn()}
				/>
			);

			// Check that the X icon path is present
			const xPath = container.querySelector('path[d="M6 18L18 6M6 6l12 12"]');
			expect(xPath).toBeInTheDocument();

			// Make sure hamburger icon is not present
			const hamburgerPath = container.querySelector(
				'path[d="M4 6h16M4 12h16M4 18h16"]'
			);
			expect(hamburgerPath).not.toBeInTheDocument();
		});
	});
	it("Renders without errors with menu open", () => {
		render(
			<MobileHamburgerMenu
				isMobileMenuOpen={true}
				setIsMobileMenuOpen={jest.fn()}
			/>
		);
	});

	it("Calls setIsMobileMenuOpen when clicked", () => {
		const setIsMobileMenuOpenMock = jest.fn();
		const { getByLabelText } = render(
			<MobileHamburgerMenu
				isMobileMenuOpen={false}
				setIsMobileMenuOpen={setIsMobileMenuOpenMock}
			/>
		);

		const button = getByLabelText("Toggle mobile menu");
		button.click();

		expect(setIsMobileMenuOpenMock).toHaveBeenCalledWith(true);
	});

	it("Calls setIsMobileMenuOpen when clicked again", () => {
		const setIsMobileMenuOpenMock = jest.fn();
		const { getByLabelText } = render(
			<MobileHamburgerMenu
				isMobileMenuOpen={true}
				setIsMobileMenuOpen={setIsMobileMenuOpenMock}
			/>
		);

		const button = getByLabelText("Toggle mobile menu");
		button.click();

		expect(setIsMobileMenuOpenMock).toHaveBeenCalledWith(false);
	});

	describe("MobileHamburgerMenu Screenshots", () => {
		it("matches snapshot when closed", () => {
			const { asFragment } = render(
				<MobileHamburgerMenu
					isMobileMenuOpen={false}
					setIsMobileMenuOpen={jest.fn()}
				/>
			);
			expect(asFragment()).toMatchSnapshot();
		});

		it("matches snapshot when open", () => {
			const { asFragment } = render(
				<MobileHamburgerMenu
					isMobileMenuOpen={true}
					setIsMobileMenuOpen={jest.fn()}
				/>
			);
			expect(asFragment()).toMatchSnapshot();
		});
	});
});
