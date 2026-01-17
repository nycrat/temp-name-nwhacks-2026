import { Course } from "@/app/types";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	const sql = neon(`${process.env.DATABASE_URL}`);
	const rows = (await sql`SELECT * FROM courses`) as Course[];
	return Response.json(rows);
}
