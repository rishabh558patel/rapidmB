import Joi from "joi";
import Repair from "../models/repair.js";

// Define Joi validation schema
const repairSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  contact: Joi.string()
    .pattern(/^\d{10,12}$/)
    .required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.string().length(6).pattern(/^\d+$/).required(),
  mobileModel: Joi.string().required(),
  problem: Joi.string().min(10).required(),
});

export const getRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find();
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ FIXED createRepair function to return data, not handle response
export const createRepair = async (data) => {
  // Validate request body
  const { error } = repairSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  try {
    const newRepair = new Repair(data);
    return await newRepair.save();
  } catch (error) {
    console.error("❌ Error saving repair request:", error);
    throw error;
  }
};
