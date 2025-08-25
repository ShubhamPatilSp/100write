import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionToken: {
    type: String,
    unique: true,
    required: true,
  },
  device: {
    type: String,
    default: 'Unknown Device',
  },
  location: {
    type: String,
    default: 'Unknown Location',
  },
  country: {
    type: String,
    default: 'Unknown Country',
  },
  countryCode: {
    type: String,
    default: 'XX',
  },
  city: {
    type: String,
    default: 'Unknown City',
  },
  expires: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

SessionSchema.index({ userId: 1 });
SessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
