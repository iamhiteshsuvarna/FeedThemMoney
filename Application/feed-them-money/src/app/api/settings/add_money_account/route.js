import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {money_account_id, account_name, account_number, ifsc_code, bank_branch } = body;

  try {
    await query(
      "CALL add_money_account(?, ?, ?, ?, ?)",
      [money_account_id, account_name, account_number, ifsc_code, bank_branch]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}