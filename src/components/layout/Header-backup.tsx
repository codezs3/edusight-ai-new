'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  SparklesIcon,
  BookOpenIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  PhoneIcon,
  InformationCircleIcon,
  CurrencyRupeeIcon,
  PlayIcon,
  GlobeAltIcon,
  LightBulbIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const megaMenuItems = {
    frameworks: {
      title: 'Educational Frameworks',
      sections: [
        {
          title: 'International Curricula',
          items: [
            { name: 'International Baccalaureate (IB)', href: '/frameworks#ib', icon: GlobeAltIcon, description: 'PYP, MYP, DP assessment methods' },
            { name: 'Cambridge IGCSE', href: '/frameworks#igcse', icon: BookOpenIcon, description: 'International secondary education standards' },
            { name: 'A-Levels & AS-Levels', href: '/frameworks#alevels', icon: AcademicCapIcon, description: 'Advanced level qualifications' }
          ]
        },
        {
          title: 'Indian Curricula',
          items: [
            { name: 'CBSE Framework', href: '/frameworks#cbse', icon: BookOpenIcon, description: 'Central Board assessment methods' },
            { name: 'ICSE Standards', href: '/frameworks#icse', icon: DocumentTextIcon, description: 'Indian Certificate evaluation system' },
            { name: 'State Board Systems', href: '/frameworks#state', icon: AcademicCapIcon, description: 'Regional education frameworks' }
          ]
        },
        {
          title: 'Assessment Types',
          items: [
            { name: 'Psychological Assessment', href: '/frameworks#psychological', icon: LightBulbIcon, description: 'Multiple intelligences & cognitive evaluation' },
            { name: 'Physical Education', href: '/frameworks#physical', icon: HeartIcon, description: 'Motor skills & fitness assessment' },
            { name: 'Competency Mapping', href: '/frameworks#competency', icon: ChartBarIcon, description: 'Skill-based evaluation frameworks' }
          ]
        }
      ]
    },
    solutions: {
      title: 'AI-Powered Solutions',
      sections: [
        {
          title: 'Assessment Platform',
          items: [
            { name: 'AI-Powered Assessments', href: '/assessments', icon: SparklesIcon, description: 'Intelligent testing with adaptive algorithms' },
            { name: 'Psychometric Testing', href: '/assessments/psychometric', icon: BeakerIcon, description: 'Comprehensive personality and aptitude tests' },
            { name: 'DMIT Analysis', href: '/dmit', icon: DocumentTextIcon, description: 'Dermatoglyphics Multiple Intelligence Test' },
            { name: 'Career Guidance', href: '/career-guidance', icon: PresentationChartLineIcon, description: 'AI-driven career recommendations' }
          ]
        },
        {
          title: 'Analytics & Insights',
          items: [
            { name: 'Student Analytics', href: '/analytics', icon: ChartBarIcon, description: 'Comprehensive performance tracking' },
            { name: 'Learning Insights', href: '/insights', icon: BookOpenIcon, description: 'Deep learning pattern analysis' },
            { name: 'Progress Reports', href: '/reports', icon: DocumentTextIcon, description: 'Detailed progress documentation' },
            { name: 'Predictive Analytics', href: '/predictive', icon: SparklesIcon, description: 'Future performance predictions' }
          ]
        },
        {
          title: 'Management Tools',
          items: [
            { name: 'School Management', href: '/school-management', icon: AcademicCapIcon, description: 'Complete institutional management' },
            { name: 'Teacher Dashboard', href: '/teacher/dashboard', icon: UserGroupIcon, description: 'Educator collaboration tools' },
            { name: 'Parent Portal', href: '/parent-portal', icon: UserGroupIcon, description: 'Family engagement platform' },
            { name: 'Admin Console', href: '/admin', icon: CogIcon, description: 'System administration tools' }
          ]
        }
      ]
    }
  };

  const navigation = [
    { name: 'Home', href: '/', hasDropdown: false },
    { name: 'About Us', href: '/about', hasDropdown: false },
    { name: 'Frameworks', href: '/frameworks', hasDropdown: true, key: 'frameworks' },
    { name: 'Solutions', href: '#', hasDropdown: true, key: 'solutions' },
    { name: 'Pricing', href: '/pricing', hasDropdown: false },
    { name: 'Contact Us', href: '/contact', hasDropdown: false }
  ];

  const MegaMenuDropdown = ({ menuKey }: { menuKey: string }) => {
    const menuData = megaMenuItems[menuKey as keyof typeof megaMenuItems];
    if (!menuData) return null;

    return (
      <div 
        className="absolute top-full left-0 w-screen bg-white shadow-2xl border-t border-gray-200 z-50"
        onMouseEnter={() => handleMouseEnter(menuKey)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{menuData.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  {section.title}
                </h4>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <IconComponent className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Ready to get started?</h4>
                <p className="text-sm text-gray-500">Join thousands of educators transforming student assessment</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/auth/signin"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown ? handleMouseEnter(item.key!) : null}
                onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
              >
                {item.hasDropdown ? (
                  <button className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    {item.name}
                    <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform ${
                      activeDropdown === item.key ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && activeDropdown === item.key && (
                  <MegaMenuDropdown menuKey={item.key!} />
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Demo Button - Top Right */}
            <Link
              href="/demo-users"
              className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-edu-accent-500 to-edu-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:from-edu-accent-600 hover:to-edu-accent-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Demo</span>
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-edu-gray-700 hover:text-edu-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-edu-gray-700 hover:text-edu-primary-600 transition-colors">
                    <div className="w-8 h-8 bg-edu-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-edu-primary-600">
                        {session.user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-edu-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-edu-gray-100">
                        <p className="text-sm font-medium text-edu-gray-900">{session.user.name}</p>
                        <p className="text-xs text-edu-gray-500">{session.user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-edu-gray-700 hover:bg-edu-gray-50"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="block px-4 py-2 text-sm text-edu-gray-700 hover:bg-edu-gray-50"
                      >
                        Billing
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-edu-gray-700 hover:bg-edu-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-edu-gray-700 hover:text-edu-primary-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:from-edu-primary-700 hover:to-edu-secondary-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Start Free Trial
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-edu-gray-200 space-y-2">
                {/* Demo Button for Mobile */}
                <Link
                  href="/demo-users"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-edu-accent-500 to-edu-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:from-edu-accent-600 hover:to-edu-accent-700 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Demo</span>
                </Link>
                
                {!session && (
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:from-edu-primary-700 hover:to-edu-secondary-700 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}