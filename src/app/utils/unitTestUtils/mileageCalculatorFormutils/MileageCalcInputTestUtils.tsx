// README
// This is utils for testing the MileageCalcFormTextInput and MileageCalcFormNumInput components
// They're very similar, so share much utils logic
// This is for mocking relevant functions, and creating a wrapper component for testing

import MileageCalcFormNumInput from "@/app/calculator/CalculatorFormComponents/MileageCalcFormNumberInput";
import MileageCalcFormTextInput from "@/app/calculator/CalculatorFormComponents/MileageCalcFormTextInput";
import { VehicleForTesting } from "@/app/calculator/page";
import { Path } from "react-hook-form";
import { z } from "zod";

const mockRegister = jest.fn().mockReturnValue({
	onChange: jest.fn(),
	onBlur: jest.fn(),
	name: "test",
});

export const MileageInputNumTestWrapper = ({
	path,
	error,
	schema,
}: {
	path: Path<VehicleForTesting>;
	error?: string;
	schema: z.ZodNumber;
}) => {
	return (
		<MileageCalcFormNumInput
			registerFn={mockRegister}
			path={path}
			error={error}
			subSchema={schema}
		/>
	);
};

export const MileageInputTextTestWrapper = ({
	path,
	error,
	schema,
}: {
	path: Path<VehicleForTesting>;
	error?: string;
	schema: z.ZodString;
}) => {
	return (
		<MileageCalcFormTextInput
			registerFn={mockRegister}
			path={path}
			error={error}
			subSchema={schema}
		/>
	);
};
