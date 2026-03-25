import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    provider: {
      type: String,
      required: true,
      enum: ['openai', 'anthropic', 'google', 'aws_bedrock', 'mistral', 'cohere', 'slack', 'datadog'],
      index: true
    },
    category: { type: String, enum: ['ai', 'alerts', 'observability'], required: true },
    connected: { type: Boolean, default: true },
    secretEncrypted: { type: String, required: true },
    secretPreview: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastTestStatus: { type: String, enum: ['success', 'failed', 'never'], default: 'never' },
    lastTestError: { type: String },
    lastTestedAt: { type: Date },
    connectedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

integrationSchema.index({ organizationId: 1, provider: 1 }, { unique: true });

export const Integration = mongoose.model('Integration', integrationSchema);
