
import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {txn_id} = body;

  try {
    await query(
      "CALL delete_wishlist(?)",
      [txn_id]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}