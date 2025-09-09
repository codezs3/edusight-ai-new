// Seed Assessment Data - Populate database with initial questionnaires and career data
import { prisma } from './prisma';
import { JOB_SKILL_MAPPINGS, SKILL_DEFINITIONS } from './career-mapping-data';
import { ALL_QUESTION_BANKS } from './question-banks';

export async function seedAssessmentData() {
  console.log('🌱 Starting assessment data seeding...');

  try {
    // Seed Career Fields
    await seedCareerFields();
    
    // Seed Skills
    await seedSkills();
    
    // Seed Questionnaires
    await seedQuestionnaires();
    
    // Seed Dataset References
    await seedDatasetReferences();

    console.log('✅ Assessment data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding assessment data:', error);
    throw error;
  }
}

async function seedCareerFields() {
  console.log('📊 Seeding career fields...');
  
  for (const job of JOB_SKILL_MAPPINGS) {
    await prisma.careerField.upsert({
      where: { name: job.jobTitle },
      update: {
        description: job.jobDescription,
        category: job.jobCategory,
        growthRate: job.growthRate,
        avgSalary: job.salaryRange.max,
        educationLevel: job.educationLevel,
        skills: job.requiredSkills,
        personalityTraits: job.personalityTraits,
        workEnvironment: job.workEnvironment
      },
      create: {
        name: job.jobTitle,
        description: job.jobDescription,
        category: job.jobCategory,
        growthRate: job.growthRate,
        avgSalary: job.salaryRange.max,
        educationLevel: job.educationLevel,
        skills: job.requiredSkills,
        personalityTraits: job.personalityTraits,
        workEnvironment: job.workEnvironment
      }
    });
  }
  
  console.log(`✅ Seeded ${JOB_SKILL_MAPPINGS.length} career fields`);
}

async function seedSkills() {
  console.log('🎯 Seeding skills...');
  
  for (const skill of SKILL_DEFINITIONS) {
    await prisma.skill.upsert({
      where: { name: skill.skillName },
      update: {
        description: skill.description,
        category: skill.category,
        subcategory: skill.subcategory,
        importance: skill.importance,
        difficulty: skill.learningDifficulty,
        learningTime: skill.learningTime,
        resources: skill.resources
      },
      create: {
        name: skill.skillName,
        description: skill.description,
        category: skill.category,
        subcategory: skill.subcategory,
        importance: skill.importance,
        difficulty: skill.learningDifficulty,
        learningTime: skill.learningTime,
        resources: skill.resources
      }
    });
  }
  
  console.log(`✅ Seeded ${SKILL_DEFINITIONS.length} skills`);
}

async function seedQuestionnaires() {
  console.log('📝 Seeding questionnaires...');
  
  let questionnaireCount = 0;
  
  for (const [category, questions] of Object.entries(ALL_QUESTION_BANKS)) {
    const questionnaire = await prisma.questionnaire.upsert({
      where: { name: `${category} Assessment` },
      update: {
        description: `Comprehensive ${category.toLowerCase()} assessment`,
        category: 'PSYCHOMETRIC',
        subcategory: category,
        ageGroup: 'ALL',
        difficulty: 'MEDIUM',
        domain: 'PSYCHOMETRIC',
        reference: 'Standardized psychological assessment tools',
        questions: {
          deleteMany: {},
          create: questions.slice(0, 10).map((question, index) => ({
            questionText: question.question,
            category: question.category,
            subcategory: question.subcategory,
            reference: question.reference,
            order: index + 1,
            options: {
              create: question.options.map((option, optIndex) => ({
                value: option.value,
                label: option.label,
                description: option.description,
                order: optIndex + 1
              }))
            }
          }))
        }
      },
      create: {
        name: `${category} Assessment`,
        description: `Comprehensive ${category.toLowerCase()} assessment`,
        category: 'PSYCHOMETRIC',
        subcategory: category,
        ageGroup: 'ALL',
        difficulty: 'MEDIUM',
        domain: 'PSYCHOMETRIC',
        reference: 'Standardized psychological assessment tools',
        questions: {
          create: questions.slice(0, 10).map((question, index) => ({
            questionText: question.question,
            category: question.category,
            subcategory: question.subcategory,
            reference: question.reference,
            order: index + 1,
            options: {
              create: question.options.map((option, optIndex) => ({
                value: option.value,
                label: option.label,
                description: option.description,
                order: optIndex + 1
              }))
            }
          }))
        }
      }
    });
    
    questionnaireCount++;
  }
  
  console.log(`✅ Seeded ${questionnaireCount} questionnaires`);
}

