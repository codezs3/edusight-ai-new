'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  CheckCircleIcon,
  SparklesIcon,
  EyeIcon, 
  ChartPieIcon,
  ArrowRightIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const guestSession = searchParams.get('guestSession');
  const studentName = searchParams.get('studentName');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [guestSessionData, setGuestSessionData] = useState<any>(null);

  useEffect(() => {
    // If coming from guest assessment, fetch session data
    if (guestSession) {
      fetchGuestSessionData();
    }
  }, [guestSession]);

  const fetchGuestSessionData = async () => {
    try {
      const response = await fetch(`/api/guest/upload?sessionId=${guestSession}`);
      if (response.ok) {
        const data = await response.json();
        setGuestSessionData(data.session);
      }
    } catch (error) {
      console.error('Error fetching guest session:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      // Create account
      const signupResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'PARENT',
          accountType: 'B2C',
          guestSessionId: guestSession, // Link guest session to new account
          studentName: studentName
        })
      });

      const signupData = await signupResponse.json();

      if (signupData.success) {
        // Sign in the user
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (result?.ok) {
          toast.success('Account created successfully!');
          
          // Redirect to report or dashboard
          if (guestSession) {
            router.push(`/guest-report?session=${guestSession}&welcome=true`);
          } else {
            router.push('/dashboard');
          }
        } else {
          toast.error('Account created but sign in failed. Please try signing in manually.');
          router.push('/auth/signin');
        }
      } else {
        toast.error(signupData.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Error creating account');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
          <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {guestSession ? 'Claim Your Report!' : 'Create Your Account'}
            </h2>
          <p className="mt-2 text-gray-600">
            {guestSession 
              ? `Access ${studentName || 'your'}'s comprehensive assessment report`
              : 'Join thousands of parents using EduSight'
            }
            </p>
          </div>

        {/* Guest Session Benefits */}
        {guestSession && guestSessionData && (
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <GiftIcon className="w-5 h-5" />
              <span className="font-semibold">Your Report is Ready!</span>
                    </div>
            <div className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Complete academic analysis for {guestSessionData.studentName}</span>
                    </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Personalized career recommendations</span>
                  </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Detailed performance insights & charts</span>
          </div>
        </div>
            <p className="text-xs mt-3 opacity-90">
              Sign up below to download your complete assessment report
          </p>
        </div>
        )}

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
              <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

            {/* Email Field */}
              <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

            {/* Phone Field */}
              <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>
              </div>

            {/* Password Field */}
              <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                  id="password"
                  name="password"
                    type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

            {/* Confirm Password Field */}
              <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                    placeholder="Confirm your password"
                  />
                </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
                  <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 ${
                  errors.acceptTerms ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
                  </label>
                </div>
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>{guestSession ? 'Access My Report' : 'Create Account'}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href={`/auth/signin${guestSession ? `?guestSession=${guestSession}&studentName=${studentName}` : ''}`}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits for regular signup */}
        {!guestSession && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Why join EduSight?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>AI-powered academic insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Personalized learning recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Progress tracking and analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Career guidance and planning</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
