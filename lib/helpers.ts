import { now } from "./constants";

export function stringToTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);

  const today = new Date(now);

  today.setHours(hours, minutes, 0, 0);

  return today;
}

export function formatTime(datetime: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = `${pad(datetime.getHours() % 12 || 12)}:${pad(datetime.getMinutes())}`;
  const amPm = datetime.getHours() < 12 ? "AM" : "PM";

  return time + " " + amPm;
}
