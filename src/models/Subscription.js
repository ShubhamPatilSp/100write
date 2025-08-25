import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  dodoPaySubscriptionId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
  },
  dodoPayCustomerId: {
    type: String,
  },
  planId: {
    type: String,
    required: true,
    enum: ['free', 'pro_monthly', 'pro_yearly'],
    default: 'free',
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing'],
    default: 'active',
  },
  currentPeriodStart: {
    type: Date,
  },
  currentPeriodEnd: {
    type: Date,
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  usage: {
    words: {
      type: Number,
      default: 0,
    },
    detections: {
      type: Number,
      default: 0,
    },
    humanizations: {
      type: Number,
      default: 0,
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
  },
  metadata: {
    type: Map,
    of: String,
  },
}, { 
  timestamps: true 
});

// Index for efficient queries
SubscriptionSchema.index({ status: 1 });

// Method to check if subscription is active
SubscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && (!this.currentPeriodEnd || this.currentPeriodEnd > new Date());
};

// Method to check if user has reached usage limits
SubscriptionSchema.methods.hasReachedLimit = function(type) {
  const { PRICING_PLANS } = require('../lib/dodopay');
  const plan = Object.values(PRICING_PLANS).find(p => p.id === this.planId);
  
  if (!plan || plan.limits[type] === -1) {
    return false; // Unlimited
  }
  
  return this.usage[type] >= plan.limits[type];
};

// Method to increment usage
SubscriptionSchema.methods.incrementUsage = function(type, amount = 1) {
  this.usage[type] += amount;
  return this.save();
};

// Method to reset monthly usage
SubscriptionSchema.methods.resetMonthlyUsage = function() {
  const now = new Date();
  const lastReset = this.usage.lastResetDate;
  
  // Reset if it's been more than a month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.usage.words = 0;
    this.usage.detections = 0;
    this.usage.humanizations = 0;
    this.usage.lastResetDate = now;
    return this.save();
  }
  
  return Promise.resolve(this);
};

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
