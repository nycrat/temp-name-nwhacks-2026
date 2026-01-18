import { LiveClass } from "./types";

function getNextWeekday(weekday: number, fromDate = new Date()) {
  const date = new Date(fromDate); // copy to avoid mutating
  const currentDay = date.getDay();

  // Calculate how many days to add
  let diff = (weekday - currentDay + 7) % 7;
  if (diff === 0) diff = 7; // always get next, not today

  date.setDate(date.getDate() + diff);
  return date;
}

export function getLiveClassDatetime(liveClass: LiveClass): Date {
  const [hours, minutes] = liveClass.startTime.split(":").map(Number);

  const classDate = new Date(getNextWeekday(liveClass.weekday));
  classDate.setHours(hours, minutes, 0, 0);

  return classDate;
}

export function formatTime(datetime: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = `${pad(datetime.getHours() % 12 || 12)}:${pad(datetime.getMinutes())}`;
  const amPm = datetime.getHours() < 12 ? "AM" : "PM";

  return time + " " + amPm;
}

export function formatDatetime(datetime: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = datetime.getFullYear();
  const month = pad(datetime.getMonth() + 1); // 0-indexed
  const day = pad(datetime.getDate());
  const hours = pad(datetime.getHours());
  const minutes = pad(datetime.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getEnd(liveClass: LiveClass) {
  return new Date(
    getLiveClassDatetime(liveClass).getTime() +
      liveClass.durationMinutes * 60000,
  );
}