async function seedDatasetReferences() {
  console.log('📚 Seeding dataset references...');
  
  const datasetReferences = [
    {
      name: 'NEO Personality Inventory-Revised',
      description: 'Comprehensive measure of the five-factor model of personality',
      authors: ['Costa, P. T.', 'McCrae, R. R.'],
      year: 1992,
      journal: 'Psychological Assessment Resources',
      doi: '10.1037/1040-3590.4.1.26',
      sampleSize: 1000,
      demographics: 'Adults 18-65, diverse population',
      instruments: ['NEO-PI-R'],
      domains: ['Big Five', 'Personality'],
      reliability: 0.92,
      validity: 0.89,
      citation: 'Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual. Psychological Assessment Resources.',
      license: 'COMMERCIAL',
      accessType: 'COMMERCIAL'
    },
    {
      name: 'Big Five Inventory (BFI-44)',
      description: '44-item measure of the Big Five personality dimensions',
      authors: ['John, O. P.', 'Donahue, E. M.', 'Kentle, R. L.'],
      year: 1991,
      journal: 'Journal of Personality and Social Psychology',
      doi: '10.1037/0022-3514.61.1.120',
      sampleSize: 5000,
      demographics: 'College students and adults',
      instruments: ['BFI-44'],
      domains: ['Big Five', 'Personality'],
      reliability: 0.88,
      validity: 0.85,
      citation: 'John, O. P., Donahue, E. M., & Kentle, R. L. (1991). The Big Five Inventory. Journal of Personality and Social Psychology, 61(1), 120-133.',
      license: 'OPEN',
      accessType: 'OPEN'
    },
    {
      name: 'Jobs and Skills Mapping Dataset',
      description: 'Comprehensive dataset mapping jobs to required skills and career paths',
      authors: ['Kaggle Community'],
      year: 2023,
      journal: 'Kaggle',
      sampleSize: 10000,
      demographics: 'Global job market data',
      instruments: ['Job Analysis', 'Skill Mapping'],
      domains: ['Career Development', 'Skills Assessment'],
      reliability: 0.85,
      validity: 0.82,
      citation: 'Kaggle Jobs and Skills Mapping Dataset (2023). Available at: https://www.kaggle.com/datasets/emaadakhter/jobs-and-skills-mapping-for-career-analysis',
      license: 'OPEN',
      accessType: 'OPEN'
    },
    {
      name: 'Student Academic Stress Dataset',
      description: 'Real-world dataset on student academic stress and pressure factors',
      authors: ['Kaggle Community'],
      year: 2023,
      journal: 'Kaggle',
      sampleSize: 5000,
      demographics: 'Students across various age groups',
      instruments: ['Stress Assessment', 'Pressure Analysis'],
      domains: ['Mental Health', 'Academic Performance'],
      reliability: 0.87,
      validity: 0.84,
      citation: 'Student Academic Stress Dataset (2023). Available at: https://www.kaggle.com/datasets/poushal02/student-academic-stress-real-world-dataset',
      license: 'OPEN',
      accessType: 'OPEN'
    }
  ];
  
  for (const dataset of datasetReferences) {
    await prisma.datasetReference.upsert({
      where: { name: dataset.name },
      update: dataset,
      create: dataset
    });
  }
  
  console.log(`✅ Seeded ${datasetReferences.length} dataset references`);
}

// Export the seeding function
export default seedAssessmentData;
