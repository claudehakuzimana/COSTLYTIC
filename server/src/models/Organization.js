import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    plan: { type: String, default: "free" },
    description: { type: String, default: "" },
    // Used by organization controllers to attribute orgs to a creator user.
    // Seeded data may not set this, but it must exist for `populate('createdBy', ...)`.
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    budgets: {
      monthlyAiBudget: { type: Number, default: 1000 },
      monthlyInfraBudget: { type: Number, default: 2000 }
    }
  },
  { timestamps: true }
);

export const Organization = mongoose.model("Organization", organizationSchema);
