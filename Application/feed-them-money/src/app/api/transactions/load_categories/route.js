import { query } from "@/lib/db";

export async function GET() {
  const data = await query(`SELECT id, category, accounting_concept, budget, DATE_FORMAT(budget_from, '%Y-%m-%d') AS budget_from FROM loadCategories`);
  return Response.json(data);
}