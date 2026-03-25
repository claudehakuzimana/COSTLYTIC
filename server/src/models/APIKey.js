import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    keyPrefix: { type: String, required: true },
    keyHash: { type: String, required: true },
    scopes: [{ type: String, default: ["usage:write"] }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastUsedAt: Date,
    revokedAt: Date
  },
  { timestamps: true }
);

export const APIKey = mongoose.model("APIKey", apiKeySchema);
