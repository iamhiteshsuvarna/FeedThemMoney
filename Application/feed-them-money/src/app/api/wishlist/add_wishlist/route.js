import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {id, category, wishlist_group, particulars, wishlist_description, budget, wishlist_stage, priority } = body;

  try {
    await query(
      "CALL add_wishlist(?, ?, ?, ?, ?, ?, ?, ?)",
      [id, category, wishlist_group, particulars, wishlist_description, budget, wishlist_stage, priority]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}