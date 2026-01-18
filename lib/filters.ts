import { LiveClass } from "./types";
import { neon } from "@neondatabase/serverless";

export interface SearchFilters {
  subjects?: string[];
  level_min?: number;
  level_max?: number;
  max_duration_mins?: number;
  starts_within_mins?: number;
  min_capacity?: number;
  max_capacity?: number;
}

/*
 * filters live classes based on gemini-generated filters
 */

export async function buildAndExecuteQuery(
  filters: SearchFilters,
  now: Date,
): Promise<LiveClass[]> {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const bufferMins = filters.starts_within_mins ?? 60;
  const futureLimit = new Date(now.getTime() + bufferMins * 60000);
  const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const futureTimeStr = `${futureLimit.getHours().toString().padStart(2, "0")}:${futureLimit.getMinutes().toString().padStart(2, "0")}`;

  try {
    const patterns = filters.subjects?.map((s) => s + " %") || [];

    const allClasses = await sql`
      SELECT *
      FROM live_classes
      WHERE "startTime" >= ${currentTimeStr}
        AND "startTime" <= ${futureTimeStr}
        AND "courseCode" LIKE ANY (${patterns})
        AND weekday = ${now.getDay()}
      LIMIT 200
    `;

    let rows = allClasses
      .filter((row: any) => {
        const courseCode = row.courseCode;

        // filter by subject code
        if (filters.subjects && filters.subjects.length > 0) {
          const subjectMatch = filters.subjects.some((subject) =>
            courseCode.startsWith(subject),
          );
          if (!subjectMatch) return false;
        }

        // filter by level
        const levelMatch = courseCode.match(/\d+/);
        if (levelMatch) {
          const level = parseInt(levelMatch[0]);
          if (filters.level_min && level < filters.level_min) return false;
          if (filters.level_max && level > filters.level_max) return false;
        }

        // filter by duration
        if (
          filters.max_duration_mins &&
          row.durationMinutes > filters.max_duration_mins
        ) {
          return false;
        }

        // filter by room capacity/size
        if (filters.min_capacity && row.capacity < filters.min_capacity) {
          return false;
        }
        if (filters.max_capacity && row.capacity > filters.max_capacity) {
          return false;
        }

        return true;
      })
      .slice(0, 100);

    const results = await Promise.all(
      rows.map(async (row: any) => {
        const course =
          await sql`SELECT * FROM courses WHERE code = ${row.courseCode}`;

        const { courseCode, ...rest } = row;
        return {
          ...rest,
          course: course[0],
        } as LiveClass;
      }),
    );

    return results;
  } catch (sqlError) {
    console.error("SQL query error:", sqlError);
    throw new Error(
      `Database query failed: ${sqlError instanceof Error ? sqlError.message : "Unknown SQL error"}`,
    );
  }
}
