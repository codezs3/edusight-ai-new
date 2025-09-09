import { 
  AgeGroup, 
  AgeGroupConfig, 
  AssessmentFramework, 
  AssessmentDomain, 
  FrameworkType, 
  AssessmentType 
} from '@/types/assessment';

// Age Group Configurations
export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  EARLY_CHILDHOOD: {
    ageGroup: 'EARLY_CHILDHOOD',
    minAge: 3,
    maxAge: 5,
    description: 'Pre-school and Kindergarten',
    academicSubjects: ['Language Development', 'Numeracy', 'Creative Arts', 'Social Skills'],
    psychometricTraits: ['Attention Span', 'Social Interaction', 'Emotional Regulation', 'Basic Cognitive Skills'],
    physicalMetrics: ['Gross Motor Skills', 'Fine Motor Skills', 'Balance', 'Coordination'],
    assessmentMethods: ['BEHAVIORAL', 'SKILL_BASED', 'PORTFOLIO']
  },
  PRIMARY: {
    ageGroup: 'PRIMARY',
    minAge: 6,
    maxAge: 10,
    description: 'Grades 1-5',
    academicSubjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Music'],
    psychometricTraits: ['Learning Style', 'Attention', 'Memory', 'Problem Solving', 'Social Skills'],
    physicalMetrics: ['Fitness', 'Coordination', 'Balance', 'Endurance', 'Flexibility'],
    assessmentMethods: ['MARKS_BASED', 'RUBRICS_BASED', 'PORTFOLIO', 'BEHAVIORAL']
  },
  MIDDLE: {
    ageGroup: 'MIDDLE',
    minAge: 11,
    maxAge: 13,
    description: 'Grades 6-8',
    academicSubjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Languages', 'Computer Science'],
    psychometricTraits: ['Critical Thinking', 'Emotional Intelligence', 'Learning Style', 'Social Skills', 'Self-Regulation'],
    physicalMetrics: ['Fitness', 'Strength', 'Endurance', 'Coordination', 'Flexibility', 'Balance'],
    assessmentMethods: ['MARKS_BASED', 'RUBRICS_BASED', 'COMPETENCY_BASED', 'BEHAVIORAL']
  },
  SECONDARY: {
    ageGroup: 'SECONDARY',
    minAge: 14,
    maxAge: 16,
    description: 'Grades 9-10',
    academicSubjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Languages'],
    psychometricTraits: ['Critical Thinking', 'Emotional Intelligence', 'Learning Style', 'Career Interests', 'Personality Traits'],
    physicalMetrics: ['Fitness', 'Strength', 'Endurance', 'Coordination', 'Flexibility', 'Sports Performance'],
    assessmentMethods: ['MARKS_BASED', 'RUBRICS_BASED', 'COMPETENCY_BASED', 'BEHAVIORAL', 'SKILL_BASED']
  },
  SENIOR_SECONDARY: {
    ageGroup: 'SENIOR_SECONDARY',
    minAge: 17,
    maxAge: 18,
    description: 'Grades 11-12',
    academicSubjects: ['Advanced Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science'],
    psychometricTraits: ['Critical Thinking', 'Emotional Intelligence', 'Learning Style', 'Career Aptitude', 'Personality Assessment', 'Leadership Skills'],
    physicalMetrics: ['Fitness', 'Strength', 'Endurance', 'Coordination', 'Flexibility', 'Sports Performance', 'Health Metrics'],
    assessmentMethods: ['MARKS_BASED', 'RUBRICS_BASED', 'COMPETENCY_BASED', 'BEHAVIORAL', 'SKILL_BASED', 'PORTFOLIO']
  }
};

