// Career Mapping Data based on Kaggle Jobs and Skills Mapping Dataset
// Reference: https://www.kaggle.com/datasets/emaadakhter/jobs-and-skills-mapping-for-career-analysis

export interface JobSkillMapping {
  jobId: string;
  jobTitle: string;
  jobCategory: string;
  jobDescription: string;
  requiredSkills: string[];
  preferredSkills: string[];
  skillLevels: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>;
  educationLevel: 'HIGH_SCHOOL' | 'BACHELORS' | 'MASTERS' | 'DOCTORATE' | 'CERTIFICATION';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  growthRate: number; // Percentage growth
  workEnvironment: string[];
  personalityTraits: string[];
  industry: string;
  location: string[];
  remoteWork: boolean;
  references: string[];
}

export interface SkillDefinition {
  skillId: string;
  skillName: string;
  category: 'TECHNICAL' | 'SOFT' | 'CREATIVE' | 'ANALYTICAL' | 'LEADERSHIP' | 'COMMUNICATION';
  subcategory: string;
  description: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
  learningDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  learningTime: string;
  prerequisites: string[];
  relatedSkills: string[];
  resources: {
    type: 'COURSE' | 'BOOK' | 'CERTIFICATION' | 'PRACTICE' | 'MENTORSHIP';
    name: string;
    url?: string;
    cost?: string;
    duration?: string;
  }[];
}

