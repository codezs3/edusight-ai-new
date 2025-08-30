import { prisma } from './index'

export interface CreateStudentData {
  userId: string
  schoolId?: string
  grade?: string
  section?: string
  rollNumber?: string
  dateOfBirth?: Date
  gender?: string
  bloodGroup?: string
  parentId?: string
}

export interface UpdateStudentData {
  schoolId?: string
  grade?: string
  section?: string
  rollNumber?: string
  dateOfBirth?: Date
  gender?: string
  bloodGroup?: string
  parentId?: string
  isActive?: boolean
}

export class StudentService {
  // Create student
  static async createStudent(data: CreateStudentData) {
    try {
      const student = await prisma.student.create({
        data: {
          ...data,
          isActive: true
        },
        include: {
          user: true,
          school: true,
          parent: {
            include: {
              user: true
            }
          }
        }
      })
      return { success: true, data: student }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create student' 
      }
    }
  }

  // Get student by ID
  static async getStudentById(id: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          user: true,
          school: true,
          parent: {
            include: {
              user: true
            }
          },
          assessments: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
      return { success: true, data: student }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get student' 
      }
    }
  }

  // Get student by user ID
  static async getStudentByUserId(userId: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { userId },
        include: {
          user: true,
          school: true,
          parent: {
            include: {
              user: true
            }
          },
          assessments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      return { success: true, data: student }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get student' 
      }
    }
  }

  // Update student
  static async updateStudent(id: string, data: UpdateStudentData) {
    try {
      const student = await prisma.student.update({
        where: { id },
        data,
        include: {
          user: true,
          school: true,
          parent: {
            include: {
              user: true
            }
          }
        }
      })
      return { success: true, data: student }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update student' 
      }
    }
  }

  // Get students with pagination
  static async getStudents(page: number = 1, limit: number = 10, filters?: {
    schoolId?: string
    grade?: string
    parentId?: string
  }) {
    try {
      const skip = (page - 1) * limit
      const where: any = { isActive: true }

      if (filters?.schoolId) where.schoolId = filters.schoolId
      if (filters?.grade) where.grade = filters.grade
      if (filters?.parentId) where.parentId = filters.parentId

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
            school: true,
            parent: {
              include: {
                user: true
              }
            },
            assessments: {
              take: 1,
              orderBy: { createdAt: 'desc' }
            }
          }
        }),
        prisma.student.count({ where })
      ])

      return {
        success: true,
        data: {
          students,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get students' 
      }
    }
  }

  // Get students by parent ID
  static async getStudentsByParent(parentId: string) {
    try {
      const students = await prisma.student.findMany({
        where: { 
          parentId,
          isActive: true 
        },
        include: {
          user: true,
          school: true,
          assessments: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })
      return { success: true, data: students }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get students' 
      }
    }
  }

  // Get students by school ID
  static async getStudentsBySchool(schoolId: string, grade?: string) {
    try {
      const where: any = { 
        schoolId,
        isActive: true 
      }
      
      if (grade) where.grade = grade

      const students = await prisma.student.findMany({
        where,
        include: {
          user: true,
          parent: {
            include: {
              user: true
            }
          },
          assessments: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: [
          { grade: 'asc' },
          { section: 'asc' },
          { rollNumber: 'asc' }
        ]
      })
      return { success: true, data: students }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get students' 
      }
    }
  }

  // Search students
  static async searchStudents(query: string, schoolId?: string) {
    try {
      const where: any = {
        isActive: true,
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { rollNumber: { contains: query, mode: 'insensitive' } }
        ]
      }

      if (schoolId) where.schoolId = schoolId

      const students = await prisma.student.findMany({
        where,
        take: 20,
        include: {
          user: true,
          school: true,
          parent: {
            include: {
              user: true
            }
          }
        }
      })
      return { success: true, data: students }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search students' 
      }
    }
  }

  // Get student statistics
  static async getStudentStats(schoolId?: string) {
    try {
      const where = schoolId ? { schoolId, isActive: true } : { isActive: true }

      const [
        totalStudents,
        gradeStats,
        genderStats
      ] = await Promise.all([
        prisma.student.count({ where }),
        prisma.student.groupBy({
          by: ['grade'],
          where,
          _count: { grade: true }
        }),
        prisma.student.groupBy({
          by: ['gender'],
          where,
          _count: { gender: true }
        })
      ])

      return {
        success: true,
        data: {
          total: totalStudents,
          byGrade: gradeStats.reduce((acc, stat) => {
            if (stat.grade) acc[stat.grade] = stat._count.grade
            return acc
          }, {} as Record<string, number>),
          byGender: genderStats.reduce((acc, stat) => {
            if (stat.gender) acc[stat.gender] = stat._count.gender
            return acc
          }, {} as Record<string, number>)
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get student stats' 
      }
    }
  }

  // Delete student (soft delete)
  static async deleteStudent(id: string) {
    try {
      const student = await prisma.student.update({
        where: { id },
        data: { isActive: false }
      })
      return { success: true, data: student }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete student' 
      }
    }
  }
}
