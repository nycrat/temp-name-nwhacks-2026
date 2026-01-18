import { getLiveClasses } from "@/lib/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const now = params.get("now");
  if (typeof now != "string") {
    return Response.json([]);
  }

  const res = await getLiveClasses(new Date(now));
  return Response.json(res);
}