// Sample job-skill mappings based on the Kaggle dataset structure
export const JOB_SKILL_MAPPINGS: JobSkillMapping[] = [
  {
    jobId: 'data-scientist',
    jobTitle: 'Data Scientist',
    jobCategory: 'Technology',
    jobDescription: 'Analyze complex data to help organizations make informed decisions',
    requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
    preferredSkills: ['Deep Learning', 'Big Data', 'Cloud Computing', 'Business Intelligence'],
    skillLevels: {
      'Python': 'ADVANCED',
      'R': 'INTERMEDIATE',
      'SQL': 'ADVANCED',
      'Machine Learning': 'ADVANCED',
      'Statistics': 'ADVANCED',
      'Data Visualization': 'INTERMEDIATE'
    },
    educationLevel: 'MASTERS',
    experienceLevel: 'MID',
    salaryRange: { min: 80000, max: 150000, currency: 'USD' },
    growthRate: 15.0,
    workEnvironment: ['Office', 'Remote', 'Hybrid'],
    personalityTraits: ['Analytical', 'Curious', 'Detail-oriented', 'Problem-solving'],
    industry: 'Technology',
    location: ['Global'],
    remoteWork: true,
    references: ['Kaggle Jobs and Skills Dataset', 'Bureau of Labor Statistics']
  },
  {
    jobId: 'software-engineer',
    jobTitle: 'Software Engineer',
    jobCategory: 'Technology',
    jobDescription: 'Design, develop, and maintain software applications',
    requiredSkills: ['Programming', 'Software Development', 'Problem Solving', 'Version Control'],
    preferredSkills: ['Cloud Computing', 'DevOps', 'Mobile Development', 'Web Development'],
    skillLevels: {
      'Programming': 'ADVANCED',
      'Software Development': 'ADVANCED',
      'Problem Solving': 'ADVANCED',
      'Version Control': 'INTERMEDIATE'
    },
    educationLevel: 'BACHELORS',
    experienceLevel: 'ENTRY',
    salaryRange: { min: 60000, max: 120000, currency: 'USD' },
    growthRate: 22.0,
    workEnvironment: ['Office', 'Remote', 'Hybrid'],
    personalityTraits: ['Logical', 'Creative', 'Collaborative', 'Persistent'],
    industry: 'Technology',
    location: ['Global'],
    remoteWork: true,
    references: ['Kaggle Jobs and Skills Dataset', 'Stack Overflow Developer Survey']
  },
  {
    jobId: 'teacher',
    jobTitle: 'Teacher',
    jobCategory: 'Education',
    jobDescription: 'Educate students and facilitate learning in various subjects',
    requiredSkills: ['Communication', 'Teaching', 'Subject Knowledge', 'Classroom Management'],
    preferredSkills: ['Educational Technology', 'Curriculum Development', 'Student Assessment'],
    skillLevels: {
      'Communication': 'ADVANCED',
      'Teaching': 'ADVANCED',
      'Subject Knowledge': 'ADVANCED',
      'Classroom Management': 'INTERMEDIATE'
    },
    educationLevel: 'BACHELORS',
    experienceLevel: 'ENTRY',
    salaryRange: { min: 40000, max: 70000, currency: 'USD' },
    growthRate: 4.0,
    workEnvironment: ['School', 'Classroom'],
    personalityTraits: ['Patient', 'Empathetic', 'Enthusiastic', 'Organized'],
    industry: 'Education',
    location: ['Local', 'Regional'],
    remoteWork: false,
    references: ['Kaggle Jobs and Skills Dataset', 'National Education Association']
  },
  {
    jobId: 'doctor',
    jobTitle: 'Doctor',
    jobCategory: 'Healthcare',
    jobDescription: 'Diagnose and treat medical conditions, provide patient care',
    requiredSkills: ['Medical Knowledge', 'Diagnosis', 'Patient Care', 'Communication'],
    preferredSkills: ['Research', 'Medical Technology', 'Specialization'],
    skillLevels: {
      'Medical Knowledge': 'EXPERT',
      'Diagnosis': 'EXPERT',
      'Patient Care': 'ADVANCED',
      'Communication': 'ADVANCED'
    },
    educationLevel: 'DOCTORATE',
    experienceLevel: 'SENIOR',
    salaryRange: { min: 150000, max: 300000, currency: 'USD' },
    growthRate: 3.0,
    workEnvironment: ['Hospital', 'Clinic', 'Office'],
    personalityTraits: ['Compassionate', 'Detail-oriented', 'Stress-resistant', 'Ethical'],
    industry: 'Healthcare',
    location: ['Local', 'Regional'],
    remoteWork: false,
    references: ['Kaggle Jobs and Skills Dataset', 'American Medical Association']
  },
  {
    jobId: 'marketing-manager',
    jobTitle: 'Marketing Manager',
    jobCategory: 'Business',
    jobDescription: 'Develop and execute marketing strategies to promote products or services',
    requiredSkills: ['Marketing Strategy', 'Digital Marketing', 'Analytics', 'Communication'],
    preferredSkills: ['Social Media', 'Content Creation', 'Brand Management', 'SEO'],
    skillLevels: {
      'Marketing Strategy': 'ADVANCED',
      'Digital Marketing': 'ADVANCED',
      'Analytics': 'INTERMEDIATE',
      'Communication': 'ADVANCED'
    },
    educationLevel: 'BACHELORS',
    experienceLevel: 'MID',
    salaryRange: { min: 50000, max: 100000, currency: 'USD' },
    growthRate: 10.0,
    workEnvironment: ['Office', 'Remote', 'Hybrid'],
    personalityTraits: ['Creative', 'Strategic', 'Results-oriented', 'Collaborative'],
    industry: 'Business',
    location: ['Global'],
    remoteWork: true,
    references: ['Kaggle Jobs and Skills Dataset', 'American Marketing Association']
  }
];

