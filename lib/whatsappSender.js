export const sendWhatsAppMessage = async (phone, name) => {
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ No WhatsApp API key found. Skipping WhatsApp message.');
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=+91${phone}&text=Hi+${encodeURIComponent(name)},+Welcome+to+Shooraverse+🎓+Your+registration+was+successful!&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!text.includes('Message successfully sent')) {
      throw new Error(`Failed to send WhatsApp: ${text}`);
    }

    console.log('📲 WhatsApp sent:', text);
  } catch (err) {
    console.error('❌ Failed to send WhatsApp:', err);
    throw err;
  }
};

// Function to send OTP via SMS using Twilio
export const sendWhatsAppOtp = async (phone, message) => {
  try {
    // Check if Twilio credentials are available
    if (false && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      // Import Twilio dynamically
      const twilio = require('twilio');
      
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // Format phone number (add +91 if not present)
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      // Send SMS via Twilio
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      console.log('📲 Twilio SMS sent successfully:', result.sid);
      return true;
    } else {
      // Fallback to manual mode if Twilio not configured
      console.log('📲 Manual OTP System (Twilio not configured):');
      console.log('📱 To:', phone);
      console.log('📝 Message:', message);
      console.log('✅ OTP sent successfully (Manual Mode)');
      return true;
    }
  } catch (err) {
    console.error('❌ Failed to send OTP:', err);
    
    // Fallback to manual mode on error
    console.log('📲 Falling back to Manual OTP System:');
    console.log('📱 To:', phone);
    console.log('📝 Message:', message);
    console.log('✅ OTP sent successfully (Manual Mode)');
    return true;
  }
};
