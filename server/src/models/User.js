import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true },
    password: { 
      type: String, 
      required: function() { 
        return !this.oauthProvider; // Only require password for non-OAuth users
      },
      minlength: 8 
    },
    role: { type: String, required: true, enum: ["admin", "finops_manager", "engineer", "viewer"] },
    subscriptionTier: { 
      type: String, 
      enum: ["free", "starter", "growth", "pro", "enterprise"], 
      default: "free" 
    },
    subscriptionStatus: { 
      type: String, 
      enum: ["active", "canceled", "past_due", "trial"], 
      default: "trial" 
    },
    subscriptionEndDate: { type: Date },
    isActive: { type: Boolean, default: true },
    // OAuth fields
    oauthProvider: { 
      type: String, 
      enum: ["google", "github", "microsoft", null],
      default: null 
    },
    oauthId: { type: String, index: true },
    oauthProfile: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  // Only hash the password if it's modified and not using OAuth
  if (!this.isModified("password") || !this.password) return next();
  
  // Only hash password if it's not empty (for OAuth users who don't have passwords)
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  // For OAuth users without passwords, return false
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
