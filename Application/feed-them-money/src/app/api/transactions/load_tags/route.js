import { query } from "@/lib/db";

export async function GET() {
  const data = await query(`CALL loadTags`);
  if (!data || data.length === 0) {
    return Response.json({ message: "No tags found" }, { status: 404 });
  }
  const tempData = data[0];
  let tagData = tempData.map(tag => tag.tags);
  return Response.json(tagData);
}