// Comprehensive skill definitions
export const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    skillId: 'python',
    skillName: 'Python',
    category: 'TECHNICAL',
    subcategory: 'Programming',
    description: 'High-level programming language used for data science, web development, and automation',
    importance: 'CRITICAL',
    learningDifficulty: 'MEDIUM',
    learningTime: '3-6 months',
    prerequisites: ['Basic Programming Concepts'],
    relatedSkills: ['Data Analysis', 'Machine Learning', 'Web Development'],
    resources: [
      { type: 'COURSE', name: 'Python for Everybody', url: 'https://www.coursera.org/specializations/python', cost: 'Free', duration: '4 months' },
      { type: 'BOOK', name: 'Automate the Boring Stuff with Python', cost: 'Free online', duration: '2-3 months' },
      { type: 'CERTIFICATION', name: 'PCAP - Certified Associate in Python Programming', cost: '$295', duration: '1 month' }
    ]
  },
  {
    skillId: 'communication',
    skillName: 'Communication',
    category: 'SOFT',
    subcategory: 'Interpersonal',
    description: 'Ability to effectively convey information and ideas through various channels',
    importance: 'CRITICAL',
    learningDifficulty: 'MEDIUM',
    learningTime: 'Ongoing',
    prerequisites: ['Basic Language Skills'],
    relatedSkills: ['Presentation', 'Writing', 'Active Listening'],
    resources: [
      { type: 'COURSE', name: 'Communication Skills for Success', cost: 'Free', duration: '1 month' },
      { type: 'PRACTICE', name: 'Join Toastmasters International', cost: '$45/year', duration: 'Ongoing' },
      { type: 'BOOK', name: 'Crucial Conversations', cost: '$15', duration: '2 weeks' }
    ]
  },
  {
    skillId: 'machine-learning',
    skillName: 'Machine Learning',
    category: 'TECHNICAL',
    subcategory: 'Data Science',
    description: 'Application of artificial intelligence that enables systems to learn and improve from experience',
    importance: 'CRITICAL',
    learningDifficulty: 'HARD',
    learningTime: '6-12 months',
    prerequisites: ['Python', 'Statistics', 'Linear Algebra'],
    relatedSkills: ['Deep Learning', 'Data Analysis', 'Statistics'],
    resources: [
      { type: 'COURSE', name: 'Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', cost: 'Free', duration: '3 months' },
      { type: 'BOOK', name: 'Hands-On Machine Learning', cost: '$50', duration: '4 months' },
      { type: 'CERTIFICATION', name: 'AWS Machine Learning Specialty', cost: '$300', duration: '2 months' }
    ]
  },
  {
    skillId: 'leadership',
    skillName: 'Leadership',
    category: 'LEADERSHIP',
    subcategory: 'Management',
    description: 'Ability to guide, motivate, and influence others to achieve common goals',
    importance: 'IMPORTANT',
    learningDifficulty: 'HARD',
    learningTime: 'Ongoing',
    prerequisites: ['Communication', 'Emotional Intelligence'],
    relatedSkills: ['Team Management', 'Strategic Thinking', 'Decision Making'],
    resources: [
      { type: 'COURSE', name: 'Leadership Principles', cost: 'Free', duration: '1 month' },
      { type: 'BOOK', name: 'The 7 Habits of Highly Effective People', cost: '$20', duration: '1 month' },
      { type: 'MENTORSHIP', name: 'Find a Leadership Mentor', cost: 'Free', duration: 'Ongoing' }
    ]
  }
];

