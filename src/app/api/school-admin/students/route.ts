import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GRADE_OPTIONS } from '@/constants/grades';

// Validation schema for creating students
const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required').optional(),
  grade: z.enum(GRADE_OPTIONS.map(g => g.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid grade' })
  }),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  parentEmail: z.string().email('Valid parent email is required').optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
});

// GET /api/school-admin/students - Get all students in the school admin's school
async function getStudents(request: NextRequest, { user }: { user: any }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const grade = searchParams.get('grade') || '';
    const section = searchParams.get('section') || '';

    if (!user.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Build where clause for filtering
    const where: any = {
      schoolId: user.schoolId,
      isActive: true,
    };

    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }

    if (grade) {
      where.grade = grade;
    }

    if (section) {
      where.section = section;
    }

    // Get total count for pagination
    const total = await prisma.student.count({ where });

    // Get students with pagination
    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            board: true,
          }
        }
      },
      orderBy: [
        { grade: 'asc' },
        { section: 'asc' },
        { user: { name: 'asc' } }
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get grade and section statistics
    const gradeStats = await prisma.student.groupBy({
      by: ['grade'],
      where: { schoolId: user.schoolId, isActive: true },
      _count: { grade: true },
    });

    const sectionStats = await prisma.student.groupBy({
      by: ['section'],
      where: { schoolId: user.schoolId, isActive: true, section: { not: null } },
      _count: { section: true },
    });

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        grades: gradeStats,
        sections: sectionStats,
        totalStudents: total,
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/school-admin/students - Create a new student in the school
async function createStudent(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const validatedData = createStudentSchema.parse(body);

    if (!user.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Get user's school details
    const school = await prisma.school.findUnique({
      where: { id: user.schoolId }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Generate student email if not provided
    let studentEmail = validatedData.email;
    if (!studentEmail) {
      const baseEmail = validatedData.name.toLowerCase().replace(/\s+/g, '.');
      studentEmail = `${baseEmail}@${school.name.toLowerCase().replace(/\s+/g, '')}.edu`;
      
      // Ensure email uniqueness
      let emailCounter = 1;
      while (await prisma.user.findUnique({ where: { email: studentEmail } })) {
        studentEmail = `${baseEmail}.${emailCounter}@${school.name.toLowerCase().replace(/\s+/g, '')}.edu`;
        emailCounter++;
      }
    }

    // Check if student email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: studentEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Student with this email already exists' }, { status: 400 });
    }

    // Handle parent creation/association if parent info provided
    let parentId: string | undefined;

    if (validatedData.parentEmail) {
      // Check if parent already exists
      let parent = await prisma.parent.findFirst({
        where: {
          user: { email: validatedData.parentEmail }
        }
      });

      if (!parent) {
        // Create new parent user and parent record
        const parentUser = await prisma.user.create({
          data: {
            name: validatedData.parentName || 'Parent',
            email: validatedData.parentEmail,
            phone: validatedData.parentPhone,
            role: 'PARENT',
            accountType: 'B2B',
            schoolId: user.schoolId,
          }
        });

        parent = await prisma.parent.create({
          data: {
            userId: parentUser.id,
            schoolId: user.schoolId,
          }
        });
      }

      parentId = parent.id;
    }

    // Create student user account
    const studentUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: studentEmail,
        role: 'STUDENT',
        accountType: 'B2B',
        schoolId: user.schoolId,
      }
    });

    // Create student record
    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        schoolId: user.schoolId,
        parentId,
        grade: validatedData.grade,
        section: validatedData.section,
        rollNumber: validatedData.rollNumber,
        dateOfBirth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        bloodGroup: validatedData.bloodGroup,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            board: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      student
    });

  } catch (error) {
    console.error('Error creating student:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getStudents, {
  permissions: ['MANAGE_SCHOOL_STUDENTS'],
  requireSchool: true
});

export const POST = withAuth(createStudent, {
  permissions: ['MANAGE_SCHOOL_STUDENTS'],
  requireSchool: true
});