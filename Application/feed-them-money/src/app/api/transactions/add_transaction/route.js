import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {txn_id, txn_date, category, particulars, amount, money_account, tags } = body;

  try {
    await query(
      "CALL add_transaction(?, ?, ?, ?, ?, ?, ?)",
      [txn_id, txn_date, category, particulars, amount, money_account, tags]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}