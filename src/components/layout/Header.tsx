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
  PlayIcon,
  GlobeAltIcon,
  LightBulbIcon,
  HeartIcon,
  TrophyIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  UsersIcon,
  StarIcon
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
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const megaMenuItems = {
    about: {
      title: 'About EduSight',
      description: 'Discover our mission, vision, and the team behind the future of education',
      sections: [
        {
          title: 'Our Story',
          items: [
            { 
              name: 'Mission & Vision', 
              href: '/about#mission', 
              icon: LightBulbIcon, 
              description: 'Transforming education through AI-powered insights',
              badge: 'Core Values'
            },
            { 
              name: 'Our Team', 
              href: '/about#team', 
              icon: UserGroupIcon, 
              description: 'Meet the experts behind EduSight',
              badge: null
            },
            { 
              name: 'Company History', 
              href: '/about#history', 
              icon: ClipboardDocumentCheckIcon, 
              description: 'Our journey in educational technology',
              badge: null
            }
          ]
        },
        {
          title: 'Technology',
          items: [
            { 
              name: 'AI & Machine Learning', 
              href: '/about#technology', 
              icon: SparklesIcon, 
              description: 'Advanced algorithms for educational assessment',
              badge: 'AI-Powered'
            },
            { 
              name: 'Data Security', 
              href: '/about#security', 
              icon: CogIcon, 
              description: 'Enterprise-grade security and privacy',
              badge: 'Secure'
            },
            { 
              name: 'Research & Development', 
              href: '/about#research', 
              icon: BeakerIcon, 
              description: 'Continuous innovation in EdTech',
              badge: null
            }
          ]
        },
        {
          title: 'Impact',
          items: [
            { 
              name: 'Success Stories', 
              href: '/about#success', 
              icon: TrophyIcon, 
              description: 'Real impact on students and schools',
              badge: 'Results'
            },
            { 
              name: 'Global Reach', 
              href: '/about#global', 
              icon: GlobeAltIcon, 
              description: 'Serving educational institutions worldwide',
              badge: 'International'
            },
            { 
              name: 'Awards & Recognition', 
              href: '/about#awards', 
              icon: StarIcon, 
              description: 'Industry recognition and achievements',
              badge: null
            }
          ]
        }
      ],
      cta: {
        title: 'Join Our Mission',
        description: 'Be part of the educational transformation',
        href: '/careers',
        buttonText: 'View Careers'
      }
    },
    frameworks: {
      title: 'Educational Frameworks',
      description: 'Comprehensive support for major educational systems worldwide',
      sections: [
        {
          title: 'International Curricula',
          items: [
            { 
              name: 'International Baccalaureate (IB)', 
              href: '/frameworks#ib', 
              icon: GlobeAltIcon, 
              description: 'PYP, MYP, DP assessment methods',
              badge: 'Popular'
            },
            { 
              name: 'Cambridge IGCSE', 
              href: '/frameworks#igcse', 
              icon: BookOpenIcon, 
              description: 'International secondary education standards',
              badge: null
            },
            { 
              name: 'A-Levels & AS-Levels', 
              href: '/frameworks#alevels', 
              icon: AcademicCapIcon, 
              description: 'Advanced level qualifications',
              badge: null
            }
          ]
        },
        {
          title: 'National Curricula',
          items: [
            { 
              name: 'CBSE Framework', 
              href: '/frameworks#cbse', 
              icon: BookOpenIcon, 
              description: 'Central Board assessment methods',
              badge: 'Featured'
            },
            { 
              name: 'ICSE Standards', 
              href: '/frameworks#icse', 
              icon: DocumentTextIcon, 
              description: 'Certificate evaluation system',
              badge: null
            },
            { 
              name: 'State Board Systems', 
              href: '/frameworks#state', 
              icon: BuildingOfficeIcon, 
              description: 'Regional education frameworks',
              badge: null
            }
          ]
        },
        {
          title: 'Assessment Types',
          items: [
            { 
              name: 'Psychological Assessment', 
              href: '/frameworks#psychological', 
              icon: LightBulbIcon, 
              description: 'Multiple intelligences & cognitive evaluation',
              badge: 'AI-Powered'
            },
            { 
              name: 'Physical Education', 
              href: '/frameworks#physical', 
              icon: HeartIcon, 
              description: 'Motor skills & fitness assessment',
              badge: null
            },
            { 
              name: 'Competency Mapping', 
              href: '/frameworks#competency', 
              icon: ChartBarIcon, 
              description: 'Skill-based evaluation frameworks',
              badge: null
            }
          ]
        }
      ],
      cta: {
        title: 'Explore All Frameworks',
        description: 'Discover how EduSight supports your educational system',
        href: '/frameworks',
        buttonText: 'View All Frameworks'
      }
    },
    solutions: {
      title: 'AI-Powered Solutions',
      description: 'Comprehensive tools for educational excellence',
      sections: [
        {
          title: 'Assessment Platform',
          items: [
            { 
              name: 'EduSight 360° Assessment', 
              href: '/assessments', 
              icon: SparklesIcon, 
              description: 'Comprehensive holistic student evaluation',
              badge: 'Core Feature'
            },
            { 
              name: 'Psychometric Testing', 
              href: '/assessments/psychometric', 
              icon: BeakerIcon, 
              description: 'Personality and aptitude assessments',
              badge: 'Advanced'
            },
            { 
              name: 'DMIT Analysis', 
              href: '/dmit', 
              icon: ClipboardDocumentCheckIcon, 
              description: 'Dermatoglyphics Multiple Intelligence Test',
              badge: 'Premium'
            },
            { 
              name: 'Career Guidance', 
              href: '/career-guidance', 
              icon: TrophyIcon, 
              description: 'AI-driven career recommendations',
              badge: 'AI-Powered'
            }
          ]
        },
        {
          title: 'Analytics & Insights',
          items: [
            { 
              name: 'Student Analytics', 
              href: '/analytics', 
              icon: ChartBarIcon, 
              description: 'Comprehensive performance tracking',
              badge: null
            },
            { 
              name: 'Learning Insights', 
              href: '/insights', 
              icon: LightBulbIcon, 
              description: 'Deep learning pattern analysis',
              badge: 'Smart'
            },
            { 
              name: 'Progress Reports', 
              href: '/reports', 
              icon: DocumentTextIcon, 
              description: 'Detailed progress documentation',
              badge: null
            },
            { 
              name: 'Predictive Analytics', 
              href: '/predictive', 
              icon: SparklesIcon, 
              description: 'Future performance predictions',
              badge: 'AI-Powered'
            }
          ]
        },
        {
          title: 'Management Tools',
          items: [
            { 
              name: 'School Management', 
              href: '/school-management', 
              icon: BuildingOfficeIcon, 
              description: 'Complete institutional management',
              badge: null
            },
            { 
              name: 'Teacher Dashboard', 
              href: '/teacher/dashboard', 
              icon: UserGroupIcon, 
              description: 'Educator collaboration tools',
              badge: null
            },
            { 
              name: 'Parent Portal', 
              href: '/parent-portal', 
              icon: UsersIcon, 
              description: 'Family engagement platform',
              badge: null
            },
            { 
              name: 'Admin Console', 
              href: '/admin', 
              icon: CogIcon, 
              description: 'System administration tools',
              badge: null
            }
          ]
        }
      ],
      cta: {
        title: 'Start Your Journey',
        description: 'Experience the power of AI-driven educational insights',
        href: '/auth/signin',
        buttonText: 'Get Started Free'
      }
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
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-5xl bg-white shadow-2xl border-t-2 border-blue-200 z-50 overflow-hidden rounded-b-xl"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          marginLeft: '0'
        }}
        onMouseEnter={() => handleMouseEnter(menuKey)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{menuData.title}</h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">{menuData.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                      {section.title}
                    </h4>
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className="group block p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                  </h5>
                                  {item.badge && (
                                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                                      item.badge === 'Popular' ? 'bg-green-100 text-green-700' :
                                      item.badge === 'Featured' ? 'bg-blue-100 text-blue-700' :
                                      item.badge === 'AI-Powered' ? 'bg-purple-100 text-purple-700' :
                                      item.badge === 'Premium' ? 'bg-yellow-100 text-yellow-700' :
                                      item.badge === 'Advanced' ? 'bg-red-100 text-red-700' :
                                      item.badge === 'Smart' ? 'bg-indigo-100 text-indigo-700' :
                                      'bg-slate-100 text-slate-700'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{menuData.cta.title}</h4>
                  <p className="text-xs text-slate-600 mb-4">{menuData.cta.description}</p>
                  <Link
                    href={menuData.cta.href}
                    className="inline-flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {menuData.cta.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-slate-600">
                  <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                  <span>Trusted by 500+ schools</span>
                </div>
                <div className="flex items-center text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  <span>99.9% uptime</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/contact"
                  className="text-xs text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Contact Sales
                </Link>
                <Link
                  href="/support"
                  className="text-xs text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-14">
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
                  <button className="flex items-center text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                    {item.name}
                    <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.key ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
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

            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {session.user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{session.user.name}</p>
                        <p className="text-xs text-slate-500">{session.user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Billing
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
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
                  className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors duration-200"
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
          <div className="lg:hidden border-t border-slate-200 py-4 bg-white/95 backdrop-blur-lg">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200 space-y-3">
                {/* Demo Button for Mobile */}
                <Link
                  href="/demo-users"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Demo</span>
                </Link>

                {!session && (
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
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
