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
		FORM_ERROR_ICON: "mileage-calc-form-error-icon";
		FORM_INPUT_LABEL: "mileage-calc-form-input-label";
		REQUIRED_ASTERISK: "mileage-calc-form-required-asterisk";
		FORM_NUMBER_FIELD: "mileage-calc-form-number-field";
		FORM_NUMBER_FIELD_ERROR: "mileage-calc-form-number-field-error";
		FORM_TEXT_FIELD: "mileage-calc-form-text-field";
		FORM_TEXT_FIELD_ERROR: "mileage-calc-form-text-field-error";
		FORM_LABEL: "mileage-calc-form-label";
		SECTION: {
			CONTAINER: "mileage-calc-form-section-container";
			CONTAINER_ACTIVE: "mileage-calc-form-section-container-active";
			CONTAINER_INACTIVE: "mileage-calc-form-section-container-inactive";
			CONTAINER_FIRST_ACTIVE: "mileage-calc-form-section-container-first-active";
			BUTTON: "mileage-calc-form-section-button";
			BUTTON_ACTIVE: "mileage-calc-form-section-button-active";
			BUTTON_INACTIVE: "mileage-calc-form-section-button-inactive";
			TITLE: "mileage-calc-form-section-title";
			TITLE_ACTIVE: "mileage-calc-form-section-title-active";
			TITLE_INACTIVE: "mileage-calc-form-section-title-inactive";
			BADGE: "mileage-calc-form-section-badge";
			BADGE_ACTIVE: "mileage-calc-form-section-badge-active";
			BADGE_INACTIVE: "mileage-calc-form-section-badge-inactive";
			CHEVRON: "mileage-calc-form-section-chevron";
			CHEVRON_ACTIVE: "mileage-calc-form-section-chevron-active";
			CONTENT_WRAPPER: "mileage-calc-form-section-content-wrapper";
			CONTENT_WRAPPER_ACTIVE: "mileage-calc-form-section-content-wrapper-active";
			CONTENT_WRAPPER_INACTIVE: "mileage-calc-form-section-content-wrapper-inactive";
			CONTENT_INNER: "mileage-calc-form-section-content-inner";
			FOOTER: "mileage-calc-form-section-footer";
			NEXT_BUTTON: "mileage-calc-form-next-button";
		};
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
		FORM_ERROR_ICON: "mileage-calc-form-error-icon",
		FORM_INPUT_LABEL: "mileage-calc-form-input-label",
		/**The asterisk indicating a field is required */
		REQUIRED_ASTERISK: "mileage-calc-form-required-asterisk",
		// Form input fields styling
		FORM_NUMBER_FIELD: "mileage-calc-form-number-field",
		FORM_NUMBER_FIELD_ERROR: "mileage-calc-form-number-field-error",
		FORM_TEXT_FIELD: "mileage-calc-form-text-field",
		FORM_TEXT_FIELD_ERROR: "mileage-calc-form-text-field-error",
		FORM_LABEL: "mileage-calc-form-label",
		SECTION: {
			CONTAINER: "mileage-calc-form-section-container",
			CONTAINER_ACTIVE: "mileage-calc-form-section-container-active",
			CONTAINER_INACTIVE: "mileage-calc-form-section-container-inactive",
			CONTAINER_FIRST_ACTIVE:
				"mileage-calc-form-section-container-first-active",
			BUTTON: "mileage-calc-form-section-button",
			BUTTON_ACTIVE: "mileage-calc-form-section-button-active",
			BUTTON_INACTIVE: "mileage-calc-form-section-button-inactive",
			TITLE: "mileage-calc-form-section-title",
			TITLE_ACTIVE: "mileage-calc-form-section-title-active",
			TITLE_INACTIVE: "mileage-calc-form-section-title-inactive",
			BADGE: "mileage-calc-form-section-badge",
			BADGE_ACTIVE: "mileage-calc-form-section-badge-active",
			BADGE_INACTIVE: "mileage-calc-form-section-badge-inactive",
			CHEVRON: "mileage-calc-form-section-chevron",
			CHEVRON_ACTIVE: "mileage-calc-form-section-chevron-active",
			CONTENT_WRAPPER: "mileage-calc-form-section-content-wrapper",
			CONTENT_WRAPPER_ACTIVE:
				"mileage-calc-form-section-content-wrapper-active",
			CONTENT_WRAPPER_INACTIVE:
				"mileage-calc-form-section-content-wrapper-inactive",
			CONTENT_INNER: "mileage-calc-form-section-content-inner",
			FOOTER: "mileage-calc-form-section-footer",
			NEXT_BUTTON: "mileage-calc-form-next-button",
		},
	},
};

export default tailWindClassNames;
