import { calculateCarCostMain } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";

describe("calculateCarCostMain", () => {
	it("Runs without errors", () => {
		// TODO: Better fake Vehicle here, but this test is just that it doesn't cause a crash
		calculateCarCostMain({} as unknown as Vehicle);
	});
});
