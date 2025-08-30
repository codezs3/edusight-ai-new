import { prisma } from './index'

export interface CreateAssessmentData {
  studentId: string
  title: string
  description?: string
  assessmentType: 'academic' | 'behavioral' | 'physical' | 'psychological'
  data?: string // JSON string
  score?: number
  maxScore?: number
}

export interface UpdateAssessmentData {
  title?: string
  description?: string
  data?: string
  score?: number
  maxScore?: number
}

export interface AssessmentFilters {
  studentId?: string
  assessmentType?: string
  dateFrom?: Date
  dateTo?: Date
  schoolId?: string
  grade?: string
}

export class AssessmentService {
  // Create assessment
  static async createAssessment(data: CreateAssessmentData) {
    try {
      const assessment = await prisma.assessment.create({
        data,
        include: {
          student: {
            include: {
              user: true,
              school: true
            }
          }
        }
      })
      return { success: true, data: assessment }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create assessment' 
      }
    }
  }

  // Get assessment by ID
  static async getAssessmentById(id: string) {
    try {
      const assessment = await prisma.assessment.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              user: true,
              school: true,
              parent: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      })
      return { success: true, data: assessment }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get assessment' 
      }
    }
  }

  // Update assessment
  static async updateAssessment(id: string, data: UpdateAssessmentData) {
    try {
      const assessment = await prisma.assessment.update({
        where: { id },
        data,
        include: {
          student: {
            include: {
              user: true,
              school: true
            }
          }
        }
      })
      return { success: true, data: assessment }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update assessment' 
      }
    }
  }

  // Get assessments with pagination and filters
  static async getAssessments(
    page: number = 1, 
    limit: number = 10, 
    filters: AssessmentFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit
      const where: any = {}

      // Apply filters
      if (filters.studentId) where.studentId = filters.studentId
      if (filters.assessmentType) where.assessmentType = filters.assessmentType
      
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {}
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
        if (filters.dateTo) where.createdAt.lte = filters.dateTo
      }

      // School/grade filters through student relation
      if (filters.schoolId || filters.grade) {
        where.student = {}
        if (filters.schoolId) where.student.schoolId = filters.schoolId
        if (filters.grade) where.student.grade = filters.grade
      }

      const [assessments, total] = await Promise.all([
        prisma.assessment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            student: {
              include: {
                user: true,
                school: true
              }
            }
          }
        }),
        prisma.assessment.count({ where })
      ])

      return {
        success: true,
        data: {
          assessments,
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
        error: error instanceof Error ? error.message : 'Failed to get assessments' 
      }
    }
  }

  // Get assessments by student ID
  static async getAssessmentsByStudent(studentId: string, assessmentType?: string) {
    try {
      const where: any = { studentId }
      if (assessmentType) where.assessmentType = assessmentType

      const assessments = await prisma.assessment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: true,
              school: true
            }
          }
        }
      })
      return { success: true, data: assessments }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get assessments' 
      }
    }
  }

  // Get latest assessment for student by type
  static async getLatestAssessment(studentId: string, assessmentType: string) {
    try {
      const assessment = await prisma.assessment.findFirst({
        where: { 
          studentId,
          assessmentType
        },
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: true,
              school: true
            }
          }
        }
      })
      return { success: true, data: assessment }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get latest assessment' 
      }
    }
  }

  // Get assessment statistics
  static async getAssessmentStats(filters: AssessmentFilters = {}) {
    try {
      const where: any = {}

      if (filters.studentId) where.studentId = filters.studentId
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {}
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
        if (filters.dateTo) where.createdAt.lte = filters.dateTo
      }

      if (filters.schoolId || filters.grade) {
        where.student = {}
        if (filters.schoolId) where.student.schoolId = filters.schoolId
        if (filters.grade) where.student.grade = filters.grade
      }

      const [
        totalAssessments,
        typeStats,
        avgScores
      ] = await Promise.all([
        prisma.assessment.count({ where }),
        prisma.assessment.groupBy({
          by: ['assessmentType'],
          where,
          _count: { assessmentType: true }
        }),
        prisma.assessment.groupBy({
          by: ['assessmentType'],
          where: {
            ...where,
            score: { not: null }
          },
          _avg: { score: true }
        })
      ])

      const typeStatsMap = typeStats.reduce((acc, stat) => {
        acc[stat.assessmentType] = stat._count.assessmentType
        return acc
      }, {} as Record<string, number>)

      const avgScoresMap = avgScores.reduce((acc, stat) => {
        acc[stat.assessmentType] = stat._avg.score || 0
        return acc
      }, {} as Record<string, number>)

      return {
        success: true,
        data: {
          total: totalAssessments,
          byType: typeStatsMap,
          averageScores: avgScoresMap
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get assessment stats' 
      }
    }
  }

  // Calculate EduSight 360 Score for a student
  static async calculateE360Score(studentId: string) {
    try {
      // Get latest assessments for each type
      const [academic, physical, psychological] = await Promise.all([
        this.getLatestAssessment(studentId, 'academic'),
        this.getLatestAssessment(studentId, 'physical'),
        this.getLatestAssessment(studentId, 'psychological')
      ])

      let totalScore = 0
      let totalWeight = 0

      // Academic weight: 50%
      if (academic.data?.score && academic.data?.maxScore) {
        const academicPercent = (academic.data.score / academic.data.maxScore) * 100
        totalScore += academicPercent * 0.5
        totalWeight += 0.5
      }

      // Physical weight: 25%
      if (physical.data?.score && physical.data?.maxScore) {
        const physicalPercent = (physical.data.score / physical.data.maxScore) * 100
        totalScore += physicalPercent * 0.25
        totalWeight += 0.25
      }

      // Psychological weight: 25%
      if (psychological.data?.score && psychological.data?.maxScore) {
        const psychologicalPercent = (psychological.data.score / psychological.data.maxScore) * 100
        totalScore += psychologicalPercent * 0.25
        totalWeight += 0.25
      }

      // Normalize to 40-100 scale
      const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0
      const e360Score = Math.max(40, Math.min(100, 40 + (normalizedScore * 0.6)))

      return {
        success: true,
        data: {
          e360Score: Math.round(e360Score * 100) / 100,
          components: {
            academic: academic.data?.score ? (academic.data.score / academic.data.maxScore) * 100 : null,
            physical: physical.data?.score ? (physical.data.score / physical.data.maxScore) * 100 : null,
            psychological: psychological.data?.score ? (psychological.data.score / psychological.data.maxScore) * 100 : null
          },
          needsMedicalAttention: e360Score < 40
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to calculate E360 score' 
      }
    }
  }

  // Delete assessment
  static async deleteAssessment(id: string) {
    try {
      await prisma.assessment.delete({
        where: { id }
      })
      return { success: true, message: 'Assessment deleted successfully' }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete assessment' 
      }
    }
  }

  // Bulk create assessments
  static async bulkCreateAssessments(assessments: CreateAssessmentData[]) {
    try {
      const createdAssessments = await prisma.assessment.createMany({
        data: assessments
      })
      return { success: true, data: createdAssessments }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to bulk create assessments' 
      }
    }
  }
}
