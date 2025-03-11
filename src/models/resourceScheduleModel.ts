import mongoose from 'mongoose';

const resourceScheduleSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: [true, 'Please enter your resource id'],
    },
    startLockTime: Number,
    endLockTime: Number,
    lockedBy: {
      type: String,
      required: [true, 'Please enter your resource locked by'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ResourceSchedule =
  mongoose.models.resourceSchedule ||
  mongoose.model('resourceSchedule', resourceScheduleSchema);

export default ResourceSchedule;
