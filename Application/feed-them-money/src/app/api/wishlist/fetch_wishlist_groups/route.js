import { query } from "@/lib/db";

export async function GET() {
  const data = await query(`SELECT * FROM fetchWishlistGroups`);
  return Response.json(data);
}