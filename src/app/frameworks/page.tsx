import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  CogIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  UserGroupIcon,
  BeakerIcon,
  CalculatorIcon,
  LanguageIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

const educationalFrameworks = [
  {
    name: 'International Baccalaureate (IB)',
    icon: GlobeAltIcon,
    description: 'A globally recognized educational framework emphasizing critical thinking, intercultural understanding, and holistic development.',
    keyFeatures: [
      'Primary Years Programme (PYP) - Ages 3-12',
      'Middle Years Programme (MYP) - Ages 11-16', 
      'Diploma Programme (DP) - Ages 16-19',
      'Career-related Programme (CP) - Ages 16-19'
    ],
    assessmentMethods: [
      'Continuous assessment throughout the program',
      'External examinations and internal assessments',
      'Extended Essay (4,000-word research project)',
      'Theory of Knowledge (TOK) course',
      'Creativity, Activity, Service (CAS) requirements'
    ],
    subjects: ['Languages', 'Social Studies', 'Sciences', 'Mathematics', 'Arts', 'Personal & Social Education'],
    color: 'from-edu-primary-500 to-edu-primary-600'
  },
  {
    name: 'International General Certificate of Secondary Education (IGCSE)',
    icon: BookOpenIcon,
    description: 'Cambridge International curriculum designed for 14-16 year olds, providing excellent preparation for advanced study.',
    keyFeatures: [
      'Flexible curriculum with 70+ subjects',
      'International perspective with local relevance',
      'Develops creative thinking and problem-solving skills',
      'Recognized by universities worldwide'
    ],
    assessmentMethods: [
      'Written examinations (external assessment)',
      'Coursework and practical assessments',
      'Oral examinations for languages',
      'Portfolio-based assessments for creative subjects'
    ],
    subjects: ['English', 'Mathematics', 'Sciences', 'Languages', 'Humanities', 'Creative & Technical'],
    color: 'from-edu-secondary-500 to-edu-secondary-600'
  },
  {
    name: 'Indian Certificate of Secondary Education (ICSE)',
    icon: AcademicCapIcon,
    description: 'Comprehensive Indian curriculum focusing on English language proficiency and analytical thinking.',
    keyFeatures: [
      'English as the medium of instruction',
      'Comprehensive and balanced curriculum',
      'Emphasis on practical and application-based learning',
      'Internal assessment component'
    ],
    assessmentMethods: [
      'Board examinations (80% weightage)',
      'Internal assessment (20% weightage)',
      'Practical examinations for science subjects',
      'Project work and assignments'
    ],
    subjects: ['English', 'Hindi/Regional Language', 'Mathematics', 'Science', 'Social Studies', 'Computer Applications'],
    color: 'from-edu-accent-500 to-edu-accent-600'
  },
  {
    name: 'Central Board of Secondary Education (CBSE)',
    icon: CalculatorIcon,
    description: 'National curriculum of India emphasizing conceptual learning and skill development.',
    keyFeatures: [
      'Competency-based education approach',
      'Integration of vocational education',
      'Emphasis on experiential learning',
      'Multiple assessment formats'
    ],
    assessmentMethods: [
      'Board examinations for Classes 10 and 12',
      'Continuous and Comprehensive Evaluation (CCE)',
      'Formative and summative assessments',
      'Practical examinations and project work'
    ],
    subjects: ['Languages', 'Mathematics', 'Science', 'Social Science', 'Skill Subjects', 'Arts Education'],
    color: 'from-edu-warning-500 to-edu-warning-600'
  }
];

