import mongoose from "mongoose";

const RepairSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  mobileModel: { type: String, required: true },
  problem: { type: String, required: true },
});

const Repair = mongoose.model("Repair", RepairSchema);
export default Repair;

