export interface LiveClass {
	id: string;
	course: Course;
	instructor: string;
	location: string;
	startTime: string;
	durationMinutes: number;
	capacity: number;
	sneakScore: "High" | "Medium" | "Low";
	type: "Lecture" | "Seminar" | "Lab";
  progress?: number;
}

export interface Course {
	code: string;
	name: string;
	description: string;
	imageUrl: string;
	level: "Beginner" | "Intermediate" | "Advanced";
}

