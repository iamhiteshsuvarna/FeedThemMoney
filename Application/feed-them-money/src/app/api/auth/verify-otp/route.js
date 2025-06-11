import { query } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const { phone, otp } = body;

  try {
    const result = await query("SELECT ftmu_token AS token, ftmu_name AS name FROM ftm_users WHERE ftmu_user = ? AND ftmu_password = ?    ", [phone, otp]);
    if(result.length === 0) {
      return Response.json({ success: false, error: "Invalid OTP or phone number" }, { status: 401 });
    }
    return Response.json({ success: true, token: result[0].token, name: result[0].name }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}