import mongoose from "mongoose";

const vectorUsageSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    database_provider: { type: String, required: true, index: true },
    index_name: { type: String, required: true },
    storage_gb: { type: Number, required: true, min: 0 },
    io_operations: { type: Number, required: true, min: 0 },
    embedding_tokens: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    avg_context_tokens: { type: Number, default: 0 },
    threshold_context_tokens: { type: Number, default: 4000 },
    timestamp: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const VectorUsage = mongoose.model("VectorUsage", vectorUsageSchema);
