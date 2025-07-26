const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || "cybershoora@gmail.com";

// In-memory store for demo
if (!global.verificationCodes) global.verificationCodes = {};

export async function POST(req) {
  const { email, code } = await req.json();
  if (!email || !code || email !== SUPERADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: 'Only super admin email is allowed' }), { status: 400 });
  }
  if (global.verificationCodes[email] === code) {
    delete global.verificationCodes[email];
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid code' }), { status: 400 });
  }
} 