// Assessment Frameworks by Domain
export const ACADEMIC_FRAMEWORKS: AssessmentFramework[] = [
  {
    id: 'cbse',
    name: 'Central Board of Secondary Education (CBSE)',
    type: 'CBSE',
    domain: 'ACADEMIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Hindi', 'Computer Science', 'Physical Education'],
    assessmentTypes: ['MARKS_BASED', 'RUBRICS_BASED', 'COMPETENCY_BASED'],
    description: 'National curriculum framework for Indian schools',
    isActive: true
  },
  {
    id: 'icse',
    name: 'Indian Certificate of Secondary Education (ICSE)',
    type: 'ICSE',
    domain: 'ACADEMIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Computer Applications', 'Art'],
    assessmentTypes: ['MARKS_BASED', 'RUBRICS_BASED', 'PORTFOLIO'],
    description: 'Comprehensive curriculum with emphasis on English and analytical skills',
    isActive: true
  },
  {
    id: 'igcse',
    name: 'International General Certificate of Secondary Education (IGCSE)',
    type: 'IGCSE',
    domain: 'ACADEMIC',
    ageGroups: ['SECONDARY', 'SENIOR_SECONDARY'],
    subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science'],
    assessmentTypes: ['MARKS_BASED', 'RUBRICS_BASED', 'COMPETENCY_BASED'],
    description: 'International curriculum with global recognition',
    isActive: true
  },
  {
    id: 'ib',
    name: 'International Baccalaureate (IB)',
    type: 'IB',
    domain: 'ACADEMIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    subjects: ['Mathematics', 'English', 'Sciences', 'Individuals and Societies', 'Arts', 'Physical Education', 'Theory of Knowledge'],
    assessmentTypes: ['RUBRICS_BASED', 'COMPETENCY_BASED', 'PORTFOLIO'],
    description: 'Holistic international education program',
    isActive: true
  }
];

export const PSYCHOMETRIC_FRAMEWORKS: AssessmentFramework[] = [
  {
    id: 'big-five',
    name: 'Big Five Personality Traits',
    type: 'CUSTOM',
    domain: 'PSYCHOMETRIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    traits: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
    assessmentTypes: ['BEHAVIORAL', 'SKILL_BASED'],
    description: 'Comprehensive personality assessment framework',
    isActive: true
  },
  {
    id: 'mbti',
    name: 'Myers-Briggs Type Indicator (MBTI)',
    type: 'CUSTOM',
    domain: 'PSYCHOMETRIC',
    ageGroups: ['SECONDARY', 'SENIOR_SECONDARY'],
    traits: ['Extraversion/Introversion', 'Sensing/Intuition', 'Thinking/Feeling', 'Judging/Perceiving'],
    assessmentTypes: ['BEHAVIORAL'],
    description: 'Personality type assessment for career guidance',
    isActive: true
  },
  {
    id: 'emotional-intelligence',
    name: 'Emotional Intelligence Assessment',
    type: 'CUSTOM',
    domain: 'PSYCHOMETRIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    traits: ['Self-Awareness', 'Self-Regulation', 'Motivation', 'Empathy', 'Social Skills'],
    assessmentTypes: ['BEHAVIORAL', 'SKILL_BASED'],
    description: 'Assessment of emotional and social competencies',
    isActive: true
  },
  {
    id: 'learning-styles',
    name: 'Learning Styles Assessment',
    type: 'CUSTOM',
    domain: 'PSYCHOMETRIC',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    traits: ['Visual Learning', 'Auditory Learning', 'Kinesthetic Learning', 'Reading/Writing'],
    assessmentTypes: ['BEHAVIORAL', 'SKILL_BASED'],
    description: 'Identification of preferred learning modalities',
    isActive: true
  }
];

