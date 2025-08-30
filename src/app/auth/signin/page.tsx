'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

// Demo users organized by category
const demoUsers = {
  admin: [
    { email: 'admin@edusight.com', name: 'System Administrator', role: 'ADMIN' },
    { email: 'superadmin@edusight.com', name: 'Super Admin', role: 'ADMIN' },
    { email: 'principal@edusight.com', name: 'Dr. Principal Smith', role: 'ADMIN' },
  ],
  business: [
    { email: 'crm@edusight.com', name: 'CRM Manager', role: 'ADMIN' },
    { email: 'sales1@edusight.com', name: 'Jennifer Sales', role: 'ADMIN' },
    { email: 'accounts@edusight.com', name: 'Finance Manager', role: 'ADMIN' },
    { email: 'accountant1@edusight.com', name: 'Patricia Accountant', role: 'ADMIN' },
  ],
  education: [
    { email: 'teacher1@edusight.com', name: 'Sarah Johnson', role: 'TEACHER' },
    { email: 'teacher2@edusight.com', name: 'Michael Chen', role: 'TEACHER' },
    { email: 'teacher3@edusight.com', name: 'Emily Rodriguez', role: 'TEACHER' },
  ],
  students: [
    { email: 'student1@edusight.com', name: 'Alex Thompson', role: 'STUDENT' },
    { email: 'student2@edusight.com', name: 'Emma Wilson', role: 'STUDENT' },
    { email: 'student3@edusight.com', name: 'James Davis', role: 'STUDENT' },
    { email: 'student4@edusight.com', name: 'Sophia Martinez', role: 'STUDENT' },
  ],
  parents: [
    { email: 'parent1@edusight.com', name: 'Robert Thompson', role: 'PARENT' },
    { email: 'parent2@edusight.com', name: 'Lisa Wilson', role: 'PARENT' },
    { email: 'parent3@edusight.com', name: 'David Martinez', role: 'PARENT' },
  ],
  support: [
    { email: 'counselor1@edusight.com', name: 'Dr. Amanda Foster', role: 'COUNSELOR' },
    { email: 'counselor2@edusight.com', name: 'Dr. Mark Stevens', role: 'COUNSELOR' },
    { email: 'customer1@edusight.com', name: 'Customer Service Rep', role: 'ADMIN' },
    { email: 'support@edusight.com', name: 'Technical Support', role: 'ADMIN' },
  ],
};

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Signed in successfully!');
        
        // Get the updated session to determine redirect
        const session = await getSession();
        if (session?.user?.role) {
          switch (session.user.role) {
            case 'ADMIN':
              router.push('/admin/dashboard');
              break;
            case 'TEACHER':
              router.push('/teacher/dashboard');
              break;
            case 'PARENT':
              router.push('/parent/dashboard');
              break;
            case 'COUNSELOR':
              router.push('/counselor/dashboard');
              break;
            default:
              router.push('/student/dashboard');
          }
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUserSelect = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    setShowDemoUsers(false);
    toast.info(`Demo user selected: ${email}`);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      admin: '👑',
      business: '💼',
      education: '🎓',
      students: '👨‍🎓',
      parents: '👨‍👩‍👧‍👦',
      support: '🎧'
    };
    return icons[category as keyof typeof icons] || '👤';
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      admin: 'Admin & Management',
      business: 'CRM & Finance',
      education: 'Teachers & Staff',
      students: 'Students',
      parents: 'Parents & Guardians',
      support: 'Support & Counseling'
    };
    return titles[category as keyof typeof titles] || category;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign in form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <svg
                className="h-8 w-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to EduSight
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="form-input pr-10"
                    placeholder="Enter your password"
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
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Demo users panel */}
      <div className="hidden lg:flex lg:flex-1 lg:bg-white lg:border-l lg:border-gray-200">
        <div className="w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-primary-600" />
              Demo Users
            </h3>
            <button
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              {showDemoUsers ? (
                <>
                  Hide <ChevronUpIcon className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Show <ChevronDownIcon className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {showDemoUsers && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">🔑 Quick Access</p>
                <p>Click any user below to auto-fill credentials</p>
                <p className="text-xs mt-1">Password: <code className="bg-blue-100 px-1 rounded">password123</code></p>
              </div>

              {Object.entries(demoUsers).map(([category, users]) => (
                <div key={category} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
                  >
                    <span className="flex items-center text-sm font-medium text-gray-700">
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                      {getCategoryTitle(category)}
                      <span className="ml-2 text-xs text-gray-500">({users.length})</span>
                    </span>
                    {expandedCategory === category ? (
                      <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedCategory === category && (
                    <div className="border-t border-gray-200">
                      {users.map((user) => (
                        <button
                          key={user.email}
                          onClick={() => handleDemoUserSelect(user.email)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                              user.role === 'TEACHER' ? 'bg-green-100 text-green-800' :
                              user.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'PARENT' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile demo users button */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <button
          onClick={() => setShowDemoUsers(!showDemoUsers)}
          className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <UserGroupIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile demo users overlay */}
      {showDemoUsers && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-96 rounded-t-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Demo Users</h3>
              <button
                onClick={() => setShowDemoUsers(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">🔑 Quick Access</p>
              <p>Tap any user to auto-fill credentials</p>
            </div>

            <div className="space-y-2">
              {Object.entries(demoUsers).map(([category, users]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {getCategoryTitle(category)}
                  </h4>
                  {users.slice(0, 2).map((user) => (
                    <button
                      key={user.email}
                      onClick={() => handleDemoUserSelect(user.email)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 rounded border border-gray-200 mb-1"
                    >
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
