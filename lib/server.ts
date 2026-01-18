import { Course, LiveClass } from "@/lib/types";
import { neon } from "@neondatabase/serverless";

export async function getLiveClasses(now: Date): Promise<LiveClass[]> {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const weekday = now.getDay();
  const hour = now.getHours().toString() + ":00";
  const rows = await sql`
    SELECT *
    FROM live_classes
    WHERE weekday = ${weekday}
      AND "startTime" >= ${hour}
      AND instructor != ''
    ORDER BY "startTime" ASC
    LIMIT 200;
  `;

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

  return res;
}
