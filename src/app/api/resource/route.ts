import { NextResponse, NextRequest } from 'next/server';
import { ResourceService } from '@/services/Resource/ResourceService';
import { Helpers } from '@/helpers/Helpers';

const resourceService = new ResourceService();

/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Retrieve resources
 *     description: Retrieve resources by ID or name, or fetch all if neither is provided.
 *     tags:
 *      - resource
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the resource
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the resource
 *     responses:
 *       200:
 *         description: A list of resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 name:
 *                   type: string
 *                   description: The name of the resource
 *                 description:
 *                   type: string
 *                   description: The description of the resource
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the resource
 *                 lockPeriodinMinutes:
 *                   type: number
 *                   description: The lock period in minutes
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const resourceId = searchParams.get('id') || null;
  const resourceName = searchParams.get('name') || null;
  try {
    const resources = await resourceService.listResources(
      resourceId,
      resourceName,
    );
    return NextResponse.json(resources);
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
 * /api/resource:
 *   post:
 *     summary: Create a new resource
 *     description: Create a new resource with the provided data.
 *     tags:
 *       - resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 name:
 *                   type: string
 *                   description: The name of the resource
 *                   example: "ResourceA"
 *                 description:
 *                   type: string
 *                   description: The description of the resource
 *                   example: "ResourceA for the laocking"
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the resource
 *                   example: 2
 *                 lockPeriodinMinutes:
 *                   type: number
 *                   description: The lock period in minutes
 *                   example: 15
 *     responses:
 *       200:
 *         description: The created resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the resource
 *                 description:
 *                   type: string
 *                   description: The description of the resource
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the resource
 *                 lockPeriodinMinutes:
 *                   type: number
 *                   description: The lock period in minutes
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const { name, quantity, description, lockPeriodinMinutes } = await req.json();
  try {
    if (!name || !quantity || !description || !lockPeriodinMinutes)
      throw new Error(
        'Resource name, quantity, description and lock period in minutes are required',
      );
    const createdResource = await resourceService.createResource({
      resourceName: name,
      quantity,
      description,
      lockPeriodinMinutes,
    });
    return NextResponse.json(createdResource);
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
 * /api/resource:
 *   patch:
 *     summary: Update an existing resource
 *     description: Update an existing resource with the provided data.
 *     tags:
 *      - resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 name:
 *                   type: string
 *                   description: The name of the resource
 *                 description:
 *                   type: string
 *                   description: The description of the resource
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the resource
 *                 lockPeriodinMinutes:
 *                   type: number
 *                   description: The lock period in minutes
 *     responses:
 *       200:
 *         description: The updated resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the resource
 *                 description:
 *                   type: string
 *                   description: The description of the resource
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the resource
 *                 lockPeriodinMinutes:
 *                   type: number
 *                   description: The lock period in minutes
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function PATCH(req: NextRequest) {
  const { id, ...updateData } = await req.json();
  try {
    const updatedResource = await resourceService.updateResource(
      id,
      updateData,
    );
    return NextResponse.json(updatedResource);
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
 * /api/resource:
 *   delete:
 *     summary: Delete a resource
 *     description: Delete a resource by ID or name.
 *     tags:
 *      - resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the resource to delete
 *               name:
 *                 type: string
 *                 description: The name of the resource to delete
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    if (!id) throw new Error('Resource ID is required');
    await resourceService.deleteResource(id);
    return NextResponse.json({ message: 'Resource deleted successfully' });
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
