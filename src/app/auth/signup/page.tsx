'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

// Base schema for all users
const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Extended schemas for specific user types
const parentSchema = baseSchema.extend({
  occupation: z.string().optional(),
  income: z.string().optional(),
  education: z.string().optional(),
  emergencyContact: z.string().optional(),
})

const schoolAdminSchema = baseSchema.extend({
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

const psychologistSchema = baseSchema.extend({
  specialization: z.string().min(2, 'Specialization is required'),
  licenseNumber: z.string().min(2, 'License number is required'),
  experience: z.string().optional(),
  qualifications: z.string().optional(),
  certifications: z.string().optional(),
})

const peExpertSchema = baseSchema.extend({
  qualifications: z.string().min(2, 'Qualifications are required'),
  certifications: z.string().optional(),
  experience: z.string().optional(),
  sportsSpecialty: z.string().optional(),
})

type UserType = 'PARENT' | 'ADMIN' | 'COUNSELOR' | 'TEACHER'

interface UserTypeConfig {
  id: UserType
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  schema: any
}

const userTypes: UserTypeConfig[] = [
  {
    id: 'PARENT',
    title: 'Parent/Guardian',
    description: 'Monitor your child\'s educational progress and assessments',
    icon: UserGroupIcon,
    color: 'purple',
    schema: parentSchema
  },
  {
    id: 'ADMIN',
    title: 'School Administrator',
    description: 'Manage school operations and student assessments',
    icon: BuildingOfficeIcon,
    color: 'blue',
    schema: schoolAdminSchema
  },
  {
    id: 'COUNSELOR',
    title: 'Psychologist',
    description: 'Provide psychological assessments and mental health support',
    icon: HeartIcon,
    color: 'green',
    schema: psychologistSchema
  },
  {
    id: 'TEACHER',
    title: 'Physical Education Expert',
    description: 'Conduct physical assessments and fitness evaluations',
    icon: AcademicCapIcon,
    color: 'orange',
    schema: peExpertSchema
  }
]

export default function SignUpPage() {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const selectedConfig = userTypes.find(type => type.id === selectedUserType)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: selectedConfig ? zodResolver(selectedConfig.schema) : zodResolver(baseSchema)
  })

  const onSubmit = async (data: any) => {
    if (!selectedUserType) {
      toast.error('Please select a user type')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        ...data,
        role: selectedUserType,
        ...(selectedUserType === 'TEACHER' && { specialization: 'PHYSICAL_EDUCATION' })
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Registration successful! Please sign in.')
        router.push('/auth/signin?message=registration-success')
      } else {
        toast.error(result.error || 'Registration failed')
        console.error('Registration error:', result.details)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100',
      blue: 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100',
      green: 'border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100',
      orange: 'border-orange-200 hover:border-orange-300 bg-orange-50 hover:bg-orange-100',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    reset() // Reset form when user type changes
  }

  const handleBack = () => {
    setSelectedUserType(null)
    reset()
  }

  if (!selectedUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <UserIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Join EduSight
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Choose your role to get started with our educational platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {userTypes.map((userType) => {
              const IconComponent = userType.icon
              return (
                <button
                  key={userType.id}
                  onClick={() => handleUserTypeSelect(userType.id)}
                  className={`p-6 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${getColorClasses(userType.color)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-8 w-8 ${getIconColorClasses(userType.color)}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userType.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {userType.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={handleBack}
            className="mb-4 text-sm text-primary-600 hover:text-primary-500 flex items-center"
          >
            ← Back to user type selection
          </button>
          
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            {selectedConfig && <selectedConfig.icon className="h-8 w-8 text-primary-600" />}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as {selectedConfig?.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {selectedConfig?.description}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message as string}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message as string}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="form-input"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message as string}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  {...register('address')}
                  className="form-input"
                  rows={2}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password.message as string}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword.message as string}</p>
                )}
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedUserType === 'PARENT' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900">Parent Information</h3>
                
                <div>
                  <label htmlFor="occupation" className="form-label">
                    Occupation
                  </label>
                  <input
                    {...register('occupation')}
                    type="text"
                    className="form-input"
                    placeholder="Your occupation"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="form-label">
                    Education Level
                  </label>
                  <select {...register('education')} className="form-input">
                    <option value="">Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="income" className="form-label">
                    Annual Income Range
                  </label>
                  <select {...register('income')} className="form-input">
                    <option value="">Select income range</option>
                    <option value="Below 3 LPA">Below ₹3 LPA</option>
                    <option value="3-6 LPA">₹3-6 LPA</option>
                    <option value="6-12 LPA">₹6-12 LPA</option>
                    <option value="12-25 LPA">₹12-25 LPA</option>
                    <option value="Above 25 LPA">Above ₹25 LPA</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="form-label">
                    Emergency Contact
                  </label>
                  <input
                    {...register('emergencyContact')}
                    type="tel"
                    className="form-input"
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            )}

            {selectedUserType === 'ADMIN' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900">School Information</h3>
                
                <div>
                  <label htmlFor="schoolName" className="form-label">
                    School Name *
                  </label>
                  <input
                    {...register('schoolName')}
                    type="text"
                    className="form-input"
                    placeholder="Enter school name"
                  />
                  {errors.schoolName && (
                    <p className="form-error">{errors.schoolName.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="position" className="form-label">
                    Your Position
                  </label>
                  <input
                    {...register('position')}
                    type="text"
                    className="form-input"
                    placeholder="e.g., Principal, Vice Principal, Admin"
                  />
                </div>

                <div>
                  <label htmlFor="employeeId" className="form-label">
                    Employee ID
                  </label>
                  <input
                    {...register('employeeId')}
                    type="text"
                    className="form-input"
                    placeholder="Your employee ID"
                  />
                </div>

                <div>
                  <label htmlFor="schoolType" className="form-label">
                    School Type
                  </label>
                  <select {...register('schoolType')} className="form-input">
                    <option value="">Select school type</option>
                    <option value="public">Public School</option>
                    <option value="private">Private School</option>
                    <option value="international">International School</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="schoolBoard" className="form-label">
                    School Board
                  </label>
                  <select {...register('schoolBoard')} className="form-input">
                    <option value="">Select board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="IB">IB</option>
                    <option value="STATE">State Board</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="schoolAddress" className="form-label">
                    School Address
                  </label>
                  <textarea
                    {...register('schoolAddress')}
                    className="form-input"
                    rows={2}
                    placeholder="School address"
                  />
                </div>

                <div>
                  <label htmlFor="schoolPhone" className="form-label">
                    School Phone
                  </label>
                  <input
                    {...register('schoolPhone')}
                    type="tel"
                    className="form-input"
                    placeholder="School contact number"
                  />
                </div>

                <div>
                  <label htmlFor="schoolEmail" className="form-label">
                    School Email
                  </label>
                  <input
                    {...register('schoolEmail')}
                    type="email"
                    className="form-input"
                    placeholder="School email address"
                  />
                  {errors.schoolEmail && (
                    <p className="form-error">{errors.schoolEmail.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="schoolWebsite" className="form-label">
                    School Website
                  </label>
                  <input
                    {...register('schoolWebsite')}
                    type="url"
                    className="form-input"
                    placeholder="https://www.schoolname.com"
                  />
                  {errors.schoolWebsite && (
                    <p className="form-error">{errors.schoolWebsite.message as string}</p>
                  )}
                </div>
              </div>
            )}

            {selectedUserType === 'COUNSELOR' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                
                <div>
                  <label htmlFor="specialization" className="form-label">
                    Specialization *
                  </label>
                  <input
                    {...register('specialization')}
                    type="text"
                    className="form-input"
                    placeholder="e.g., Child Psychology, Educational Psychology"
                  />
                  {errors.specialization && (
                    <p className="form-error">{errors.specialization.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="form-label">
                    License Number *
                  </label>
                  <input
                    {...register('licenseNumber')}
                    type="text"
                    className="form-input"
                    placeholder="Professional license number"
                  />
                  {errors.licenseNumber && (
                    <p className="form-error">{errors.licenseNumber.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications
                  </label>
                  <textarea
                    {...register('qualifications')}
                    className="form-input"
                    rows={3}
                    placeholder="List your educational qualifications"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="form-label">
                    Years of Experience
                  </label>
                  <select {...register('experience')} className="form-input">
                    <option value="">Select experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6-10 years">6-10 years</option>
                    <option value="11-15 years">11-15 years</option>
                    <option value="15+ years">15+ years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="certifications" className="form-label">
                    Additional Certifications
                  </label>
                  <textarea
                    {...register('certifications')}
                    className="form-input"
                    rows={2}
                    placeholder="List any additional certifications"
                  />
                </div>
              </div>
            )}

            {selectedUserType === 'TEACHER' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900">Physical Education Expertise</h3>
                
                <div>
                  <label htmlFor="qualifications" className="form-label">
                    Qualifications *
                  </label>
                  <textarea
                    {...register('qualifications')}
                    className="form-input"
                    rows={3}
                    placeholder="List your educational qualifications in Physical Education"
                  />
                  {errors.qualifications && (
                    <p className="form-error">{errors.qualifications.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sportsSpecialty" className="form-label">
                    Sports Specialty
                  </label>
                  <input
                    {...register('sportsSpecialty')}
                    type="text"
                    className="form-input"
                    placeholder="e.g., Athletics, Swimming, Football, etc."
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="form-label">
                    Teaching Experience
                  </label>
                  <select {...register('experience')} className="form-input">
                    <option value="">Select experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6-10 years">6-10 years</option>
                    <option value="11-15 years">11-15 years</option>
                    <option value="15+ years">15+ years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="certifications" className="form-label">
                    Coaching Certifications
                  </label>
                  <textarea
                    {...register('certifications')}
                    className="form-input"
                    rows={2}
                    placeholder="List any coaching or fitness certifications"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
