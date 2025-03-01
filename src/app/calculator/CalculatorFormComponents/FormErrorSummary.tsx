// README
// This is a bulleted list of (maximum three) errors at the top of the form
// Takes in the errors object from react-hook-form and displays the first three errors
// It only shows up once user hits Submit
// It just displays the name of the relevant form section; clicking on it scrolls the user to that section

// TODO dynamically update errors when they go away

import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { FieldErrors } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";

type Props = {
	errors: FieldErrors<Vehicle_For_db_POST>;
};

const FormErrorSummary = (props: Props) => {
	const { errors } = props;

	console.log("errors in FormErrorSummary:", errors);

	if (!errors) return null;

	const errorLinks = extractErrorMessages(errors);

	console.log("errorLinks in FormErrorSummary:", errorLinks);

	// This displays the names of the first three sections that have errors
	// Clicking on the name will scroll the user to that section
	// TODO expand the relevant section on click (or on submit) --- WIP
	return (
		<section className="mb-4 p-2 border border-red-400 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
			<h5 className="text-red-600 dark:text-red-400 mb-1">
				Please correct the following errors:
			</h5>
			<ul className="list-disc pl-5 space-y-1">
				{errorLinks.map(({ key, path, message }) => (
					<li key={key} className="text-sm">
						<a
							href={`#${path}`}
							className="text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary"
							onClick={(e) => {
								e.preventDefault();
								const element = document.getElementById(path);
								if (element) {
									element.focus();
									element.scrollIntoView({
										behavior: "smooth",
										block: "center",
									});
								}
							}}
						>
							<FormErrorMessage errorMessage={message} />
						</a>
					</li>
				))}
			</ul>
		</section>
	);
};

export default FormErrorSummary;

// Get names of first three form sections that have errors
const extractErrorMessages = (errors: FieldErrors<Vehicle_For_db_POST>) => {
	const errorLinks: { key: string; path: string; message: string }[] = [];

	// Skip these top-level fields, these errors are not relevant to the user
	// Actually, if these errors happen something has gone seriously wrong. Good
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
