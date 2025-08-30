import { prisma } from './index'
import { User, Student, Teacher, Parent } from '@prisma/client'

export interface CreateUserData {
  name: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'COUNSELOR'
  phone?: string
  address?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  address?: string
  isActive?: boolean
}

// User CRUD operations
export class UserService {
  // Create user
  static async createUser(data: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          isActive: true
        }
      })
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create user' 
      }
    }
  }

  // Get user by ID
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          student: true,
          teacher: true,
          parent: true
        }
      })
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user' 
      }
    }
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          student: true,
          teacher: true,
          parent: true
        }
      })
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user' 
      }
    }
  }

  // Update user
  static async updateUser(id: string, data: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data
      })
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update user' 
      }
    }
  }

  // Delete user (soft delete)
  static async deleteUser(id: string) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { isActive: false }
      })
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user' 
      }
    }
  }

  // Get all users with pagination
  static async getUsers(page: number = 1, limit: number = 10, role?: string) {
    try {
      const skip = (page - 1) * limit
      const where = role ? { role, isActive: true } : { isActive: true }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            student: true,
            teacher: true,
            parent: true
          }
        }),
        prisma.user.count({ where })
      ])

      return {
        success: true,
        data: {
          users,
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
        error: error instanceof Error ? error.message : 'Failed to get users' 
      }
    }
  }

  // Search users
  static async searchUsers(query: string) {
    try {
      const users = await prisma.user.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        take: 20,
        include: {
          student: true,
          teacher: true,
          parent: true
        }
      })
      return { success: true, data: users }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search users' 
      }
    }
  }

  // Get user statistics
  static async getUserStats() {
    try {
      const stats = await prisma.user.groupBy({
        by: ['role'],
        where: { isActive: true },
        _count: { role: true }
      })

      const formattedStats = stats.reduce((acc, stat) => {
        acc[stat.role.toLowerCase()] = stat._count.role
        return acc
      }, {} as Record<string, number>)

      return { success: true, data: formattedStats }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user stats' 
      }
    }
  }
}
