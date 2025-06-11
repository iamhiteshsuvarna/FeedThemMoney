import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {accounting_concept, opening_balance, last_update } = body;

  try {
    await query(
      "CALL add_opening_balance(?, ?, ?)",
      [accounting_concept, opening_balance, last_update]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}