export interface LiveClass {
	id: string;
	course: Course;
	instructor: string;
	location: string;
	startTime: Date;
	durationMinutes: number;
	capacity: number;
	sneakScore: "High" | "Medium" | "Low";
}

export interface Course {
	code: string;
	name: string;
	description: string;
	imageUrl: string;
	level: "Beginner" | "Intermediate" | "Advanced";
}
