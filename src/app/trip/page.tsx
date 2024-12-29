const TripPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
	console.log("isDarkMode:", isDarkMode);
	return (
		<div
			className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
		>
			blah blah blah
		</div>
	);
};

export default TripPage;
