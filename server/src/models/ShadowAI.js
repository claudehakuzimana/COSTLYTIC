import mongoose from "mongoose";

const shadowAISchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    tool_name: { type: String, required: true, index: true },
    employee_email: { type: String, required: true, lowercase: true, index: true },
    estimated_cost: { type: Number, required: true, min: 0 },
    requests_count: { type: Number, required: true, min: 1 },
    timestamp: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const ShadowAI = mongoose.model("ShadowAI", shadowAISchema);
