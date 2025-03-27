"use client";

// __________________________________________
// This is the edit page for Vehicles
// User clicks the edit icon in Dashboard or Sidebar and is taken here
// URL Format: if vehicle's db ID is 123456, then the URL is /calculator/edit/123456
// Security: Middleware checks that the vehicle with the specified id belongs to the logged in user and deflects from thsi route if not. Submit function also checks that the vehicle belongs to the logged in user.
// Note on security: These authentication checks aren't performed for non-authenticated user because those vehicles are just saved to localStorage.
// __________________________________________

import { useAppSelector } from "@/redux/hooks";
import VehicleCreationOrEditForm from "../../CalculatorFormComponents/VehicleCreationForm";
import { VehicleSchemaForPATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import { use } from "react";

const EditVehiclePage = ({
	params,
}: {
	params: Promise<{ vehicleId: string }>;
}) => {
	const { vehicleId } = use(params);

	const vehicleToEdit = useAppSelector((state) =>
		state.vehicles.find((vehicle) => vehicle.id === Number(vehicleId))
	);

	if (!vehicleToEdit) {
		throw new Error("Vehicle not found");
	}

	return (
		<VehicleCreationOrEditForm
			vehicleToEdit={vehicleToEdit}
			mode="editVehicle"
			schema={VehicleSchemaForPATCH}
		></VehicleCreationOrEditForm>
	);
};

export default EditVehiclePage;