export const PHYSICAL_FRAMEWORKS: AssessmentFramework[] = [
  {
    id: 'fitness-assessment',
    name: 'Comprehensive Fitness Assessment',
    type: 'CUSTOM',
    domain: 'PHYSICAL',
    ageGroups: ['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    metrics: ['Cardiovascular Endurance', 'Muscular Strength', 'Muscular Endurance', 'Flexibility', 'Body Composition'],
    assessmentTypes: ['SKILL_BASED', 'COMPETENCY_BASED'],
    description: 'Standard fitness assessment for all age groups',
    isActive: true
  },
  {
    id: 'motor-skills',
    name: 'Motor Skills Development',
    type: 'CUSTOM',
    domain: 'PHYSICAL',
    ageGroups: ['EARLY_CHILDHOOD', 'PRIMARY', 'MIDDLE'],
    metrics: ['Gross Motor Skills', 'Fine Motor Skills', 'Coordination', 'Balance', 'Agility'],
    assessmentTypes: ['SKILL_BASED', 'BEHAVIORAL'],
    description: 'Assessment of fundamental movement skills',
    isActive: true
  },
  {
    id: 'sports-performance',
    name: 'Sports Performance Assessment',
    type: 'CUSTOM',
    domain: 'PHYSICAL',
    ageGroups: ['MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
    metrics: ['Speed', 'Power', 'Agility', 'Coordination', 'Sport-Specific Skills'],
    assessmentTypes: ['SKILL_BASED', 'COMPETENCY_BASED'],
    description: 'Specialized assessment for athletic performance',
    isActive: true
  }
];

// Utility Functions
export function getAgeGroup(age: number): AgeGroup {
  for (const [group, config] of Object.entries(AGE_GROUP_CONFIGS)) {
    if (age >= config.minAge && age <= config.maxAge) {
      return group as AgeGroup;
    }
  }
  return 'SENIOR_SECONDARY'; // Default fallback
}

export function getFrameworksForAgeGroup(age: number, domain: AssessmentDomain): AssessmentFramework[] {
  const ageGroup = getAgeGroup(age);
  
  switch (domain) {
    case 'ACADEMIC':
      return ACADEMIC_FRAMEWORKS.filter(framework => 
        framework.ageGroups.includes(ageGroup)
      );
    case 'PSYCHOMETRIC':
      return PSYCHOMETRIC_FRAMEWORKS.filter(framework => 
        framework.ageGroups.includes(ageGroup)
      );
    case 'PHYSICAL':
      return PHYSICAL_FRAMEWORKS.filter(framework => 
        framework.ageGroups.includes(ageGroup)
      );
    default:
      return [];
  }
}

export function getAssessmentTypesForAgeGroup(age: number, domain: AssessmentDomain): AssessmentType[] {
  const ageGroup = getAgeGroup(age);
  const config = AGE_GROUP_CONFIGS[ageGroup];
  
  // Return intersection of age-appropriate methods and domain-specific methods
  const frameworks = getFrameworksForAgeGroup(age, domain);
  const domainTypes = frameworks.flatMap(f => f.assessmentTypes);
  
  return config.assessmentMethods.filter(method => 
    domainTypes.includes(method)
  );
}

export function getSubjectsForAgeGroup(age: number, framework: AssessmentFramework): string[] {
  const ageGroup = getAgeGroup(age);
  const config = AGE_GROUP_CONFIGS[ageGroup];
  
  if (framework.domain === 'ACADEMIC' && framework.subjects) {
    return framework.subjects;
  }
  
  return config.academicSubjects;
}

export function getTraitsForAgeGroup(age: number, framework: AssessmentFramework): string[] {
  const ageGroup = getAgeGroup(age);
  const config = AGE_GROUP_CONFIGS[ageGroup];
  
  if (framework.domain === 'PSYCHOMETRIC' && framework.traits) {
    return framework.traits;
  }
  
  return config.psychometricTraits;
}

export function getMetricsForAgeGroup(age: number, framework: AssessmentFramework): string[] {
  const ageGroup = getAgeGroup(age);
  const config = AGE_GROUP_CONFIGS[ageGroup];
  
  if (framework.domain === 'PHYSICAL' && framework.metrics) {
    return framework.metrics;
  }
  
  return config.physicalMetrics;
}
