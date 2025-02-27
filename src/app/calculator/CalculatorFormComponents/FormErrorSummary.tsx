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

	if (!errors) return null;

	return (
		<div>
			<p>Errors:</p>
		</div>
	);
};
export default FormErrorSummary;
