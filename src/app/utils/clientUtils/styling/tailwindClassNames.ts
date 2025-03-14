// README
// Here I store the tailwind class names for custom component's I've made
// This is to prevent typos etc
// These class names come from globals.css. If you change one of those names there, you still have to manually change them here
// But at least this way there's a single source of truth.

/**I made the type TailwindClassNames use string literal types because it makes intellisense better. You can see the class names just by hovering, without having to go back to globals.css */
type TailwindClassNames = {
	mileageCalcForm: {
		FORM_SECTION: "mileage-calc-form-section";
		FORM_SECTION_HEADER: "mileage-calc-form-section-header";
		FORM_SECTION_CONTENT: "mileage-calc-form-section-content";
		FORM_NUMBER_INPUT: "mileage-calc-form-input-base mileage-calc-form-number-input";
		FORM_TEXT_INPUT: "mileage-calc-form-input-base mileage-calc-form-text-input";
		FORM_ERROR_MESSAGE: "mileage-calc-form-error-message";
		FORM_INPUT_LABEL: "mileage-calc-form-input-label";
		REQUIRED_ASTERISK: "mileage-calc-form-required-asterisk";
	};
};

/**Single source of truth for custom tailwind component class names in globals.css
 *
 * Is this giving you errors? This class doesn't exist or styling doesn't show up? Make sure the class name corresponds with the custom component defined in globals.css
 */
const tailWindClassNames: TailwindClassNames = {
	mileageCalcForm: {
		// /calculator/page.tsx and its associated components/utils
		FORM_SECTION: "mileage-calc-form-section",
		FORM_SECTION_HEADER: "mileage-calc-form-section-header",
		FORM_SECTION_CONTENT: "mileage-calc-form-section-content",
		// Combines two components from globals.css
		FORM_NUMBER_INPUT:
			"mileage-calc-form-input-base mileage-calc-form-number-input",
		// Combines two components from globals.css
		FORM_TEXT_INPUT:
			"mileage-calc-form-input-base mileage-calc-form-text-input",
		FORM_ERROR_MESSAGE: "mileage-calc-form-error-message",
		FORM_INPUT_LABEL: "mileage-calc-form-input-label",
		/**The asterisk indicating a field is required */
		REQUIRED_ASTERISK: "mileage-calc-form-required-asterisk",
	},
};

export default tailWindClassNames;
