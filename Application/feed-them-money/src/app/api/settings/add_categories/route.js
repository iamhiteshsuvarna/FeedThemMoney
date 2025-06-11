import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const {category_id, category_name, accounting_concept, category_budget, budget_start_from } = body;

  try {
    await query(
      "CALL add_category(?, ?, ?, ?, ?)",
      [category_id, category_name, accounting_concept, category_budget, budget_start_from]
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}