// README
// Here I store the tailwind class names for custom components I've made
// This is to prevent typos etc
// These class names come from globals.css. If you change one of those names there, you still have to manually change them here
// But at least this way there's a single source of truth.

/**I made the type TailwindClassNames use string literal types because it makes intellisense better. You can see the class names just by hovering, without having to go back to globals.css */
type TailwindClassNames = {
	layout: {
		CONTAINER: "mileage-calc-container";
		CARD: "mileage-calc-card";
	};
	components: {
		DRAG_HANDLE: "mileage-calc-drag-handle";
		DRAG_HANDLE_ICON: "mileage-calc-drag-handle-icon";
		VEHICLE_ICON: "mileage-calc-vehicle-icon";
		VEHICLE_ICON_ELECTRIC: "mileage-calc-vehicle-icon--electric";
		VEHICLE_ICON_GAS: "mileage-calc-vehicle-icon--gas";
		VEHICLE_ICON_SVG: "mileage-calc-vehicle-icon-svg";
		COST_FIGURE: "mileage-calc-cost-figure";
		COST_FIGURE_PRIMARY: "mileage-calc-cost-figure--primary";
		COST_FIGURE_SECONDARY: "mileage-calc-cost-figure--secondary";
		COST_CAPTION: "mileage-calc-cost-caption";
		TOOLTIP_ICON: "mileage-calc-tooltip-icon";
		COST_VALUE: "mileage-calc-cost-value";
		COST_VALUE_PRIMARY: "mileage-calc-cost-value--primary";
		COST_VALUE_SECONDARY: "mileage-calc-cost-value--secondary";
	};
	navigation: {
		TABS_CONTAINER: "mileage-calc-tabs-container";
		TABS_INNER: "mileage-calc-tabs-inner";
		TABS_LIST: "mileage-calc-tabs-list";
		TABS_ITEM: "mileage-calc-tabs-item";
		TABS_LINK: "mileage-calc-tabs-link";
		TABS_LINK_ACTIVE: "mileage-calc-tabs-link--active";
		TABS_LINK_INACTIVE: "mileage-calc-tabs-link--inactive";
	};
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
		FORM_HEADER: "mileage-calc-form-header";
		FORM_TITLE: "mileage-calc-form-title";
		FORM_FOOTER: "mileage-calc-form-footer";
		RADIO_GROUP_CONTAINER: "mileage-calc-form-radio-group-container";
		RADIO_GROUP_TITLE: "mileage-calc-form-radio-group-title";
		RADIO_GROUP: "mileage-calc-form-radio-group";
		RADIO_LABEL: "mileage-calc-form-radio-label";
		RADIO_LABEL_SELECTED: "mileage-calc-form-radio-label--selected";
		RADIO_INPUT: "mileage-calc-form-radio-input";
		RADIO_TEXT: "mileage-calc-form-radio-text";
		RADIO_ERROR: "mileage-calc-form-radio-error";
		SECTION: {
			CONTAINER: "mileage-calc-form-section-container";
			CONTAINER_ACTIVE: "mileage-calc-form-section-container-active";
			CONTAINER_INACTIVE: "mileage-calc-form-section-container-inactive";
			CONTAINER_FIRST_ACTIVE: "mileage-calc-form-section-container-first-active";
			BUTTON: "mileage-calc-form-section-button";
			BUTTON_ACTIVE: "mileage-calc-form-section-button-active";
			BUTTON_INACTIVE: "mileage-calc-form-section-button-inactive";
			BUTTON_INNER: "mileage-calc-form-section-button-inner";
			TITLE: "mileage-calc-form-section-title";
			TITLE_ACTIVE: "mileage-calc-form-section-title-active";
			TITLE_INACTIVE: "mileage-calc-form-section-title-inactive";
			BADGE: "mileage-calc-form-section-badge";
			BADGE_ACTIVE: "mileage-calc-form-section-badge-active";
			BADGE_INACTIVE: "mileage-calc-form-section-badge-inactive";
			COMPLETE_ICON_WRAPPER: "mileage-calc-form-section-complete-icon-wrapper";
			COMPLETE_ICON: "mileage-calc-form-section-complete-icon";
			CHEVRON_WRAPPER: "mileage-calc-form-section-chevron-wrapper";
			CHEVRON: "mileage-calc-form-section-chevron";
			CHEVRON_ACTIVE: "mileage-calc-form-section-chevron-active";
			CONTENT_WRAPPER: "mileage-calc-form-section-content-wrapper";
			CONTENT_WRAPPER_ACTIVE: "mileage-calc-form-section-content-wrapper-active";
			CONTENT_WRAPPER_INACTIVE: "mileage-calc-form-section-content-wrapper-inactive";
			CONTENT_INNER: "mileage-calc-form-section-content-inner";
			FOOTER: "mileage-calc-form-section-footer";
			NEXT_BUTTON: "mileage-calc-form-next-button";
			NEXT_BUTTON_INNER: "mileage-calc-form-next-button-inner";
		};
		TYPE_SELECTOR: {
			CONTAINER: "mileage-calc-form-type-selector-container";
			HEADING: "mileage-calc-form-type-selector-heading";
			OPTIONS: "mileage-calc-form-type-selector-options";
			LABEL: "mileage-calc-form-type-selector-label";
			LABEL_ACTIVE: "mileage-calc-form-type-selector-label--active";
			LABEL_INACTIVE: "mileage-calc-form-type-selector-label--inactive";
			INPUT: "mileage-calc-form-type-selector-input";
			TEXT: "mileage-calc-form-type-selector-text";
		};
	};
};

