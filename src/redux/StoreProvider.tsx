"use client";
import React from "react";

// README
// Per redux docs, this creates a new store instance every time a request is made. See store.ts for more info.

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
// import { useAppSelector } from "./hooks";

export default function StoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Redux docs don't include the `undefined` bit, but I got an error saying it expected 1 argument but got 0.
	// TODO: Check this out. Maybe fix it once we have our initial store type set up.
	const storeRef = useRef<AppStore | undefined>(undefined);
	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore();
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}

// // This component will use the useSelector hook to get the isDarkMode state
// const ChildWrapper: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
// 	console.log("isDarkMode in ChildWrapper:", isDarkMode);

// 	return (
// 		<>
// 			{React.Children.map(children, (child) =>
// 				React.cloneElement(child as React.ReactElement, { isDarkMode })
// 			)}
// 		</>
// 	);
// };
