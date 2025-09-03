import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for school creation/update
const schoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  type: z.enum(['public', 'private', 'international']).optional(),
  board: z.enum(['CBSE', 'ICSE', 'IGCSE', 'IB', 'MULTIPLE', 'OTHER']).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  capacity: z.number().min(1).optional(),
  principalName: z.string().optional(),
  principalEmail: z.string().email().optional().or(z.literal('')),
  principalPhone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  pincode: z.string().optional(),
  timezone: z.string().default('Asia/Kolkata'),
  language: z.string().default('en'),
  currency: z.string().default('INR'),
  subscriptionType: z.enum(['trial', 'basic', 'premium', 'enterprise']).default('trial'),
  maxStudents: z.number().min(1).default(100),
  maxTeachers: z.number().min(1).default(20),
  schoolAdminEmail: z.string().email().optional(),
  schoolAdminName: z.string().optional(),
});

// GET /api/admin/schools - List all schools with filtering and pagination
async function getSchools(request: NextRequest, { user }: { user: any }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status'); // active, inactive, all
    const type = searchParams.get('type'); // public, private, international
    const board = searchParams.get('board'); // CBSE, ICSE, etc.

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active';
    }

    if (type) {
      where.type = type;
    }

    if (board) {
      where.board = board;
    }

    // Get total count
    const total = await prisma.school.count({ where });

    // Get schools with pagination
    const schools = await prisma.school.findMany({
      where,
      include: {
        schoolAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            students: true,
            teachers: true,
            schoolStaff: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get summary statistics
    const stats = await prisma.school.groupBy({
      by: ['type', 'board'],
      _count: true,
      where: { isActive: true }
    });

    return NextResponse.json({
      success: true,
      schools,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });

  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST /api/admin/schools - Create a new school
async function createSchool(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const validatedData = schoolSchema.parse(body);

    // Check if school name already exists
    const existingSchool = await prisma.school.findFirst({
      where: { name: validatedData.name }
    });

    if (existingSchool) {
      return NextResponse.json(
        { error: 'School with this name already exists' },
        { status: 400 }
      );
    }

    // Handle school admin creation if provided
    let schoolAdminId: string | undefined;

    if (validatedData.schoolAdminEmail) {
      // Check if user already exists
      let adminUser = await prisma.user.findUnique({
        where: { email: validatedData.schoolAdminEmail }
      });

      if (!adminUser) {
        // Create new school admin user
        adminUser = await prisma.user.create({
          data: {
            name: validatedData.schoolAdminName || 'School Admin',
            email: validatedData.schoolAdminEmail,
            role: 'SCHOOL_ADMIN',
            accountType: 'B2B',
          }
        });
      } else if (adminUser.role !== 'SCHOOL_ADMIN') {
        // Update existing user to school admin role
        adminUser = await prisma.user.update({
          where: { id: adminUser.id },
          data: {
            role: 'SCHOOL_ADMIN',
            accountType: 'B2B',
          }
        });
      }

      schoolAdminId = adminUser.id;
    }

    // Create school
    const school = await prisma.school.create({
      data: {
        name: validatedData.name,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        website: validatedData.website,
        type: validatedData.type,
        board: validatedData.board,
        logo: validatedData.logo,
        description: validatedData.description,
        establishedYear: validatedData.establishedYear,
        capacity: validatedData.capacity,
        principalName: validatedData.principalName,
        principalEmail: validatedData.principalEmail,
        principalPhone: validatedData.principalPhone,
        city: validatedData.city,
        state: validatedData.state,
        country: validatedData.country,
        pincode: validatedData.pincode,
        timezone: validatedData.timezone,
        language: validatedData.language,
        currency: validatedData.currency,
        subscriptionType: validatedData.subscriptionType,
        maxStudents: validatedData.maxStudents,
        maxTeachers: validatedData.maxTeachers,
        schoolAdminId,
      },
      include: {
        schoolAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // Update school admin's schoolId if created
    if (schoolAdminId) {
      await prisma.user.update({
        where: { id: schoolAdminId },
        data: { schoolId: school.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'School created successfully',
      school
    });

  } catch (error) {
    console.error('Error creating school:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getSchools, {
  permissions: ['MANAGE_SCHOOLS']
});

export const POST = withAuth(createSchool, {
  permissions: ['CREATE_SCHOOL']
});