/**Single source of truth for custom tailwind component class names in globals.css
 *
 * Is this giving you errors? This class doesn't exist or styling doesn't show up? Make sure the class name corresponds with the custom component defined in globals.css
 */
const tailWindClassNames: TailwindClassNames = {
	layout: {
		CONTAINER: "mileage-calc-container",
		CARD: "mileage-calc-card",
	},
	components: {
		DRAG_HANDLE: "mileage-calc-drag-handle",
		DRAG_HANDLE_ICON: "mileage-calc-drag-handle-icon",
		VEHICLE_ICON: "mileage-calc-vehicle-icon",
		VEHICLE_ICON_ELECTRIC: "mileage-calc-vehicle-icon--electric",
		VEHICLE_ICON_GAS: "mileage-calc-vehicle-icon--gas",
		VEHICLE_ICON_SVG: "mileage-calc-vehicle-icon-svg",
		COST_FIGURE: "mileage-calc-cost-figure",
		COST_FIGURE_PRIMARY: "mileage-calc-cost-figure--primary",
		COST_FIGURE_SECONDARY: "mileage-calc-cost-figure--secondary",
		COST_CAPTION: "mileage-calc-cost-caption",
		TOOLTIP_ICON: "mileage-calc-tooltip-icon",
		COST_VALUE: "mileage-calc-cost-value",
		COST_VALUE_PRIMARY: "mileage-calc-cost-value--primary",
		COST_VALUE_SECONDARY: "mileage-calc-cost-value--secondary",
	},
	navigation: {
		TABS_CONTAINER: "mileage-calc-tabs-container",
		TABS_INNER: "mileage-calc-tabs-inner",
		TABS_LIST: "mileage-calc-tabs-list",
		TABS_ITEM: "mileage-calc-tabs-item",
		TABS_LINK: "mileage-calc-tabs-link",
		TABS_LINK_ACTIVE: "mileage-calc-tabs-link--active",
		TABS_LINK_INACTIVE: "mileage-calc-tabs-link--inactive",
	},
	mileageCalcForm: {
		FORM_SECTION: "mileage-calc-form-section",
		FORM_SECTION_HEADER: "mileage-calc-form-section-header",
		FORM_SECTION_CONTENT: "mileage-calc-form-section-content",
		FORM_NUMBER_INPUT:
			"mileage-calc-form-input-base mileage-calc-form-number-input",
		FORM_TEXT_INPUT:
			"mileage-calc-form-input-base mileage-calc-form-text-input",
		FORM_ERROR_MESSAGE: "mileage-calc-form-error-message",
		FORM_ERROR_ICON: "mileage-calc-form-error-icon",
		FORM_INPUT_LABEL: "mileage-calc-form-input-label",
		REQUIRED_ASTERISK: "mileage-calc-form-required-asterisk",
		FORM_NUMBER_FIELD: "mileage-calc-form-number-field",
		FORM_NUMBER_FIELD_ERROR: "mileage-calc-form-number-field-error",
		FORM_TEXT_FIELD: "mileage-calc-form-text-field",
		FORM_TEXT_FIELD_ERROR: "mileage-calc-form-text-field-error",
		FORM_LABEL: "mileage-calc-form-label",
		FORM_HEADER: "mileage-calc-form-header",
		FORM_TITLE: "mileage-calc-form-title",
		FORM_FOOTER: "mileage-calc-form-footer",
		RADIO_GROUP_CONTAINER: "mileage-calc-form-radio-group-container",
		RADIO_GROUP_TITLE: "mileage-calc-form-radio-group-title",
		RADIO_GROUP: "mileage-calc-form-radio-group",
		RADIO_LABEL: "mileage-calc-form-radio-label",
		RADIO_LABEL_SELECTED: "mileage-calc-form-radio-label--selected",
		RADIO_INPUT: "mileage-calc-form-radio-input",
		RADIO_TEXT: "mileage-calc-form-radio-text",
		RADIO_ERROR: "mileage-calc-form-radio-error",
		SECTION: {
			CONTAINER: "mileage-calc-form-section-container",
			CONTAINER_ACTIVE: "mileage-calc-form-section-container-active",
			CONTAINER_INACTIVE: "mileage-calc-form-section-container-inactive",
			CONTAINER_FIRST_ACTIVE:
				"mileage-calc-form-section-container-first-active",
			BUTTON: "mileage-calc-form-section-button",
			BUTTON_ACTIVE: "mileage-calc-form-section-button-active",
			BUTTON_INACTIVE: "mileage-calc-form-section-button-inactive",
			BUTTON_INNER: "mileage-calc-form-section-button-inner",
			TITLE: "mileage-calc-form-section-title",
			TITLE_ACTIVE: "mileage-calc-form-section-title-active",
			TITLE_INACTIVE: "mileage-calc-form-section-title-inactive",
			BADGE: "mileage-calc-form-section-badge",
			BADGE_ACTIVE: "mileage-calc-form-section-badge-active",
			BADGE_INACTIVE: "mileage-calc-form-section-badge-inactive",
			COMPLETE_ICON_WRAPPER: "mileage-calc-form-section-complete-icon-wrapper",
			COMPLETE_ICON: "mileage-calc-form-section-complete-icon",
			CHEVRON_WRAPPER: "mileage-calc-form-section-chevron-wrapper",
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
			NEXT_BUTTON_INNER: "mileage-calc-form-next-button-inner",
		},
		TYPE_SELECTOR: {
			CONTAINER: "mileage-calc-form-type-selector-container",
			HEADING: "mileage-calc-form-type-selector-heading",
			OPTIONS: "mileage-calc-form-type-selector-options",
			LABEL: "mileage-calc-form-type-selector-label",
			LABEL_ACTIVE: "mileage-calc-form-type-selector-label--active",
			LABEL_INACTIVE: "mileage-calc-form-type-selector-label--inactive",
			INPUT: "mileage-calc-form-type-selector-input",
			TEXT: "mileage-calc-form-type-selector-text",
		},
	},
};

export default tailWindClassNames;
