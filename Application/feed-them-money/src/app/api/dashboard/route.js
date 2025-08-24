import { query } from "@/lib/db";

export async function POST(request) {
    const { money_account } = await request.json();
    let localMoneyAccount=0
    if (money_account) {
      localMoneyAccount=money_account
    }
    // 456
    const data = await query(`CALL fetch_month_dashboard(?)`, [localMoneyAccount]);
    const result = data[0]; // First result set
    return Response.json(result);
}