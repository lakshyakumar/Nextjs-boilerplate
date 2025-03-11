import { NextRequest, NextResponse } from 'next/server';
import { ResourceService } from '@/services/Resource/ResourceService';
import { Helpers } from '@/helpers/Helpers';

const resourceService = new ResourceService();

/**
 * @swagger
 * /api/resource/manage:
 *   get:
 *     summary: Retrieve available resource slots
 *     description: Retrieve available resource slots by ID within a specified time period.
 *     tags:
 *       - resource
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the resource
 *       - in: query
 *         name: timeInHours
 *         schema:
 *           type: number
 *         description: The time period in hours to check for available slots
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: user id for getting the bookings
 *       - in: query
 *         name: getAvailableSlots
 *         schema:
 *           type: bool
 *           default: false
 *         description: If we want to get the availbale booking slots for future
 *     responses:
 *       200:
 *         description: A list of available resource slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the resource
 *                   description:
 *                     type: string
 *                     description: The description of the resource
 *                   quantity:
 *                     type: number
 *                     description: The quantity of the resource
 *                   lockPeriodinMinutes:
 *                     type: number
 *                     description: The lock period in minutes
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const resourceId = searchParams.get('id') || null;
  const timeInHour = parseFloat(searchParams.get('timeInHour') || '1');
  const getAvailableSlots = searchParams.get('getAvailableSlots') || null;
  const userId = searchParams.get('userId') || null;

  try {
    if (getAvailableSlots === 'true') {
      console.log('getAvailable', typeof getAvailableSlots);
      if (!resourceId) throw new Error('Resource ID is required');
      const resources = await resourceService.getAvailableSlots(
        resourceId,
        Date.now(),
        Date.now() + timeInHour * 60 * 60 * 1000,
      );
      return NextResponse.json({
        success: true,
        data: resources,
      });
    } else {
      const resources = await resourceService.getAllBookings(
        resourceId,
        userId,
      );
      return NextResponse.json({
        success: true,
        data: resources,
      });
    }
  } catch (e) {
    const error = Helpers.FetchError(e as Error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.status },
    );
  }
}

/**
 * @swagger
 * /api/resource/manage:
 *   post:
 *     summary: Book a resource slot
 *     description: Book a resource slot by ID with a specified quantity and start time.
 *     tags:
 *       - resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the resource
 *               quantity:
 *                 type: number
 *                 description: The quantity to book
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the booking
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the booking
 *                 example: 123456
 *     responses:
 *       200:
 *         description: The booking was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the booking was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the booking
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const { id, quantity, startTime, userId } = await req.json();

  try {
    if (!id || !quantity || !startTime || !userId)
      throw new Error('Invalid parameters');
    const result = await resourceService.bookResourceSlot(
      id,
      quantity,
      startTime,
      `${userId}`,
    );
    return NextResponse.json({
      success: true,
      message: result,
    });
  } catch (e) {
    const error = Helpers.FetchError(e as Error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.status },
    );
  }
}
