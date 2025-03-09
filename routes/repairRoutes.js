import express from "express";
import { getRepairs, createRepair } from "../controllers/repairController.js";
import sendWhatsAppMessage from "../whatsappService.js";

const router = express.Router();

router.get("/", getRepairs);

router.post("/", async (req, res) => {
  console.log("🔄 Received repair request:", req.body);

  try {
    // ✅ FIXED: Corrected function call to pass only req.body
    const newRepair = await createRepair(req.body);

    // ✅ FIXED: Ensure notifications are sent after successful repair save
    try {
      await Promise.all([
        sendWhatsAppMessage(req.body),
      ]);
    } catch (notificationError) {
      console.error("⚠️ Notification error:", notificationError);
      return res.status(500).json({ 
        error: "Repair saved, but notifications failed to send.",
        repair: newRepair,
      });
    }

    return res.status(201).json({ 
      message: "Repair request submitted and notifications sent!", 
      repair: newRepair 
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Failed to submit repair request." });
    }
  }
});

export default router;
