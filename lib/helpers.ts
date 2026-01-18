export function stringToTime(timeString: string) {
	const [hours, minutes] = timeString.split(":").map(Number);

	const today = new Date();

	today.setHours(hours, minutes, 0, 0);

	return today;
}
