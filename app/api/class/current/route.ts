import { Course, LiveClass } from "@/lib/types";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const rows = await sql`SELECT * FROM live_classes`;

  const res = (await Promise.all(
    rows.map(async (row) => {
      const [course] =
        (await sql`SELECT * FROM courses WHERE code = ${row["courseCode"]}`) as Course[];

      const newRow = (({ courseCode, ...rest }) => ({
        ...rest,
        course: course,
      }))(row);
      return newRow;
    }),
  )) as LiveClass[];

  return Response.json(res);
}
