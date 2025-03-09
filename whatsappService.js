import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppMessage = async (formData) => {
  console.log("📩 Sending WhatsApp message...");  // ✅ Debug log

  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio sandbox number
      to: process.env.MY_WHATSAPP_NUMBER, // Your personal WhatsApp number
      body: `📱 New Repair Request:

      🔹 Name: ${formData.name}
      📞 Phone: ${formData.contact}
      🛠 Issue: ${formData.problem}
      ✉ Email: ${formData.email}
      Mobile Model: ${formData.mobileModel}

      Please contact the customer soon!`,
    });

    console.log("✅ WhatsApp Message Sent:", message.sid);  // ✅ Log the Twilio message ID
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
  }
};


export default sendWhatsAppMessage;
