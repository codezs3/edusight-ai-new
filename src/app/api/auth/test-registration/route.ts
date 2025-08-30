import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Registration API Test',
    endpoints: {
      register: '/api/auth/register',
      signin: '/auth/signin',
      signup: '/auth/signup'
    },
    userTypes: [
      {
        type: 'PARENT',
        description: 'Parent/Guardian registration with family details'
      },
      {
        type: 'ADMIN',
        description: 'School Administrator with school management access'
      },
      {
        type: 'COUNSELOR',
        description: 'Psychologist with professional credentials'
      },
      {
        type: 'TEACHER',
        description: 'Physical Education Expert with sports specialization'
      }
    ],
    requiredFields: {
      all: ['name', 'email', 'password'],
      parent: ['occupation', 'education', 'income'],
      admin: ['schoolName', 'position', 'schoolType'],
      counselor: ['specialization', 'licenseNumber', 'qualifications'],
      teacher: ['qualifications', 'sportsSpecialty', 'experience']
    }
  })
}
