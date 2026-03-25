import mongoose from "mongoose";

const infrastructureUsageSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    provider: { type: String, required: true },
    chip_type: { type: String, required: true, enum: ["nvidia_gpu", "inferentia2", "trainium", "tpu"] },
    instance_type: { type: String, required: true },
    cluster: { type: String, required: true },
    gpu_utilization: { type: Number, required: true, min: 0, max: 100 },
    cost_per_hour: { type: Number, required: true, min: 0 },
    workload: { type: String, required: true },
    timestamp: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const InfrastructureUsage = mongoose.model("InfrastructureUsage", infrastructureUsageSchema);
