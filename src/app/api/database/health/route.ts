import { NextResponse } from 'next/server'
import { checkDatabaseHealth, getDatabaseStats } from '@/lib/database'

export async function GET() {
  try {
    // Check database health
    const healthCheck = await checkDatabaseHealth()
    
    if (healthCheck.status === 'unhealthy') {
      return NextResponse.json(
        { 
          status: 'error', 
          message: healthCheck.message 
        },
        { status: 500 }
      )
    }

    // Get database statistics
    const stats = await getDatabaseStats()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection healthy',
      data: {
        health: healthCheck,
        statistics: stats,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Database health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