// Career mapping algorithm
export interface CareerMatch {
  jobId: string;
  jobTitle: string;
  matchScore: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  timeline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PersonalityProfile {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  mbti?: {
    type: string;
    scores: Record<string, number>;
  };
  skills: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>;
  interests: string[];
  values: string[];
  academicPerformance: Record<string, number>;
}

export function calculateCareerMatches(
  profile: PersonalityProfile,
  jobMappings: JobSkillMapping[] = JOB_SKILL_MAPPINGS
): CareerMatch[] {
  const matches: CareerMatch[] = [];

  for (const job of jobMappings) {
    const matchScore = calculateMatchScore(profile, job);
    const confidence = calculateConfidence(profile, job);
    
    if (matchScore > 0.3) { // Only include jobs with reasonable match
      matches.push({
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        matchScore,
        confidence,
        reasoning: generateReasoning(profile, job, matchScore),
        strengths: identifyStrengths(profile, job),
        gaps: identifyGaps(profile, job),
        recommendations: generateRecommendations(profile, job),
        timeline: generateTimeline(profile, job),
        priority: determinePriority(matchScore, confidence)
      });
    }
  }

  // Sort by match score and confidence
  return matches.sort((a, b) => {
    const scoreA = (a.matchScore * 0.7) + (a.confidence * 0.3);
    const scoreB = (b.matchScore * 0.7) + (b.confidence * 0.3);
    return scoreB - scoreA;
  });
}

function calculateMatchScore(profile: PersonalityProfile, job: JobSkillMapping): number {
  let score = 0;
  let factors = 0;

  // Skill matching (40% weight)
  const skillScore = calculateSkillMatch(profile.skills, job.requiredSkills, job.skillLevels);
  score += skillScore * 0.4;
  factors += 0.4;

  // Personality matching (30% weight)
  const personalityScore = calculatePersonalityMatch(profile.bigFive, job.personalityTraits);
  score += personalityScore * 0.3;
  factors += 0.3;

  // Interest matching (20% weight)
  const interestScore = calculateInterestMatch(profile.interests, job.jobCategory);
  score += interestScore * 0.2;
  factors += 0.2;

  // Academic performance (10% weight)
  const academicScore = calculateAcademicMatch(profile.academicPerformance, job.educationLevel);
  score += academicScore * 0.1;
  factors += 0.1;

  return factors > 0 ? score / factors : 0;
}

function calculateSkillMatch(
  userSkills: Record<string, string>,
  requiredSkills: string[],
  skillLevels: Record<string, string>
): number {
  if (requiredSkills.length === 0) return 0;

  let totalScore = 0;
  let matchedSkills = 0;

  for (const skill of requiredSkills) {
    const userLevel = userSkills[skill.toLowerCase()];
    const requiredLevel = skillLevels[skill];

    if (userLevel) {
      matchedSkills++;
      const levelScore = getLevelScore(userLevel, requiredLevel);
      totalScore += levelScore;
    }
  }

  return matchedSkills > 0 ? totalScore / requiredSkills.length : 0;
}

function getLevelScore(userLevel: string, requiredLevel: string): number {
  const levels = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3, 'EXPERT': 4 };
  const userScore = levels[userLevel as keyof typeof levels] || 0;
  const requiredScore = levels[requiredLevel as keyof typeof levels] || 0;

  if (userScore >= requiredScore) return 1.0;
  return userScore / requiredScore;
}

function calculatePersonalityMatch(
  bigFive: PersonalityProfile['bigFive'],
  preferredTraits: string[]
): number {
  // Map Big Five traits to job preferences
  const traitMapping: Record<string, number> = {
    'Analytical': bigFive.openness * 0.5 + bigFive.conscientiousness * 0.5,
    'Creative': bigFive.openness,
    'Detail-oriented': bigFive.conscientiousness,
    'Social': bigFive.extraversion,
    'Cooperative': bigFive.agreeableness,
    'Stable': 1 - bigFive.neuroticism,
    'Curious': bigFive.openness,
    'Organized': bigFive.conscientiousness,
    'Outgoing': bigFive.extraversion,
    'Trusting': bigFive.agreeableness
  };

  if (preferredTraits.length === 0) return 0.5; // Neutral if no traits specified

  let totalScore = 0;
  for (const trait of preferredTraits) {
    totalScore += traitMapping[trait] || 0.5;
  }

  return totalScore / preferredTraits.length;
}

function calculateInterestMatch(interests: string[], jobCategory: string): number {
  const categoryMapping: Record<string, string[]> = {
    'Technology': ['programming', 'computers', 'innovation', 'problem-solving'],
    'Healthcare': ['helping others', 'science', 'medicine', 'wellness'],
    'Education': ['teaching', 'learning', 'mentoring', 'knowledge'],
    'Business': ['leadership', 'strategy', 'management', 'entrepreneurship'],
    'Arts': ['creativity', 'design', 'expression', 'aesthetics']
  };

  const relevantInterests = categoryMapping[jobCategory.toLowerCase()] || [];
  if (relevantInterests.length === 0) return 0.5;

  let matches = 0;
  for (const interest of interests) {
    if (relevantInterests.some(ri => interest.toLowerCase().includes(ri))) {
      matches++;
    }
  }

  return matches / relevantInterests.length;
}

function calculateAcademicMatch(
  academicPerformance: Record<string, number>,
  educationLevel: string
): number {
  const avgScore = Object.values(academicPerformance).reduce((sum, score) => sum + score, 0) / Object.values(academicPerformance).length;
  
  const levelRequirements: Record<string, number> = {
    'HIGH_SCHOOL': 60,
    'BACHELORS': 70,
    'MASTERS': 80,
    'DOCTORATE': 90,
    'CERTIFICATION': 65
  };

  const required = levelRequirements[educationLevel] || 70;
  return Math.min(avgScore / required, 1.0);
}

