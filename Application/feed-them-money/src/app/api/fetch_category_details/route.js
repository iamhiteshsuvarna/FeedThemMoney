import { query } from "@/lib/db";

export async function POST(request) {
    const { month, category } = await request.json();
    if (!month || !category) {
        return Response.json({ error: "Month and category are required" }, { status: 400 });
    }
    const data = await query(`SELECT DATE(txn_date) AS txn_date, particulars, amount FROM ViewTransactions WHERE MONTH(txn_date)=? AND category=? ORDER BY txn_date, txn_id`, [month, category]);
    return Response.json(data);
}