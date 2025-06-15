import { query } from "@/lib/db";

export async function GET() {
  const data = await query(`SELECT * FROM ViewTransactions ORDER BY txn_id DESC, txn_date DESC`);
  return Response.json(data);
}