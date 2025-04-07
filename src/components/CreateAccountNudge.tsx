import { useAppSelector } from "@/redux/hooks";

/**
 * This component nudges the user to create an account when they are not logged in.
 * Improved for accessibility and responsiveness.
 */
const CreateAccountNudge = () => {
	const isLoggedIn = useAppSelector((state) => state.user?.value?.id)
		? true
		: false;

	if (isLoggedIn) {
		return null;
	}

	return (
		<div
			className="bg-accent text-white text-center py-4 px-6 mb-4 rounded-md shadow-md sm:flex sm:items-center sm:justify-between"
			role="alert"
			aria-live="polite"
		>
			<p className="text-sm sm:text-base">
				Save your calculations!{" "}
				<a
					href="/signup"
					className="underline font-bold hover:text-accent-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent"
				>
					Create a free account
				</a>
			</p>
			<a
				href="/signup"
				className="mt-2 sm:mt-0 sm:ml-4 inline-block bg-white text-accent font-bold py-2 px-4 rounded-md hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white transition-all"
			>
				Sign Up
			</a>
		</div>
	);
};

export default CreateAccountNudge;
