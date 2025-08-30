// SEO Configuration for EduSight AI Analytics Platform
export const seoConfig = {
  // Primary SEO Data
  siteName: 'EduSight AI',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://edusight.ai',
  description: 'AI-powered educational analytics platform providing comprehensive 360° student assessments. Academic, physical, and psychological evaluation with machine learning insights for students, parents, schools, and educators.',
  
  // Keywords Strategy
  keywords: [
    // Primary Keywords
    'educational analytics platform',
    'student assessment system',
    'AI education technology',
    'EduSight 360 score',
    
    // Secondary Keywords
    'academic performance tracking',
    'psychological assessment students',
    'physical education evaluation',
    'student progress analytics',
    'educational data analytics',
    'school management software',
    
    // Long-tail Keywords
    'comprehensive student assessment platform',
    'AI-powered educational insights',
    'student mental health monitoring',
    'academic progress prediction',
    'educational assessment automation',
    'parent student monitoring dashboard',
    
    // Location-based Keywords
    'education technology India',
    'student assessment software India',
    'school analytics platform',
    'CBSE student assessment',
    'ICSE student evaluation',
    'IB student tracking',
    
    // Role-based Keywords
    'parent dashboard student progress',
    'teacher assessment tools',
    'school administrator analytics',
    'psychologist student evaluation',
    'physical education assessment',
    
    // Feature-based Keywords
    'DMIT assessment',
    'NEP 2020 aligned platform',
    'machine learning education',
    'predictive analytics students',
    'automated report generation'
  ],
  
  // Open Graph Data
  openGraph: {
    type: 'website',
    siteName: 'EduSight AI - Educational Analytics Platform',
    title: 'EduSight AI | Comprehensive Student Assessment & Analytics Platform',
    description: 'Transform education with AI-powered 360° student assessments. Track academic, physical, and psychological development with advanced analytics and predictive insights.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduSight AI Educational Analytics Platform'
      }
    ]
  },
  
  // Twitter Card Data
  twitter: {
    card: 'summary_large_image',
    site: '@EduSightAI',
    creator: '@EduSightAI',
    title: 'EduSight AI | AI-Powered Educational Analytics',
    description: 'Comprehensive 360° student assessments with AI insights for better educational outcomes.',
    image: '/images/twitter-card.jpg'
  },
  
  // Structured Data
  organization: {
    '@type': 'Organization',
    name: 'EduSight AI',
    description: 'AI-powered educational analytics platform',
    url: 'https://edusight.ai',
    logo: 'https://edusight.ai/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'Customer Service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/EduSightAI',
      'https://linkedin.com/company/edusight-ai',
      'https://facebook.com/EduSightAI'
    ]
  },
  
  // Educational Service Schema
  service: {
    '@type': 'Service',
    name: 'Educational Analytics and Assessment',
    description: 'Comprehensive student assessment platform with AI-powered insights',
    provider: {
      '@type': 'Organization',
      name: 'EduSight AI'
    },
    serviceType: 'Educational Technology',
    areaServed: 'India',
    audience: {
      '@type': 'Audience',
      audienceType: 'Educational Institutions, Parents, Students'
    }
  },
  
  // FAQ Schema Data
  faqData: [
    {
      question: 'What is EduSight 360° Score?',
      answer: 'EduSight 360° Score is a comprehensive assessment metric that evaluates students across academic, physical, and psychological domains, providing a holistic view of student development and identifying areas needing attention.'
    },
    {
      question: 'How does AI help in educational assessment?',
      answer: 'Our AI analyzes multiple data points to provide predictive insights, identify learning patterns, suggest personalized recommendations, and generate detailed reports for better educational outcomes.'
    },
    {
      question: 'Is EduSight compatible with Indian educational boards?',
      answer: 'Yes, EduSight supports all major Indian educational frameworks including CBSE, ICSE, IGCSE, IB, and state boards, aligned with NEP 2020 guidelines.'
    },
    {
      question: 'What types of assessments does EduSight provide?',
      answer: 'EduSight provides academic assessments, physical fitness evaluations, psychological wellbeing assessments, and DMIT (Dermatoglyphics Multiple Intelligence Test) for comprehensive student analysis.'
    }
  ],
  
  // Robots and Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'EduSight AI | Comprehensive Student Assessment & Analytics Platform',
    description: 'Transform education with AI-powered 360° student assessments. Track academic, physical, and psychological development with advanced analytics for students, parents, and schools.',
    keywords: 'educational analytics, student assessment, AI education, EduSight 360 score, academic tracking'
  },
  
  about: {
    title: 'About EduSight AI | Educational Technology Innovation',
    description: 'Learn about EduSight AI\'s mission to revolutionize education through comprehensive student assessments and AI-powered analytics. Aligned with NEP 2020 for better learning outcomes.',
    keywords: 'about EduSight, educational technology, AI education innovation, NEP 2020, student assessment platform'
  },
  
  frameworks: {
    title: 'Educational Frameworks | CBSE, ICSE, IB, IGCSE Support | EduSight',
    description: 'EduSight supports all major educational frameworks including CBSE, ICSE, IB, IGCSE, and state boards. Comprehensive assessment aligned with curriculum standards.',
    keywords: 'CBSE assessment, ICSE evaluation, IB student tracking, IGCSE analytics, educational frameworks'
  },
  
  pricing: {
    title: 'EduSight Pricing | Affordable Educational Analytics Plans',
    description: 'Choose the perfect EduSight plan for your needs. Gold (₹899), Platinum (₹1499), Enterprise plans. DMIT assessment available. Transparent pricing with GST.',
    keywords: 'EduSight pricing, educational software cost, student assessment plans, DMIT pricing'
  },
  
  contact: {
    title: 'Contact EduSight AI | Educational Analytics Support',
    description: 'Get in touch with EduSight AI for educational analytics solutions. Contact our team for demos, support, and partnership opportunities.',
    keywords: 'contact EduSight, educational technology support, student assessment help, demo request'
  },
  
  solutions: {
    title: 'EduSight Solutions | AI-Powered Educational Analytics',
    description: 'Discover EduSight\'s comprehensive solutions for students, parents, schools, and educators. AI-powered assessments, predictive analytics, and personalized insights.',
    keywords: 'educational solutions, AI analytics, student assessment tools, school management software'
  }
}
