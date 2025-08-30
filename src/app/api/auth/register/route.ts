import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { hashPassword, storeUserPassword } from '@/lib/auth/password'
import { z } from 'zod'

// Registration schema with dynamic validation based on user type
const baseRegistrationSchema = z.object({
  // Basic user info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['PARENT', 'ADMIN', 'COUNSELOR', 'TEACHER']),
})

// Extended schemas for specific user types
const parentRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('PARENT'),
  occupation: z.string().optional(),
  income: z.string().optional(),
  education: z.string().optional(),
  emergencyContact: z.string().optional(),
})

const schoolAdminRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('ADMIN'),
  schoolName: z.string().min(2, 'School name is required'),
  schoolAddress: z.string().optional(),
  schoolPhone: z.string().optional(),
  schoolEmail: z.string().email('Please enter a valid school email').optional(),
  schoolWebsite: z.string().url('Please enter a valid website URL').optional(),
  schoolType: z.enum(['public', 'private', 'international']).optional(),
  schoolBoard: z.enum(['CBSE', 'ICSE', 'IGCSE', 'IB', 'STATE']).optional(),
  position: z.string().optional(),
  employeeId: z.string().optional(),
})

const psychologistRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('COUNSELOR'),
  specialization: z.string().min(2, 'Specialization is required'),
  licenseNumber: z.string().min(2, 'License number is required'),
  experience: z.string().optional(),
  qualifications: z.string().optional(),
  certifications: z.string().optional(),
})

const peExpertRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('TEACHER'),
  specialization: z.literal('PHYSICAL_EDUCATION'),
  qualifications: z.string().min(2, 'Qualifications are required'),
  certifications: z.string().optional(),
  experience: z.string().optional(),
  sportsSpecialty: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // First validate with base schema to get the role
    const baseValidation = baseRegistrationSchema.safeParse(body)
    if (!baseValidation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: baseValidation.error.errors 
        },
        { status: 400 }
      )
    }

    // Then validate with role-specific schema
    let validatedData: any
    switch (body.role) {
      case 'PARENT':
        const parentValidation = parentRegistrationSchema.safeParse(body)
        if (!parentValidation.success) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Parent validation failed', 
              details: parentValidation.error.errors 
            },
            { status: 400 }
          )
        }
        validatedData = parentValidation.data
        break

      case 'ADMIN':
        const adminValidation = schoolAdminRegistrationSchema.safeParse(body)
        if (!adminValidation.success) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'School admin validation failed', 
              details: adminValidation.error.errors 
            },
            { status: 400 }
          )
        }
        validatedData = adminValidation.data
        break

      case 'COUNSELOR':
        const counselorValidation = psychologistRegistrationSchema.safeParse(body)
        if (!counselorValidation.success) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Psychologist validation failed', 
              details: counselorValidation.error.errors 
            },
            { status: 400 }
          )
        }
        validatedData = counselorValidation.data
        break

      case 'TEACHER':
        if (body.specialization === 'PHYSICAL_EDUCATION') {
          const peValidation = peExpertRegistrationSchema.safeParse(body)
          if (!peValidation.success) {
            return NextResponse.json(
              { 
                success: false, 
                error: 'PE Expert validation failed', 
                details: peValidation.error.errors 
              },
              { status: 400 }
            )
          }
          validatedData = peValidation.data
        } else {
          validatedData = baseValidation.data
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid user role' },
          { status: 400 }
        )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user in database
    const result = await prisma.$transaction(async (tx: any) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          role: validatedData.role,
          isActive: true
        }
      })

      // Create account for credentials
      await tx.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.id,
        }
      })

      // Store password separately (you might want to create a separate password table)
      // For now, we'll store it in a custom field or use a separate service

      // Create role-specific records
      switch (validatedData.role) {
        case 'PARENT':
          await tx.parent.create({
            data: {
              userId: user.id,
              occupation: validatedData.occupation,
              income: validatedData.income,
              education: validatedData.education,
            }
          })
          break

        case 'ADMIN':
          // Create school if provided
          if (validatedData.schoolName) {
            const school = await tx.school.create({
              data: {
                name: validatedData.schoolName,
                address: validatedData.schoolAddress,
                phone: validatedData.schoolPhone,
                email: validatedData.schoolEmail,
                website: validatedData.schoolWebsite,
                type: validatedData.schoolType,
                board: validatedData.schoolBoard,
              }
            })
            
            // Create teacher record for admin (they can also teach)
            await tx.teacher.create({
              data: {
                userId: user.id,
                schoolId: school.id,
                employeeId: validatedData.employeeId,
                department: 'Administration',
                subjects: validatedData.position || 'Administrator',
              }
            })
          }
          break

        case 'COUNSELOR':
          // Store counselor-specific data in teacher table with counselor flag
          await tx.teacher.create({
            data: {
              userId: user.id,
              department: 'Counseling',
              subjects: `Psychology - ${validatedData.specialization}`,
              employeeId: validatedData.licenseNumber,
            }
          })
          break

        case 'TEACHER':
          if (validatedData.specialization === 'PHYSICAL_EDUCATION') {
            await tx.teacher.create({
              data: {
                userId: user.id,
                department: 'Physical Education',
                subjects: `PE - ${validatedData.sportsSpecialty || 'General'}`,
              }
            })
          }
          break
      }

      return user
    })

    // Store password hash for credentials authentication
    await storeUserPassword(result.id, hashedPassword)

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      },
      { status: 500 }
    )
  }
}
