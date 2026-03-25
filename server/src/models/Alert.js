import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["budget", "context_hygiene", "recursive_loop", "shadow_ai", "optimization"]
    },
    severity: { type: String, default: "medium", enum: ["low", "medium", "high", "critical"] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "open", enum: ["open", "acknowledged", "resolved"] },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Alert = mongoose.model("Alert", alertSchema);
