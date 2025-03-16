// README
// This is a bulleted list of (maximum three) errors at the top of the form
// Takes in the errors object from react-hook-form and displays the first three errors
// It only shows up once user hits Submit
// It just displays the name of the relevant form section; clicking on it scrolls the user to that section

// TODO dynamically update errors when they go away

import { FieldErrors } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";
import { VehiclePATCHorPOST } from "./VehicleCreationForm";

type Props = {
	errors: FieldErrors<VehiclePATCHorPOST>;
};

const FormErrorSummary = (props: Props) => {
	const { errors } = props;

	console.log("errors in FormErrorSummary:", errors);

	if (!errors) return null;

	const errorLinks = extractErrorMessages(errors);

	if (errorLinks.length === 0) return null;

	// This displays the names of the first three sections that have errors
	// Clicking on the name will scroll the user to that section
	return (
		<section className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 overflow-hidden transition-all">
			<div className="p-4 flex items-start">
				<div className="flex-shrink-0 mt-0.5">
					<FormErrorMessage errorMessage="" />
				</div>
				<div className="ml-3 w-full">
					<h2 className="text-sm font-medium text-red-800 dark:text-red-300">
						Please fix the following issues before continuing:
					</h2>
					<ul className="mt-2 text-sm text-red-700 dark:text-red-400 space-y-1 list-none">
						{errorLinks.map(({ key, path, message }) => (
							<li key={key} className="flex items-start">
								<span className="mr-2">•</span>
								<a
									href={`#${path}`}
									className="hover:text-red-800 dark:hover:text-red-300 hover:underline focus:outline-none focus:underline focus:text-red-800 dark:focus:text-red-300 transition-colors"
									onClick={(e) => {
										e.preventDefault();

										// Get all section IDs
										const allSectionIds = [
											"vehicleData",
											"gasVehicleData",
											"electricVehicleData",
											"purchaseAndSales",
											"usage",
											"fixedCosts",
											"yearlyMaintenanceCosts",
											"variableCosts",
										];

										// Get error section IDs
										const errorSectionIds = errorLinks.map((link) => link.path);

										// First collapse all non-error sections
										allSectionIds.forEach((id) => {
											if (!errorSectionIds.includes(id)) {
												const sectionElement = document.getElementById(id);
												if (sectionElement) {
													const button = sectionElement.querySelector("button");
													if (
														button &&
														button.getAttribute("aria-expanded") === "true"
													) {
														button.click(); // Collapse this section
													}
												}
											}
										});

										// Now handle the clicked error section
										const element = document.getElementById(path);
										if (element) {
											element.focus();
											element.scrollIntoView({
												behavior: "smooth",
												block: "center",
											});

											// If section is collapsed, let's open it
											const button = element.querySelector("button");
											if (
												button &&
												button.getAttribute("aria-expanded") === "false"
											) {
												button.click(); // Expand this section
											}
										}
									}}
								>
									<span className="font-medium">{message}</span> section has
									errors
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default FormErrorSummary;

// Get names of first three form sections that have errors
const extractErrorMessages = (errors: FieldErrors<VehiclePATCHorPOST>) => {
	const errorLinks: { key: string; path: string; message: string }[] = [];

	// Skip these top-level fields, these errors are not relevant to the user
	// Actually, if these errors happen something has gone seriously wrong. Good luck
	const skipFields = ["userid", "root", "type"];

	// This code block adds the first three sections with errors to the errorLinks array
	// It also skips the fields in skipFields
	Object.entries(errors).forEach(([key, value]) => {
		if (skipFields.includes(key)) return;

		// If this is a nested object with sub-errors
		if (value && typeof value === "object") {
			// Get a user-friendly section name based on the object type
			let sectionName = key;

			// Map the camelCase keys to more readable names
			// TODO hacky solution, get these names in a better way. They are already defined in the zod schema
			switch (key) {
				case "vehicleData":
					sectionName = "Vehicle Data";
					break;
				case "gasVehicleData":
					sectionName = "Gas Vehicle Data";
					break;
				case "electricVehicleData":
					sectionName = "Electric Vehicle Data";
					break;
				case "purchaseAndSales":
					sectionName = "Purchase and Sales";
					break;
				case "usage":
					sectionName = "Usage";
					break;
				case "fixedCosts":
					sectionName = "Fixed Costs";
					break;
				case "yearlyMaintenanceCosts":
					sectionName = "Yearly Maintenance Costs";
					break;
				case "variableCosts":
					sectionName = "Variable Costs";
					break;
			}

			// Add the section to our error links
			errorLinks.push({
				key,
				path: key,
				message: sectionName,
			});
		}

		// Stop once we have 3 error links
		if (errorLinks.length >= 3) {
			return;
		}
	});

	return errorLinks.slice(0, 3); // Ensure we return maximum 3 error links
};
