import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

// Database health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', message: 'Database connection successful' }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: error instanceof Error ? error.message : 'Unknown database error' 
    }
  }
}

// Database statistics
export async function getDatabaseStats() {
  try {
    const [
      userCount,
      studentCount,
      teacherCount,
      parentCount,
      schoolCount,
      assessmentCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.school.count(),
      prisma.assessment.count()
    ])

    return {
      users: userCount,
      students: studentCount,
      teachers: teacherCount,
      parents: parentCount,
      schools: schoolCount,
      assessments: assessmentCount,
      total: userCount + studentCount + teacherCount + parentCount + schoolCount + assessmentCount
    }
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Connection management
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('✅ Database disconnected successfully')
    return true
  } catch (error) {
    console.error('❌ Database disconnection failed:', error)
    return false
  }
}
