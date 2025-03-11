import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: [true, 'Please enter your resource name'],
      min: 3,
      max: 255,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      required: [true, 'Please enter your resource description'],
      min: 3,
      max: 255,
    },
    lockPeriodinMinutes: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

const Resource =
  mongoose.models.resources || mongoose.model('resources', resourceSchema);

export default Resource;
