import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/database'

// Simple password storage in the database
// We'll use a separate table or store it with the account
export async function storeUserPassword(userId: string, hashedPassword: string) {
  try {
    // For now, we'll store it in the account table's access_token field
    // In production, you should have a dedicated password table
    await prisma.account.updateMany({
      where: {
        userId,
        provider: 'credentials'
      },
      data: {
        access_token: hashedPassword
      }
    })
    return true
  } catch (error) {
    console.error('Failed to store password:', error)
    return false
  }
}

export async function getUserPassword(userId: string): Promise<string | null> {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'credentials'
      },
      select: {
        access_token: true
      }
    })
    return account?.access_token || null
  } catch (error) {
    console.error('Failed to get password:', error)
    return null
  }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error('Failed to verify password:', error)
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 12)
  } catch (error) {
    console.error('Failed to hash password:', error)
    throw new Error('Password hashing failed')
  }
}
