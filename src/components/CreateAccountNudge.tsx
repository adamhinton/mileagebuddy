import { useAppSelector } from "@/redux/hooks";

/**
 *
 * This component nudges the user to create an account when they are not logged in.
 */
const CreateAccountNudge = () => {
	const isLoggedIn = useAppSelector((state) => state.user?.value?.id)
		? true
		: false;

	if (isLoggedIn) {
		return null;
	}

	return (
		<div className="bg-accent text-white text-center py-2 mb-4">
			<p>
				Save your calculations and access them anytime!{" "}
				<a href="/signup" className="underline font-bold">
					Create an account
				</a>{" "}
				for free.
			</p>
		</div>
	);
};

export default CreateAccountNudge;
