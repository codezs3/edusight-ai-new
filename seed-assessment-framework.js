const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAssessmentFramework() {
  console.log('🚀 Seeding assessment framework data...');

  try {
    // Clear existing assessment framework data
    console.log('🗑️ Clearing existing assessment framework data...');
    await prisma.assessmentTemplate.deleteMany();
    await prisma.subjectAssessmentType.deleteMany();
    await prisma.frameworkSubject.deleteMany();
    await prisma.assessmentType.deleteMany();
    await prisma.assessmentCycle.deleteMany();
    await prisma.assessmentFramework.deleteMany();

    // Get admin user for createdBy
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      throw new Error('No admin user found. Please run the user seeding script first.');
    }

    // Create Assessment Frameworks
    console.log('📚 Creating assessment frameworks...');
    const frameworks = await Promise.all([
      prisma.assessmentFramework.create({
        data: {
          name: 'International General Certificate of Secondary Education',
          code: 'IGCSE',
          description: 'Cambridge IGCSE is an internationally recognised qualification for school students, typically aged 14-16.',
          isCustom: false,
          createdBy: adminUser.id
        }
      }),
      prisma.assessmentFramework.create({
        data: {
          name: 'International Baccalaureate',
          code: 'IB',
          description: 'The IB offers four educational programmes to more than one million students aged 3 to 19 across the world.',
          isCustom: false,
          createdBy: adminUser.id
        }
      }),
      prisma.assessmentFramework.create({
        data: {
          name: 'Indian Certificate of Secondary Education',
          code: 'ICSE',
          description: 'ICSE is an examination conducted by the Council for the Indian School Certificate Examinations.',
          isCustom: false,
          createdBy: adminUser.id
        }
      }),
      prisma.assessmentFramework.create({
        data: {
          name: 'Central Board of Secondary Education',
          code: 'CBSE',
          description: 'CBSE is a national level board of education in India for public and private schools.',
          isCustom: false,
          createdBy: adminUser.id
        }
      }),
      prisma.assessmentFramework.create({
        data: {
          name: 'Science Technology Engineering Arts Mathematics',
          code: 'STREAM',
          description: 'STREAM education integrates Science, Technology, Reading, Engineering, Arts and Mathematics.',
          isCustom: false,
          createdBy: adminUser.id
        }
      })
    ]);

    // Create Assessment Types
    console.log('📝 Creating assessment types...');
    const assessmentTypes = await Promise.all([
      prisma.assessmentType.create({
        data: {
          name: 'Marks-based Assessment',
          code: 'marks',
          description: 'Traditional numerical scoring system with percentage or grade points',
          config: JSON.stringify({
            scoreType: 'numerical',
            maxScore: 100,
            minScore: 0,
            passingScore: 40,
            gradeScale: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
          })
        }
      }),
      prisma.assessmentType.create({
        data: {
          name: 'Rubrics-based Assessment',
          code: 'rubrics',
          description: 'Criterion-based evaluation using detailed rubrics and performance indicators',
          config: JSON.stringify({
            scoreType: 'rubric',
            criteria: ['Understanding', 'Application', 'Analysis', 'Communication'],
            levels: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'],
            descriptors: true
          })
        }
      }),
      prisma.assessmentType.create({
        data: {
          name: 'Portfolio Assessment',
          code: 'portfolio',
          description: 'Collection of student work demonstrating progress and achievement over time',
          config: JSON.stringify({
            scoreType: 'portfolio',
            components: ['Projects', 'Assignments', 'Reflections', 'Presentations'],
            weightage: true,
            selfAssessment: true
          })
        }
      }),
      prisma.assessmentType.create({
        data: {
          name: 'Competency-based Assessment',
          code: 'competency',
          description: 'Skills and competency-based evaluation focusing on mastery',
          config: JSON.stringify({
            scoreType: 'competency',
            levels: ['Not Yet', 'Developing', 'Proficient', 'Advanced'],
            skills: true,
            mastery: true
          })
        }
      }),
      prisma.assessmentType.create({
        data: {
          name: 'Other Assessment Types',
          code: 'other',
          description: 'Flexible assessment type for custom evaluation methods',
          config: JSON.stringify({
            scoreType: 'flexible',
            customizable: true,
            multipleFormats: true
          })
        }
      })
    ]);

    // Create Assessment Cycles
    console.log('🔄 Creating assessment cycles...');
    const cycles = await Promise.all([
      prisma.assessmentCycle.create({
        data: {
          name: 'Monthly Assessment',
          code: 'monthly',
          description: 'Regular monthly assessments for continuous evaluation',
          duration: 1
        }
      }),
      prisma.assessmentCycle.create({
        data: {
          name: 'Quarterly Assessment',
          code: 'quarterly',
          description: 'Quarterly assessments aligned with academic terms',
          duration: 3
        }
      }),
      prisma.assessmentCycle.create({
        data: {
          name: 'Six Monthly Assessment',
          code: 'six_monthly',
          description: 'Bi-annual comprehensive assessments',
          duration: 6
        }
      }),
      prisma.assessmentCycle.create({
        data: {
          name: 'Yearly Assessment',
          code: 'yearly',
          description: 'Annual comprehensive evaluations',
          duration: 12
        }
      })
    ]);

    // Create Framework Subjects
    console.log('📖 Creating framework subjects...');
    
    // IGCSE Subjects
    const igcseSubjects = [
      'Mathematics', 'English Language', 'English Literature', 'Physics', 'Chemistry', 
      'Biology', 'Computer Science', 'History', 'Geography', 'Economics', 'Business Studies',
      'Art and Design', 'Music', 'Physical Education', 'French', 'Spanish'
    ];

    // IB Subjects
    const ibSubjects = [
      'Mathematics: Analysis and Approaches', 'Mathematics: Applications and Interpretation',
      'English A: Language and Literature', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'History', 'Geography', 'Economics', 'Business Management',
      'Visual Arts', 'Music', 'French B', 'Spanish B', 'Theory of Knowledge'
    ];

    // ICSE Subjects
    const icseSubjects = [
      'Mathematics', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology',
      'Computer Applications', 'History and Civics', 'Geography', 'Commercial Studies',
      'Art', 'Physical Education', 'Sanskrit', 'French', 'Environmental Science'
    ];

    // CBSE Subjects
    const cbseSubjects = [
      'Mathematics', 'English Core', 'Hindi Core', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'History', 'Geography', 'Political Science', 'Economics',
      'Business Studies', 'Accountancy', 'Fine Arts', 'Physical Education', 'Sanskrit'
    ];

    // STREAM Subjects
    const streamSubjects = [
      'Applied Mathematics', 'Data Science', 'Robotics and AI', 'Digital Arts',
      'Environmental Science', 'Biotechnology', 'Engineering Design', 'Creative Writing',
      'Media Studies', 'Entrepreneurship', 'Research Methods', 'Innovation Lab'
    ];

    // Create subjects for each framework
    for (let i = 0; i < frameworks.length; i++) {
      const framework = frameworks[i];
      let subjects = [];
      
      switch (framework.code) {
        case 'IGCSE':
          subjects = igcseSubjects;
          break;
        case 'IB':
          subjects = ibSubjects;
          break;
        case 'ICSE':
          subjects = icseSubjects;
          break;
        case 'CBSE':
          subjects = cbseSubjects;
          break;
        case 'STREAM':
          subjects = streamSubjects;
          break;
      }

      for (const subjectName of subjects) {
        await prisma.frameworkSubject.create({
          data: {
            frameworkId: framework.id,
            name: subjectName,
            code: subjectName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()
          }
        });
      }
    }

    // Create some default assessment templates
    console.log('📋 Creating default assessment templates...');
    await prisma.assessmentTemplate.create({
      data: {
        name: 'Standard Academic Assessment',
        description: 'Default template for academic subjects with marks-based assessment',
        frameworkId: frameworks.find(f => f.code === 'CBSE').id,
        cycleId: cycles.find(c => c.code === 'quarterly').id,
        config: JSON.stringify({
          subjects: ['Mathematics', 'English Core', 'Physics', 'Chemistry'],
          assessmentTypes: ['marks'],
          weightage: {
            'Unit Tests': 30,
            'Mid Term': 30,
            'Final Exam': 40
          }
        }),
        isDefault: true,
        createdBy: adminUser.id
      }
    });

    await prisma.assessmentTemplate.create({
      data: {
        name: 'IB Comprehensive Assessment',
        description: 'IB framework template with rubrics-based evaluation',
        frameworkId: frameworks.find(f => f.code === 'IB').id,
        cycleId: cycles.find(c => c.code === 'six_monthly').id,
        config: JSON.stringify({
          subjects: ['Mathematics: Analysis and Approaches', 'English A: Language and Literature', 'Physics'],
          assessmentTypes: ['rubrics', 'portfolio'],
          components: {
            'Internal Assessment': 25,
            'Extended Essay': 10,
            'Theory of Knowledge': 10,
            'External Examinations': 55
          }
        }),
        isDefault: true,
        createdBy: adminUser.id
      }
    });

    console.log('\n✅ Assessment framework seeding completed successfully!');
    
    // Print summary
    const frameworkCount = await prisma.assessmentFramework.count();
    const subjectCount = await prisma.frameworkSubject.count();
    const typeCount = await prisma.assessmentType.count();
    const cycleCount = await prisma.assessmentCycle.count();
    const templateCount = await prisma.assessmentTemplate.count();

    console.log('\n📊 Assessment Framework Summary:');
    console.log('=' * 50);
    console.log(`📚 Frameworks: ${frameworkCount}`);
    console.log(`📖 Subjects: ${subjectCount}`);
    console.log(`📝 Assessment Types: ${typeCount}`);
    console.log(`🔄 Assessment Cycles: ${cycleCount}`);
    console.log(`📋 Templates: ${templateCount}`);

    console.log('\n🎯 Available Frameworks:');
    console.log('• IGCSE - International General Certificate of Secondary Education');
    console.log('• IB - International Baccalaureate');
    console.log('• ICSE - Indian Certificate of Secondary Education');
    console.log('• CBSE - Central Board of Secondary Education');
    console.log('• STREAM - Science Technology Engineering Arts Mathematics');

    console.log('\n📝 Assessment Types:');
    console.log('• Marks-based Assessment');
    console.log('• Rubrics-based Assessment');
    console.log('• Portfolio Assessment');
    console.log('• Competency-based Assessment');
    console.log('• Other Assessment Types');

    console.log('\n🔄 Assessment Cycles:');
    console.log('• Monthly Assessment');
    console.log('• Quarterly Assessment');
    console.log('• Six Monthly Assessment');
    console.log('• Yearly Assessment');

  } catch (error) {
    console.error('❌ Assessment framework seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAssessmentFramework()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
