// README
// This is a bulleted list of (maximum three) errors at the top of the form
// Takes in the errors object from react-hook-form and displays the first three errors
// It only shows up once user hits Submit

import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { FieldErrors } from "react-hook-form";

type Props = {
	errors: FieldErrors<Vehicle_For_db_POST>;
};

const FormErrorSummary = (props: Props) => {
	const { errors } = props;

	console.log("errors in FormErrorSummary:", errors);

	if (!errors) return null;

	// Extract actual error messages from the nested errors structure
	const extractErrorMessages = () => {
		const errorLinks: { key: string; path: string; message: string }[] = [];

		// Skip these top-level fields
		const skipFields = ["userid", "root", "type"];

		// Process each top-level error field
		Object.entries(errors).forEach(([key, value]) => {
			if (skipFields.includes(key)) return;

			// If this is a nested object with sub-errors
			if (value && typeof value === "object") {
				// Get a user-friendly section name based on the object type
				let sectionName = key;

				// Map the camelCase keys to more readable names
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
	const errorLinks = extractErrorMessages();

	console.log("errorLinks in FormErrorSummary:", errorLinks);

	return (
		<div className="error-summary">
			<h3>Please correct the following errors:</h3>
			<ul>
				{errorLinks.map(({ key, path, message }) => (
					<li key={key}>
						<a
							href={`#${path}`}
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
							{message}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};
export default FormErrorSummary;
