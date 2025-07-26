import { sendOtpEmail } from '@/lib/emailSender';

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || "cybershoora@gmail.com";

// In-memory store for demo
if (!global.verificationCodes) global.verificationCodes = {};

export async function POST(req) {
  const { email } = await req.json();
  if (!email || email !== SUPERADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: 'Only super admin email is allowed' }), { status: 400 });
  }
  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  global.verificationCodes[email] = code;

  // Send OTP email using Shooraverse sender
  try {
    await sendOtpEmail(email, 'Super Admin', code);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
} 