function calculateConfidence(profile: PersonalityProfile, job: JobSkillMapping): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence if we have more data
  const hasSkills = Object.keys(profile.skills).length > 0;
  const hasPersonality = Object.values(profile.bigFive).some(score => score > 0);
  const hasInterests = profile.interests.length > 0;
  const hasAcademic = Object.keys(profile.academicPerformance).length > 0;

  const dataPoints = [hasSkills, hasPersonality, hasInterests, hasAcademic].filter(Boolean).length;
  confidence += (dataPoints / 4) * 0.4;

  // Increase confidence if job has detailed requirements
  if (job.requiredSkills.length > 3) confidence += 0.1;

  return Math.min(confidence, 1.0);
}

function generateReasoning(profile: PersonalityProfile, job: JobSkillMapping, matchScore: number): string {
  const reasons = [];
  
  if (matchScore > 0.8) {
    reasons.push(`Excellent match based on your profile and the requirements for ${job.jobTitle}.`);
  } else if (matchScore > 0.6) {
    reasons.push(`Good match with strong alignment between your skills and ${job.jobTitle} requirements.`);
  } else {
    reasons.push(`Moderate match with some areas of alignment for ${job.jobTitle}.`);
  }

  // Add specific reasoning based on strengths
  const strengths = identifyStrengths(profile, job);
  if (strengths.length > 0) {
    reasons.push(`Your strengths in ${strengths.slice(0, 2).join(' and ')} align well with this role.`);
  }

  return reasons.join(' ');
}

function identifyStrengths(profile: PersonalityProfile, job: JobSkillMapping): string[] {
  const strengths = [];
  
  // Check skill strengths
  for (const skill of job.requiredSkills) {
    const userLevel = profile.skills[skill.toLowerCase()];
    const requiredLevel = job.skillLevels[skill];
    
    if (userLevel && getLevelScore(userLevel, requiredLevel) >= 0.8) {
      strengths.push(skill);
    }
  }

  return strengths;
}

function identifyGaps(profile: PersonalityProfile, job: JobSkillMapping): string[] {
  const gaps = [];
  
  // Check skill gaps
  for (const skill of job.requiredSkills) {
    const userLevel = profile.skills[skill.toLowerCase()];
    const requiredLevel = job.skillLevels[skill];
    
    if (!userLevel || getLevelScore(userLevel, requiredLevel) < 0.6) {
      gaps.push(skill);
    }
  }

  return gaps;
}

function generateRecommendations(profile: PersonalityProfile, job: JobSkillMapping): string[] {
  const recommendations = [];
  const gaps = identifyGaps(profile, job);
  
  if (gaps.length > 0) {
    recommendations.push(`Develop skills in: ${gaps.slice(0, 3).join(', ')}`);
  }
  
  recommendations.push(`Consider gaining experience in ${job.jobCategory.toLowerCase()} through internships or projects`);
  recommendations.push(`Build a portfolio showcasing relevant work in this field`);
  
  return recommendations;
}

function generateTimeline(profile: PersonalityProfile, job: JobSkillMapping): string {
  const gaps = identifyGaps(profile, job);
  const gapCount = gaps.length;
  
  if (gapCount === 0) {
    return 'Ready to pursue immediately';
  } else if (gapCount <= 2) {
    return '6-12 months with focused skill development';
  } else if (gapCount <= 4) {
    return '1-2 years with comprehensive preparation';
  } else {
    return '2-3 years with extensive skill building and experience';
  }
}

function determinePriority(matchScore: number, confidence: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  const combinedScore = (matchScore * 0.7) + (confidence * 0.3);
  
  if (combinedScore >= 0.8) return 'HIGH';
  if (combinedScore >= 0.6) return 'MEDIUM';
  return 'LOW';
}

// Export utility functions
export {
  calculateMatchScore,
  calculateConfidence,
  generateReasoning,
  identifyStrengths,
  identifyGaps,
  generateRecommendations,
  generateTimeline,
  determinePriority
};
