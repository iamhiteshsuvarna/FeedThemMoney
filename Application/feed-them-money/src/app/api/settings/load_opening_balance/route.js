import { query } from "@/lib/db";

export async function GET() {
  const data = await query(`SELECT accounting_concept, opening_balance, DATE_FORMAT(last_update, '%Y-%m-%d') AS last_update FROM loadAccountingConceptOpeningBalances`);
  return Response.json(data);
}