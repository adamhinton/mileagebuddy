/* eslint-disable @typescript-eslint/no-unused-vars */
// _______________________________________________________
// In this form, the user creates or edits a Vehicle based on the mode props passed in
// The form is validated using zod and the schema is passed in as a prop
// See VehicleCreationOrEditForm for more details
// _______________________________________________________

"use client";

import { useAppSelector } from "@/redux/hooks";
import VehicleCreationOrEditForm from "./CalculatorFormComponents/VehicleCreationForm";
import { VehicleToBePostedSchema } from "../utils/server/types/VehicleTypes/POSTVehicleTypes";
import { VehicleSchemaForPATCH } from "../utils/server/types/VehicleTypes/PATCHVehicleTypes";

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validation. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

// TODO:
// Let non-authenticated users save vehicles to localStorage

// Stretch: optimistic UI updates

const CalculatorPage = () => {
	const usersVehicles = useAppSelector((state) => state.vehicles);
	const firstVehicle = usersVehicles[0];
	console.log("firstVehicle:", firstVehicle);

	return (
		<section className="min-h-screen p-4 sm:p-6 md:p-8 bg-neutral-50 dark:bg-neutral-900">
			<div className="max-w-5xl mx-auto">
				<header className="mb-6">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
						Vehicle Calculator
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Create or edit your vehicle details to calculate ownership costs
					</p>
				</header>

				{/* <VehicleCreationOrEditForm
					mode="newVehicle"
					schema={VehicleToBePostedSchema}
				/> */}
				<VehicleCreationOrEditForm
					mode="editVehicle"
					schema={VehicleSchemaForPATCH}
					vehicleToEdit={firstVehicle}
				/>
			</div>
		</section>
	);
};

export default CalculatorPage;
