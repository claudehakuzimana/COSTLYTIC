import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    provider: { type: String, required: true, lowercase: true, index: true },
    model: { type: String, required: true, index: true },
    tokens_input: { type: Number, required: true, min: 0 },
    tokens_output: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    team: { type: String, required: true, index: true },
    application: { type: String, required: true, index: true },
    agent: { type: String, index: true },
    request_id: { type: String, required: true, unique: true, index: true },
    ticket_id: { type: String },
    session_id: { type: String },
    workflow_id: { type: String },
    timestamp: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const AIUsage = mongoose.model("AIUsage", aiUsageSchema);
