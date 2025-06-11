import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {category_id} = body;

  const data = await query(`CALL delete_category(?)`, [category_id]);
  return Response.json(data);
}