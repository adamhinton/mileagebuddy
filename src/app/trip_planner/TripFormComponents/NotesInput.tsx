// TODO commented this out because of the `any` type, reinstate later

// import React from "react";
// import { FieldErrors, UseFormRegister, Path } from "react-hook-form";
// import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

// interface NotesInputProps<TFormValues extends Record<string, any>> {
// 	register: UseFormRegister<TFormValues>;
// 	errors: FieldErrors<TFormValues>;
// 	fieldName: Path<TFormValues>;
// 	label?: string;
// 	placeholder?: string;
// 	className?: string;
// }

// const NotesInput = <TFormValues extends Record<string, unknown>>({
// 	register,
// 	errors,
// 	fieldName,
// 	label = "Notes",
// 	placeholder = "Enter any notes here...",
// 	className = "",
// }: NotesInputProps<TFormValues>) => {
// 	const formStyles = tailWindClassNames.mileageCalcForm;
// 	const error = errors[fieldName];

// 	return (
// 		<div className={`mb-4 ${className}`}>
// 			<label htmlFor={fieldName} className={formStyles.FORM_INPUT_LABEL}>
// 				{label}
// 			</label>
// 			<textarea
// 				id={fieldName}
// 				{...register(fieldName)}
// 				placeholder={placeholder}
// 				className={`${formStyles.FORM_TEXT_INPUT} min-h-[80px] w-full dark:bg-gray-700 dark:text-white dark:border-gray-600`}
// 			/>
// 			{error && typeof error.message === "string" && (
// 				<p className={formStyles.FORM_ERROR_MESSAGE}>{error.message}</p>
// 			)}
// 		</div>
// 	);
// };

// export default NotesInput;
