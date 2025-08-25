import mongoose, { Schema, models } from 'mongoose';

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Document = models.Document || mongoose.model('Document', documentSchema);
export default Document;