const psychologicalFrameworks = [
  {
    name: 'Multiple Intelligences Theory',
    icon: LightBulbIcon,
    description: 'Howard Gardner\'s framework recognizing eight different types of intelligence in students.',
    areas: [
      'Linguistic Intelligence - Word smart',
      'Logical-Mathematical Intelligence - Number smart',
      'Spatial Intelligence - Picture smart',
      'Musical Intelligence - Music smart',
      'Bodily-Kinesthetic Intelligence - Body smart',
      'Interpersonal Intelligence - People smart',
      'Intrapersonal Intelligence - Self smart',
      'Naturalistic Intelligence - Nature smart'
    ],
    assessmentMethods: [
      'Portfolio-based assessments',
      'Performance-based evaluations',
      'Observational checklists',
      'Student self-assessments',
      'Project-based learning outcomes'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Bloom\'s Taxonomy',
    icon: ChartBarIcon,
    description: 'Hierarchical framework for categorizing educational goals and learning objectives.',
    areas: [
      'Remember - Recall facts and basic concepts',
      'Understand - Explain ideas or concepts',
      'Apply - Use information in new situations',
      'Analyze - Draw connections among ideas',
      'Evaluate - Justify a stand or decision',
      'Create - Produce new or original work'
    ],
    assessmentMethods: [
      'Knowledge-based tests and quizzes',
      'Comprehension exercises',
      'Application problems',
      'Analysis projects',
      'Evaluation essays',
      'Creative assignments'
    ],
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Social-Emotional Learning (SEL)',
    icon: HeartIcon,
    description: 'Framework for developing emotional intelligence and social skills in students.',
    areas: [
      'Self-Awareness - Understanding emotions and strengths',
      'Self-Management - Regulating emotions and behaviors',
      'Social Awareness - Empathy and perspective-taking',
      'Relationship Skills - Communication and teamwork',
      'Responsible Decision-Making - Ethical choices'
    ],
    assessmentMethods: [
      'Behavioral observations',
      'Self-reflection journals',
      'Peer feedback assessments',
      'Social skills checklists',
      'Conflict resolution scenarios'
    ],
    color: 'from-pink-500 to-pink-600'
  }
];

const physicalFrameworks = [
  {
    name: 'Fundamental Movement Skills (FMS)',
    icon: UserGroupIcon,
    description: 'Foundation skills that provide the building blocks for more complex physical activities.',
    areas: [
      'Locomotor Skills - Running, jumping, hopping, skipping',
      'Object Control Skills - Throwing, catching, kicking, striking',
      'Stability Skills - Balancing, twisting, turning, bending'
    ],
    assessmentMethods: [
      'Skill demonstration checklists',
      'Performance rubrics',
      'Video analysis',
      'Peer assessments',
      'Progress tracking charts'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Health-Related Fitness Components',
    icon: BeakerIcon,
    description: 'Framework focusing on fitness components that contribute to overall health and well-being.',
    areas: [
      'Cardiovascular Endurance - Heart and lung efficiency',
      'Muscular Strength - Maximum force production',
      'Muscular Endurance - Sustained muscle contractions',
      'Flexibility - Range of motion in joints',
      'Body Composition - Ratio of fat to lean tissue'
    ],
    assessmentMethods: [
      'Fitness testing protocols',
      'Endurance challenges',
      'Strength assessments',
      'Flexibility measurements',
      'Health screenings'
    ],
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Sport Education Model',
    icon: MusicalNoteIcon,
    description: 'Comprehensive framework that teaches sports in an authentic, educationally rich context.',
    areas: [
      'Seasons - Extended units with authentic competition',
      'Affiliation - Team membership and identity',
      'Formal Competition - Structured tournaments',
      'Culminating Event - Championship or festival',
      'Record Keeping - Statistics and achievements',
      'Festivity - Celebration and recognition'
    ],
    assessmentMethods: [
      'Game performance assessments',
      'Leadership role evaluations',
      'Team contribution metrics',
      'Fair play observations',
      'Skill development tracking'
    ],
    color: 'from-orange-500 to-orange-600'
  }
];

export default function FrameworksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-edu-primary-50 via-white to-edu-secondary-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 bg-clip-text text-transparent mb-6">
                Educational Frameworks
              </h1>
              <p className="text-xl text-edu-gray-600 max-w-3xl mx-auto mb-8">
                Comprehensive overview of international and national educational frameworks, 
                psychological assessment methods, and physical education standards supported by EduSight AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-edu-gray-500">
                <span className="bg-edu-primary-100 text-edu-primary-700 px-3 py-1 rounded-full">IB Framework</span>
                <span className="bg-edu-secondary-100 text-edu-secondary-700 px-3 py-1 rounded-full">IGCSE Standards</span>
                <span className="bg-edu-accent-100 text-edu-accent-700 px-3 py-1 rounded-full">ICSE Curriculum</span>
                <span className="bg-edu-warning-100 text-edu-warning-700 px-3 py-1 rounded-full">CBSE Guidelines</span>
              </div>
            </div>
          </div>
        </section>

        {/* EduSight 360 Score Introduction */}
        <section className="py-16 bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">EduSight 360° Score System</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Comprehensive assessment covering Academic, Psychological, and Physical domains with scores ranging from 40-100. 
              Scores below 40 indicate need for medical intervention.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">Academic</div>
                <div className="text-sm opacity-90">IB, IGCSE, ICSE, CBSE frameworks with GPA, attendance, and behavioral assessments</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">Psychological</div>
                <div className="text-sm opacity-90">Cognitive abilities, emotional intelligence, personality traits, and learning styles</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">Physical</div>
                <div className="text-sm opacity-90">Motor skills, fitness levels, health indicators, and sports performance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Frameworks */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-edu-gray-900 mb-4">
                Supported Educational Frameworks
              </h2>
              <p className="text-lg text-edu-gray-600 max-w-2xl mx-auto">
                Comprehensive support for major international and national educational systems with framework-specific assessment methodologies.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {educationalFrameworks.map((framework, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-edu-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`bg-gradient-to-r ${framework.color} p-6 text-white`}>
                    <div className="flex items-center space-x-4">
                      <framework.icon className="h-8 w-8" />
                      <h3 className="text-xl font-bold">{framework.name}</h3>
                    </div>
                    <p className="mt-3 text-white/90">{framework.description}</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {framework.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-edu-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-edu-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Assessment Methods</h4>
                      <ul className="space-y-2">
                        {framework.assessmentMethods.map((method, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <ChartBarIcon className="h-4 w-4 text-edu-secondary-500 mt-0.5 flex-shrink-0" />
                            <span className="text-edu-gray-600 text-sm">{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Subject Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {framework.subjects.map((subject, idx) => (
                          <span key={idx} className="bg-edu-gray-100 text-edu-gray-700 px-2 py-1 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Psychological Assessment Frameworks */}
        <section className="py-20 bg-edu-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-edu-gray-900 mb-4">
                Psychological Assessment Frameworks
              </h2>
              <p className="text-lg text-edu-gray-600 max-w-2xl mx-auto">
                Evidence-based frameworks for understanding and assessing cognitive and emotional development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {psychologicalFrameworks.map((framework, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-edu-gray-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${framework.color} p-6 text-white`}>
                    <framework.icon className="h-8 w-8 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{framework.name}</h3>
                    <p className="text-white/90 text-sm">{framework.description}</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Key Areas</h4>
                      <ul className="space-y-2">
                        {framework.areas.map((area, idx) => (
                          <li key={idx} className="text-edu-gray-600 text-sm flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-edu-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Assessment Methods</h4>
                      <ul className="space-y-1">
                        {framework.assessmentMethods.map((method, idx) => (
                          <li key={idx} className="text-edu-gray-600 text-xs flex items-center space-x-1">
                            <CogIcon className="h-3 w-3 text-edu-neural-500" />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Physical Education Frameworks */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-edu-gray-900 mb-4">
                Physical Education Assessment Frameworks
              </h2>
              <p className="text-lg text-edu-gray-600 max-w-2xl mx-auto">
                Comprehensive frameworks for assessing physical development, motor skills, and health-related fitness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {physicalFrameworks.map((framework, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-edu-gray-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${framework.color} p-6 text-white`}>
                    <framework.icon className="h-8 w-8 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{framework.name}</h3>
                    <p className="text-white/90 text-sm">{framework.description}</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Key Components</h4>
                      <ul className="space-y-2">
                        {framework.areas.map((area, idx) => (
                          <li key={idx} className="text-edu-gray-600 text-sm flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-edu-success-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-edu-gray-900 mb-3">Assessment Methods</h4>
                      <ul className="space-y-1">
                        {framework.assessmentMethods.map((method, idx) => (
                          <li key={idx} className="text-edu-gray-600 text-xs flex items-center space-x-1">
                            <ChartBarIcon className="h-3 w-3 text-edu-success-500" />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Implement These Frameworks?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              EduSight AI supports all major educational frameworks with intelligent assessment tools and analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signin"
                className="bg-white text-edu-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-edu-gray-50 transition-colors"
              >
                Start Free Trial
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-edu-primary-600 transition-colors"
              >
                Contact Our Experts
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
