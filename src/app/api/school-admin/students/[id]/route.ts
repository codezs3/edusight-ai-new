import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GRADE_OPTIONS } from '@/constants/grades';

// Validation schema for updating students
const updateStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  grade: z.enum(GRADE_OPTIONS.map(g => g.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid grade' })
  }).optional(),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  parentEmail: z.string().email('Valid parent email is required').optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
});

// GET /api/school-admin/students/[id] - Get specific student details
async function getStudent(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    if (!user.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Get student details (ensure it belongs to this school)
    const student = await prisma.student.findFirst({
      where: {
        id: params.id,
        schoolId: user.schoolId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
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
            type: true,
          }
        },
        uploads: {
          select: {
            id: true,
            originalName: true,
            uploadType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get recent analytics for this student
    const recentAnalytics = await prisma.studentRepository.findMany({
      where: { studentId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        documentUpload: {
          select: {
            id: true,
            originalName: true,
            uploadType: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      student,
      recentAnalytics
    });

  } catch (error) {
    console.error('Error fetching student details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500 }
    );
  }
}

// PUT /api/school-admin/students/[id] - Update student information
async function updateStudent(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateStudentSchema.parse(body);

    if (!user.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check if student belongs to this school
    const existingStudent = await prisma.student.findFirst({
      where: {
        id: params.id,
        schoolId: user.schoolId,
        isActive: true
      },
      include: {
        user: true,
        parent: {
          include: {
            user: true
          }
        }
      }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Prepare update data for both User and Student models
    const userUpdateData: any = {};
    const studentUpdateData: any = {};

    if (validatedData.name) {
      userUpdateData.name = validatedData.name;
    }

    if (validatedData.grade) studentUpdateData.grade = validatedData.grade;
    if (validatedData.section) studentUpdateData.section = validatedData.section;
    if (validatedData.rollNumber) studentUpdateData.rollNumber = validatedData.rollNumber;
    if (validatedData.dateOfBirth) studentUpdateData.dateOfBirth = validatedData.dateOfBirth;
    if (validatedData.gender) studentUpdateData.gender = validatedData.gender;
    if (validatedData.bloodGroup) studentUpdateData.bloodGroup = validatedData.bloodGroup;

    // Handle parent information update
    if (validatedData.parentEmail || validatedData.parentName || validatedData.parentPhone) {
      if (existingStudent.parent) {
        // Update existing parent
        const parentUpdateData: any = {};
        if (validatedData.parentName) parentUpdateData.name = validatedData.parentName;
        if (validatedData.parentEmail) parentUpdateData.email = validatedData.parentEmail;
        if (validatedData.parentPhone) parentUpdateData.phone = validatedData.parentPhone;

        if (Object.keys(parentUpdateData).length > 0) {
          await prisma.user.update({
            where: { id: existingStudent.parent.userId },
            data: parentUpdateData
          });
        }
      } else if (validatedData.parentEmail) {
        // Create new parent if email provided
        let parent = await prisma.parent.findFirst({
          where: {
            user: { email: validatedData.parentEmail }
          }
        });

        if (!parent) {
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

        studentUpdateData.parentId = parent.id;
      }
    }

    // Use transaction to update both User and Student
    const updatedStudent = await prisma.$transaction(async (tx) => {
      // Update user record if needed
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingStudent.userId },
          data: userUpdateData
        });
      }

      // Update student record
      const student = await tx.student.update({
        where: { id: params.id },
        data: studentUpdateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              updatedAt: true,
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

      return student;
    });

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error updating student:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE /api/school-admin/students/[id] - Remove student (soft delete)
async function deleteStudent(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    if (!user.schoolId) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check if student belongs to this school
    const existingStudent = await prisma.student.findFirst({
      where: {
        id: params.id,
        schoolId: user.schoolId,
        isActive: true
      },
      include: {
        user: true
      }
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false for both User and Student
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingStudent.userId },
        data: { isActive: false }
      });

      await tx.student.update({
        where: { id: params.id },
        data: { isActive: false }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Student removed successfully'
    });

  } catch (error) {
    console.error('Error removing student:', error);
    return NextResponse.json(
      { error: 'Failed to remove student' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getStudent, {
  permissions: ['MANAGE_SCHOOL_STUDENTS'],
  requireSchool: true,
  resourceType: 'student'
});

export const PUT = withAuth(updateStudent, {
  permissions: ['MANAGE_SCHOOL_STUDENTS'],
  requireSchool: true,
  resourceType: 'student'
});

export const DELETE = withAuth(deleteStudent, {
  permissions: ['MANAGE_SCHOOL_STUDENTS'],
  requireSchool: true,
  resourceType: 'student'
});
