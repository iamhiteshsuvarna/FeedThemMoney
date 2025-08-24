import { query } from "@/lib/db";

export async function POST(request) {
    const { month, category, money_account } = await request.json();
    const localMoneyAccount= money_account || 0;
    if (!month || !category) {
        return Response.json({ error: "Month and category are required" }, { status: 400 });
    }
    const data = await query(`CALL fetch_transactions(?,?,?)`, [month, category, localMoneyAccount]);
    const result = data[0]; // First result set
    return Response.json(result);
}