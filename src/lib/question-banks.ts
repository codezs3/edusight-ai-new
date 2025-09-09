// Comprehensive Question Banks for Randomized Psychometric Testing

export interface Question {
  id: string;
  question: string;
  category: string;
  subcategory?: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
  reference: string;
  ageGroup: 'EARLY_CHILDHOOD' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY' | 'ALL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  domain: 'ACADEMIC' | 'PSYCHOMETRIC' | 'PHYSICAL';
}

// Big Five Personality Questions
export const BIG_FIVE_QUESTIONS: Question[] = [
  {
    id: 'bf_extra_1',
    question: 'I am someone who is talkative',
    category: 'Extraversion',
    subcategory: 'Social Engagement',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_extra_2',
    question: 'I feel comfortable in large groups of people',
    category: 'Extraversion',
    subcategory: 'Social Comfort',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_cons_1',
    question: 'I am someone who is thorough in my work',
    category: 'Conscientiousness',
    subcategory: 'Work Ethic',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_cons_2',
    question: 'I always plan ahead and organize my tasks',
    category: 'Conscientiousness',
    subcategory: 'Organization',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_neuro_1',
    question: 'I am someone who is emotionally stable',
    category: 'Neuroticism',
    subcategory: 'Emotional Stability',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_open_1',
    question: 'I have a vivid imagination',
    category: 'Openness',
    subcategory: 'Creativity',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'bf_agree_1',
    question: 'I trust others easily',
    category: 'Agreeableness',
    subcategory: 'Trust',
    options: [
      { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
      { value: 2, label: 'Disagree', description: 'Rarely like me' },
      { value: 3, label: 'Neutral', description: 'Sometimes like me' },
      { value: 4, label: 'Agree', description: 'Often like me' },
      { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
    ],
    reference: 'Costa & McCrae (1992) NEO-PI-R',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  }
];

// Learning Style Questions
export const LEARNING_STYLE_QUESTIONS: Question[] = [
  {
    id: 'ls_visual_1',
    question: 'I learn best when I can see diagrams, charts, and visual aids',
    category: 'Visual Learning',
    subcategory: 'Visual Processing',
    options: [
      { value: 1, label: 'Never', description: 'This never helps me' },
      { value: 2, label: 'Rarely', description: 'This rarely helps me' },
      { value: 3, label: 'Sometimes', description: 'This sometimes helps me' },
      { value: 4, label: 'Often', description: 'This often helps me' },
      { value: 5, label: 'Always', description: 'This always helps me' }
    ],
    reference: 'Fleming & Mills (1992) VARK Learning Styles',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'ls_auditory_1',
    question: 'I prefer to learn by listening to lectures and discussions',
    category: 'Auditory Learning',
    subcategory: 'Auditory Processing',
    options: [
      { value: 1, label: 'Never', description: 'This never helps me' },
      { value: 2, label: 'Rarely', description: 'This rarely helps me' },
      { value: 3, label: 'Sometimes', description: 'This sometimes helps me' },
      { value: 4, label: 'Often', description: 'This often helps me' },
      { value: 5, label: 'Always', description: 'This always helps me' }
    ],
    reference: 'Fleming & Mills (1992) VARK Learning Styles',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'ls_kinesthetic_1',
    question: 'I learn best by doing hands-on activities and experiments',
    category: 'Kinesthetic Learning',
    subcategory: 'Physical Engagement',
    options: [
      { value: 1, label: 'Never', description: 'This never helps me' },
      { value: 2, label: 'Rarely', description: 'This rarely helps me' },
      { value: 3, label: 'Sometimes', description: 'This sometimes helps me' },
      { value: 4, label: 'Often', description: 'This often helps me' },
      { value: 5, label: 'Always', description: 'This always helps me' }
    ],
    reference: 'Fleming & Mills (1992) VARK Learning Styles',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  }
];

// Attention and Focus Questions
export const ATTENTION_QUESTIONS: Question[] = [
  {
    id: 'att_focus_1',
    question: 'I can concentrate on a single task for long periods without getting distracted',
    category: 'Attention Span',
    subcategory: 'Sustained Attention',
    options: [
      { value: 1, label: 'Never', description: 'I get distracted very easily' },
      { value: 2, label: 'Rarely', description: 'I often get distracted' },
      { value: 3, label: 'Sometimes', description: 'I can focus sometimes' },
      { value: 4, label: 'Often', description: 'I can usually focus well' },
      { value: 5, label: 'Always', description: 'I can focus for very long periods' }
    ],
    reference: 'Barkley (1997) ADHD Assessment',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'att_multitask_1',
    question: 'I can effectively work on multiple tasks at the same time',
    category: 'Attention Span',
    subcategory: 'Multitasking',
    options: [
      { value: 1, label: 'Never', description: 'I can only do one thing at a time' },
      { value: 2, label: 'Rarely', description: 'I prefer to focus on one task' },
      { value: 3, label: 'Sometimes', description: 'I can handle some multitasking' },
      { value: 4, label: 'Often', description: 'I can juggle multiple tasks well' },
      { value: 5, label: 'Always', description: 'I excel at multitasking' }
    ],
    reference: 'Barkley (1997) ADHD Assessment',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  }
];

// Social Skills Questions
export const SOCIAL_SKILLS_QUESTIONS: Question[] = [
  {
    id: 'ss_empathy_1',
    question: 'I can easily understand how others are feeling',
    category: 'Social Skills',
    subcategory: 'Empathy',
    options: [
      { value: 1, label: 'Never', description: 'I find this very difficult' },
      { value: 2, label: 'Rarely', description: 'I rarely understand others' },
      { value: 3, label: 'Sometimes', description: 'I understand sometimes' },
      { value: 4, label: 'Often', description: 'I usually understand others' },
      { value: 5, label: 'Always', description: 'I always understand others' }
    ],
    reference: 'Goleman (1995) Emotional Intelligence',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'ss_leadership_1',
    question: 'I naturally take on leadership roles in group activities',
    category: 'Social Skills',
    subcategory: 'Leadership',
    options: [
      { value: 1, label: 'Never', description: 'I prefer to follow others' },
      { value: 2, label: 'Rarely', description: 'I rarely lead' },
      { value: 3, label: 'Sometimes', description: 'I lead sometimes' },
      { value: 4, label: 'Often', description: 'I often take leadership' },
      { value: 5, label: 'Always', description: 'I always lead groups' }
    ],
    reference: 'Goleman (1995) Emotional Intelligence',
    ageGroup: 'ALL',
    difficulty: 'MEDIUM',
    domain: 'PSYCHOMETRIC'
  }
];

// Physical Health Questions
export const PHYSICAL_HEALTH_QUESTIONS: Question[] = [
  {
    id: 'ph_fitness_1',
    question: 'I engage in physical exercise or sports regularly',
    category: 'Physical Fitness',
    subcategory: 'Exercise Habits',
    options: [
      { value: 1, label: 'Never', description: 'I never exercise' },
      { value: 2, label: 'Rarely', description: 'I rarely exercise' },
      { value: 3, label: 'Sometimes', description: 'I exercise sometimes' },
      { value: 4, label: 'Often', description: 'I exercise regularly' },
      { value: 5, label: 'Always', description: 'I exercise very regularly' }
    ],
    reference: 'WHO (2020) Physical Activity Guidelines',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PHYSICAL'
  },
  {
    id: 'ph_health_1',
    question: 'I maintain a healthy diet and eating habits',
    category: 'Physical Health',
    subcategory: 'Nutrition',
    options: [
      { value: 1, label: 'Never', description: 'I have poor eating habits' },
      { value: 2, label: 'Rarely', description: 'I rarely eat healthy' },
      { value: 3, label: 'Sometimes', description: 'I eat healthy sometimes' },
      { value: 4, label: 'Often', description: 'I usually eat healthy' },
      { value: 5, label: 'Always', description: 'I always eat very healthy' }
    ],
    reference: 'WHO (2020) Nutrition Guidelines',
    ageGroup: 'ALL',
    difficulty: 'EASY',
    domain: 'PHYSICAL'
  }
];

// Parent Questionnaire Questions (for younger children)
export const PARENT_QUESTIONNAIRE_QUESTIONS: Question[] = [
  {
    id: 'pq_behavior_1',
    question: 'How would you describe your child\'s typical behavior at home?',
    category: 'Behavioral Assessment',
    subcategory: 'Home Behavior',
    options: [
      { value: 1, label: 'Very challenging', description: 'Often difficult to manage' },
      { value: 2, label: 'Somewhat challenging', description: 'Sometimes difficult' },
      { value: 3, label: 'Average', description: 'Typical for their age' },
      { value: 4, label: 'Generally good', description: 'Usually well-behaved' },
      { value: 5, label: 'Excellent', description: 'Always well-behaved' }
    ],
    reference: 'Achenbach (1991) Child Behavior Checklist',
    ageGroup: 'EARLY_CHILDHOOD',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  },
  {
    id: 'pq_social_1',
    question: 'How does your child interact with other children?',
    category: 'Social Development',
    subcategory: 'Peer Interaction',
    options: [
      { value: 1, label: 'Very shy', description: 'Avoids other children' },
      { value: 2, label: 'Somewhat shy', description: 'Takes time to warm up' },
      { value: 3, label: 'Average', description: 'Normal social interaction' },
      { value: 4, label: 'Social', description: 'Enjoys being with others' },
      { value: 5, label: 'Very social', description: 'Very outgoing with others' }
    ],
    reference: 'Achenbach (1991) Child Behavior Checklist',
    ageGroup: 'EARLY_CHILDHOOD',
    difficulty: 'EASY',
    domain: 'PSYCHOMETRIC'
  }
];

// All question banks combined
export const ALL_QUESTION_BANKS = {
  BIG_FIVE: BIG_FIVE_QUESTIONS,
  LEARNING_STYLE: LEARNING_STYLE_QUESTIONS,
  ATTENTION: ATTENTION_QUESTIONS,
  SOCIAL_SKILLS: SOCIAL_SKILLS_QUESTIONS,
  PHYSICAL_HEALTH: PHYSICAL_HEALTH_QUESTIONS,
  PARENT_QUESTIONNAIRE: PARENT_QUESTIONNAIRE_QUESTIONS
};

// Utility functions for question randomization
export function getRandomQuestions(
  questionBank: Question[],
  count: number,
  ageGroup?: string,
  difficulty?: string
): Question[] {
  let filteredQuestions = questionBank;
  
  // Filter by age group if specified
  if (ageGroup) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.ageGroup === ageGroup || q.ageGroup === 'ALL'
    );
  }
  
  // Filter by difficulty if specified
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and select random questions
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionsForTest(
  testType: string,
  ageGroup: string,
  questionCount: number = 10
): Question[] {
  const questionBanks = {
    'BIG_FIVE': BIG_FIVE_QUESTIONS,
    'LEARNING_STYLE': LEARNING_STYLE_QUESTIONS,
    'ATTENTION_SPAN': ATTENTION_QUESTIONS,
    'SOCIAL_SKILLS': SOCIAL_SKILLS_QUESTIONS,
    'PHYSICAL_ASSESSMENT': PHYSICAL_HEALTH_QUESTIONS,
    'PARENT_QUESTIONNAIRE': PARENT_QUESTIONNAIRE_QUESTIONS
  };
  
  const bank = questionBanks[testType as keyof typeof questionBanks];
  if (!bank) return [];
  
  return getRandomQuestions(bank, questionCount, ageGroup);
}

export function getMixedQuestions(
  ageGroup: string,
  questionCount: number = 15
): Question[] {
  const allQuestions = Object.values(ALL_QUESTION_BANKS).flat();
  return getRandomQuestions(allQuestions, questionCount, ageGroup);
}
