import { Resource } from '@/common/types';
import ResourceModel from '../../models/resourceModel';
import ResourceSchedule from '@/models/resourceScheduleModel';
import { dbConnect } from '@/dbConfig/dbConfig';
import moment from 'moment-timezone';

import { Types, UpdateQuery } from 'mongoose';

export class ResourceService {
  constructor() {
    dbConnect();
  }
  // Create a new resource
  async createResource(resource: Resource): Promise<Resource> {
    try {
      const newResource = new ResourceModel(resource);
      await newResource.save();
      return newResource;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new Error('Error creating resource');
    }
  }

  // Read a resource by ID
  async getResourceById(id: string) {
    try {
      return await ResourceModel.findById(id);
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw new Error('Error fetching resource');
    }
  }

  // Update a resource by ID
  async updateResource(id: string, updatedResource: UpdateQuery<Resource>) {
    try {
      return await ResourceModel.findByIdAndUpdate(id, updatedResource, {
        new: true,
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Error updating resource');
    }
  }

  // Delete a resource by ID
  async deleteResource(id: string) {
    try {
      const result = await ResourceModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Error deleting resource');
    }
  }

  // List all resources
  async listResources(id: string | null, name: string | null) {
    try {
      if (id) {
        return (await ResourceModel.findById(id)) || [];
      } else if (name) {
        return (await ResourceModel.findOne({ name })) || [];
      } else {
        return await ResourceModel.find({});
      }
    } catch (error) {
      console.error('Error listing resources:', error);
      throw new Error('Error listing resources');
    }
  }

  async getAvailableSlots(
    resourceId: string,
    startDate: number,
    endDate: number,
    slot_time: number = 30 * 60 * 1000,
    timezone: string = 'Asia/Kolkata',
  ) {
    try {
      const resource = await ResourceModel.findById(resourceId);
      if (!resource) throw new Error('Resource not found');

      const totalQuantity = resource.quantity;

      const bookedSlots = await ResourceSchedule.find({
        resourceId: new Types.ObjectId(resourceId),
        $or: [
          {
            startLockTime: { $lt: new Date(endDate) },
            endLockTime: { $gt: new Date(startDate) },
          },
        ],
      })
        .sort({ startTime: 1 })
        .lean();

      const start = moment.tz(startDate + slot_time, timezone).startOf('hour');
      const end = moment.tz(endDate + slot_time, timezone).startOf('hour');

      // Step 5: Create an array to store the hourly time slots
      const timeSlots = [];

      // Step 6: Use a loop to generate the hourly time slots between the start and end timestamps
      const current = start.clone();
      while (current.isBefore(end)) {
        for (let i = 0; i < totalQuantity; i++) {
          timeSlots.push(current.valueOf());
        }
        current.add(slot_time, 'ms');
      }

      const availableSlots = [];

      for (const slot of timeSlots) {
        let is_already_booked = false;
        let i = 0;
        for (i = 0; i < bookedSlots.length; i++) {
          if (
            (bookedSlots[i].startLockTime.valueOf() <= slot &&
              bookedSlots[i].endLockTime.valueOf() >= slot) ||
            (bookedSlots[i].startLockTime.valueOf() > slot &&
              bookedSlots[i].endLockTime.valueOf() < slot + slot_time) ||
            (bookedSlots[i].startLockTime.valueOf() > slot &&
              bookedSlots[i].startLockTime.valueOf() < slot + slot_time) ||
            (bookedSlots[i].startLockTime.valueOf() > slot &&
              bookedSlots[i].startLockTime.valueOf() < slot + slot_time)
          ) {
            is_already_booked = true;
            break;
          }
        }
        if (!is_already_booked) {
          availableSlots.push(slot);
        } else {
          bookedSlots.splice(i, 1);
        }
      }
      // Step 7: Return the array of time slots
      return availableSlots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw new Error('Failed to retrieve available slots. Please try again.');
    }
  }

  async bookResourceSlot(
    resourceId: string,
    quantity: number,
    startTime: number,
    lockedBy: string,
  ) {
    try {
      // Validate input
      if (!Types.ObjectId.isValid(resourceId)) {
        throw new Error('Invalid resource ID');
      }
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }
      if (startTime < Date.now()) {
        console.log('startTime', startTime, Date.now());
        throw new Error('Invalid start time');
      }

      const resource = await ResourceModel.findById(resourceId);
      if (!resource) throw new Error('Resource not found');

      const lockInTime = resource.lockPeriodinMinutes * 60 * 1000; // Convert to milliseconds
      const endTime = parseInt(`${startTime}`) + quantity * lockInTime;
      console.log('starttime ', startTime, 'endTime ', endTime);

      // Find overlapping locks
      const bookedSlots = await ResourceSchedule.find({
        resourceId: new Types.ObjectId(resourceId),
        $or: [
          { startLockTime: { $lt: endTime }, endLockTime: { $gt: startTime } },
        ],
      }).lean();

      // Calculate already locked quantity
      const totalLocked = bookedSlots.reduce(
        (sum, slot) => sum + slot.quantityLocked,
        0,
      );
      const availableQuantity = resource.quantity - totalLocked;

      if (availableQuantity < 1) {
        throw new Error('Insufficient quantity available');
      }

      // Create a new lock for the slot
      const newLock = new ResourceSchedule({
        resourceId: new Types.ObjectId(resourceId),
        startLockTime: startTime,
        endLockTime: endTime,
        quantityLocked: quantity,
        lockedBy,
      });

      await newLock.save();
      return 'Slot booked successfully';
    } catch (error) {
      console.error('Error booking slot:', error);
      throw new Error((error as Error).message);
    }
  }

  async getAllBookings(resourceId: string | null, userId: string | null) {
    try {
      let query = {};
      if (resourceId && userId) {
        query = { resourceId, userId };
      } else if (resourceId) {
        query = { resourceId };
      } else if (userId) {
        query = { userId };
      }
      return await ResourceSchedule.find(query);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }
}
