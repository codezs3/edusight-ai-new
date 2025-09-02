const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function seedUsers() {
  console.log('🚀 Starting comprehensive user data seeding...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing user data...');
    await prisma.assessment.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.student.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    // Create Schools
    console.log('🏫 Creating schools...');
    const schools = await Promise.all([
      prisma.school.create({
        data: {
          name: 'EduSight Demo School',
          address: '123 Education St, Learning City, LC 12345',
          phone: '+1-555-EDU-DEMO',
          email: 'admin@edusightdemo.edu',
          website: 'https://edusightdemo.edu',
          type: 'public',
          board: 'CBSE'
        }
      }),
      prisma.school.create({
        data: {
          name: 'Innovation Academy',
          address: '456 Tech Blvd, Innovation Park, IP 67890',
          phone: '+1-555-INN-ACAD',
          email: 'contact@innovationacademy.edu',
          website: 'https://innovationacademy.edu',
          type: 'private',
          board: 'ICSE'
        }
      })
    ]);

    // Create Admin Users
    console.log('👨‍💼 Creating admin users...');
    const adminUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@edusight.com',
          name: 'System Administrator',
          role: 'ADMIN',
          phone: '+1-555-ADMIN-01',
          address: 'Admin Office, EduSight HQ',
          isActive: true,
          emailVerified: new Date()
        }
      }),
      prisma.user.create({
        data: {
          email: 'superadmin@edusight.com',
          username: 'superadmin',
          password: await hashPassword('superadmin123'),
          name: 'Super Administrator',
          role: 'admin',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Super+Administrator&background=10B981&color=ffffff',
            bio: 'Super administrator with system maintenance privileges.',
            phone: '+1-555-ADMIN-02'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'demo.admin@example.com',
          username: 'demoadmin',
          password: await hashPassword('demo123'),
          name: 'Demo Admin User',
          role: 'admin',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Demo+Admin&background=8B5CF6&color=ffffff',
            bio: 'Demo administrator account for testing purposes.',
            phone: '+1-555-DEMO-ADM'
          }
        }
      })
    ]);

    // Create Teacher Users
    console.log('👩‍🏫 Creating teacher users...');
    const teacherUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'teacher1@edusight.com',
          username: 'teacher1',
          password: await hashPassword('teacher123'),
          name: 'Emma Wilson',
          role: 'teacher',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=EF4444&color=ffffff',
            bio: 'Mathematics teacher with 8 years of experience.',
            phone: '+1-555-TEACH-01'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'teacher2@edusight.com',
          username: 'teacher2',
          password: await hashPassword('teacher123'),
          name: 'David Rodriguez',
          role: 'teacher',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=F59E0B&color=ffffff',
            bio: 'Science teacher specializing in Physics and Chemistry.',
            phone: '+1-555-TEACH-02'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'teacher3@edusight.com',
          username: 'teacher3',
          password: await hashPassword('teacher123'),
          name: 'Sarah Johnson',
          role: 'teacher',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=06B6D4&color=ffffff',
            bio: 'English Literature teacher and department head.',
            phone: '+1-555-TEACH-03'
          }
        }
      })
    ]);

    // Create Student Users
    console.log('👨‍🎓 Creating student users...');
    const studentUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'student1@example.com',
          username: 'student1',
          password: await hashPassword('student123'),
          name: 'Alex Thompson',
          role: 'student',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=6366F1&color=ffffff',
            bio: 'Grade 10 student interested in computer science.',
            phone: '+1-555-STUD-01'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'student2@example.com',
          username: 'student2',
          password: await hashPassword('student123'),
          name: 'Maya Patel',
          role: 'student',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=EC4899&color=ffffff',
            bio: 'Grade 11 student with passion for mathematics.',
            phone: '+1-555-STUD-02'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'student3@example.com',
          username: 'student3',
          password: await hashPassword('student123'),
          name: 'Jordan Kim',
          role: 'student',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Jordan+Kim&background=14B8A6&color=ffffff',
            bio: 'Grade 9 student interested in arts and literature.',
            phone: '+1-555-STUD-03'
          }
        }
      })
    ]);

    // Create Parent Users
    console.log('👪 Creating parent users...');
    const parentUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'parent1@example.com',
          username: 'parent1',
          password: await hashPassword('parent123'),
          name: 'Robert Thompson',
          role: 'parent',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Robert+Thompson&background=7C3AED&color=ffffff',
            bio: 'Parent of Alex Thompson, works in software engineering.',
            phone: '+1-555-PARENT-01'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'parent2@example.com',
          username: 'parent2',
          password: await hashPassword('parent123'),
          name: 'Priya Patel',
          role: 'parent',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=DC2626&color=ffffff',
            bio: 'Parent of Maya Patel, works as a medical doctor.',
            phone: '+1-555-PARENT-02'
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'parent3@example.com',
          username: 'parent3',
          password: await hashPassword('parent123'),
          name: 'Jennifer Kim',
          role: 'parent',
          isActive: true,
          emailVerified: new Date(),
          profile: {
            avatar: 'https://ui-avatars.com/api/?name=Jennifer+Kim&background=059669&color=ffffff',
            bio: 'Parent of Jordan Kim, works in marketing.',
            phone: '+1-555-PARENT-03'
          }
        }
      })
    ]);

    // Create Teacher Profiles
    console.log('📚 Creating teacher profiles...');
    const teachers = await Promise.all([
      prisma.teacher.create({
        data: {
          userId: teacherUsers[0].id,
          schoolId: schools[0].id,
          employeeId: 'EMP001',
          department: 'Mathematics',
          position: 'Senior Teacher',
          qualifications: 'M.Ed Mathematics, B.Sc Mathematics',
          experience: 8,
          specialization: 'Algebra, Calculus, Statistics',
          subjects: ['Mathematics', 'Statistics', 'Pre-Calculus'],
          classSchedule: {
            monday: ['9:00-10:00 Math-10A', '11:00-12:00 Stats-11B'],
            tuesday: ['10:00-11:00 Math-10B', '2:00-3:00 Calc-12A'],
            wednesday: ['9:00-10:00 Math-10A', '11:00-12:00 Stats-11B'],
            thursday: ['10:00-11:00 Math-10B', '2:00-3:00 Calc-12A'],
            friday: ['9:00-10:00 Math-10A', '10:00-11:00 Math-10B']
          },
          contactHours: '2:00-4:00 PM',
          isActive: true
        }
      }),
      prisma.teacher.create({
        data: {
          userId: teacherUsers[1].id,
          schoolId: schools[0].id,
          employeeId: 'EMP002',
          department: 'Science',
          position: 'Department Head',
          qualifications: 'Ph.D Physics, M.Sc Chemistry',
          experience: 12,
          specialization: 'Physics, Chemistry, Laboratory Research',
          subjects: ['Physics', 'Chemistry', 'Advanced Science'],
          classSchedule: {
            monday: ['8:00-9:00 Phys-11A', '1:00-2:00 Chem-10A'],
            tuesday: ['9:00-10:00 Phys-11B', '2:00-3:00 Lab-12A'],
            wednesday: ['8:00-9:00 Phys-11A', '1:00-2:00 Chem-10A'],
            thursday: ['9:00-10:00 Phys-11B', '2:00-3:00 Lab-12A'],
            friday: ['8:00-9:00 Phys-11A', '9:00-10:00 Phys-11B']
          },
          contactHours: '3:00-5:00 PM',
          isActive: true
        }
      }),
      prisma.teacher.create({
        data: {
          userId: teacherUsers[2].id,
          schoolId: schools[1].id,
          employeeId: 'EMP003',
          department: 'English',
          position: 'Senior Teacher',
          qualifications: 'M.A English Literature, B.Ed',
          experience: 10,
          specialization: 'Literature, Creative Writing, Public Speaking',
          subjects: ['English Literature', 'Creative Writing', 'Speech'],
          classSchedule: {
            monday: ['10:00-11:00 Eng-10A', '2:00-3:00 Lit-11A'],
            tuesday: ['11:00-12:00 Writing-9A', '1:00-2:00 Speech-12A'],
            wednesday: ['10:00-11:00 Eng-10A', '2:00-3:00 Lit-11A'],
            thursday: ['11:00-12:00 Writing-9A', '1:00-2:00 Speech-12A'],
            friday: ['10:00-11:00 Eng-10A', '11:00-12:00 Writing-9A']
          },
          contactHours: '1:00-3:00 PM',
          isActive: true
        }
      })
    ]);

    // Create Student Profiles
    console.log('🎓 Creating student profiles...');
    const students = await Promise.all([
      prisma.student.create({
        data: {
          userId: studentUsers[0].id,
          schoolId: schools[0].id,
          studentId: 'STU001',
          grade: '10',
          section: 'A',
          rollNumber: '10A001',
          dateOfBirth: new Date('2008-05-15'),
          gender: 'male',
          address: '123 Student Lane, Learning City, LC 12345',
          emergencyContact: '+1-555-PARENT-01',
          bloodGroup: 'O+',
          admissionDate: new Date('2022-09-01'),
          academicYear: '2024-25',
          isActive: true,
          subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
          extracurriculars: ['Chess Club', 'Robotics Team'],
          gpa: 3.8,
          attendance: 95.5
        }
      }),
      prisma.student.create({
        data: {
          userId: studentUsers[1].id,
          schoolId: schools[0].id,
          studentId: 'STU002',
          grade: '11',
          section: 'B',
          rollNumber: '11B002',
          dateOfBirth: new Date('2007-08-22'),
          gender: 'female',
          address: '456 Scholar St, Learning City, LC 12345',
          emergencyContact: '+1-555-PARENT-02',
          bloodGroup: 'A+',
          admissionDate: new Date('2021-09-01'),
          academicYear: '2024-25',
          isActive: true,
          subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
          extracurriculars: ['Science Olympiad', 'Debate Team'],
          gpa: 4.0,
          attendance: 98.2
        }
      }),
      prisma.student.create({
        data: {
          userId: studentUsers[2].id,
          schoolId: schools[1].id,
          studentId: 'STU003',
          grade: '9',
          section: 'A',
          rollNumber: '9A003',
          dateOfBirth: new Date('2009-02-10'),
          gender: 'non-binary',
          address: '789 Creative Ave, Innovation Park, IP 67890',
          emergencyContact: '+1-555-PARENT-03',
          bloodGroup: 'B+',
          admissionDate: new Date('2023-09-01'),
          academicYear: '2024-25',
          isActive: true,
          subjects: ['English', 'Mathematics', 'Art', 'Music', 'Social Studies'],
          extracurriculars: ['Art Club', 'School Newspaper'],
          gpa: 3.6,
          attendance: 92.8
        }
      })
    ]);

    // Create Parent Profiles
    console.log('👨‍👩‍👧‍👦 Creating parent profiles...');
    const parents = await Promise.all([
      prisma.parent.create({
        data: {
          userId: parentUsers[0].id,
          occupation: 'Software Engineer',
          employer: 'Tech Solutions Inc.',
          workPhone: '+1-555-WORK-01',
          relationship: 'father',
          emergencyContact: true,
          isGuardian: true,
          students: {
            connect: [{ id: students[0].id }]
          }
        }
      }),
      prisma.parent.create({
        data: {
          userId: parentUsers[1].id,
          occupation: 'Medical Doctor',
          employer: 'City General Hospital',
          workPhone: '+1-555-WORK-02',
          relationship: 'mother',
          emergencyContact: true,
          isGuardian: true,
          students: {
            connect: [{ id: students[1].id }]
          }
        }
      }),
      prisma.parent.create({
        data: {
          userId: parentUsers[2].id,
          occupation: 'Marketing Manager',
          employer: 'Creative Marketing Agency',
          workPhone: '+1-555-WORK-03',
          relationship: 'mother',
          emergencyContact: true,
          isGuardian: true,
          students: {
            connect: [{ id: students[2].id }]
          }
        }
      })
    ]);

    // Create Assessments
    console.log('📝 Creating assessments...');
    const assessments = await Promise.all([
      prisma.assessment.create({
        data: {
          title: 'Mathematics Proficiency Test',
          description: 'Comprehensive mathematics assessment covering algebra, geometry, and basic calculus',
          type: 'academic',
          subject: 'Mathematics',
          gradeLevel: '10-12',
          duration: 120,
          totalMarks: 100,
          instructions: 'Answer all questions. Show your work for partial credit.',
          isActive: true,
          createdBy: teachers[0].userId,
          questions: {
            section1: {
              name: 'Algebra',
              questions: [
                { id: 1, text: 'Solve for x: 2x + 5 = 15', type: 'solve', points: 5 },
                { id: 2, text: 'Factor: x² - 9', type: 'factor', points: 5 }
              ]
            },
            section2: {
              name: 'Geometry',
              questions: [
                { id: 3, text: 'Find the area of a circle with radius 7cm', type: 'calculate', points: 10 },
                { id: 4, text: 'Calculate the volume of a cube with side 4cm', type: 'calculate', points: 10 }
              ]
            }
          }
        }
      }),
      prisma.assessment.create({
        data: {
          title: 'Science Knowledge Assessment',
          description: 'Physics and Chemistry fundamentals test',
          type: 'academic',
          subject: 'Science',
          gradeLevel: '10-12',
          duration: 90,
          totalMarks: 75,
          instructions: 'Choose the best answer for multiple choice questions.',
          isActive: true,
          createdBy: teachers[1].userId,
          questions: {
            physics: {
              name: 'Physics',
              questions: [
                { id: 1, text: 'What is the speed of light?', type: 'mcq', points: 5, options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'] },
                { id: 2, text: 'Calculate force when mass=10kg and acceleration=5m/s²', type: 'calculate', points: 10 }
              ]
            },
            chemistry: {
              name: 'Chemistry',
              questions: [
                { id: 3, text: 'What is the chemical symbol for Gold?', type: 'mcq', points: 5, options: ['Go', 'Gd', 'Au', 'Ag'] },
                { id: 4, text: 'Balance the equation: H₂ + O₂ → H₂O', type: 'balance', points: 10 }
              ]
            }
          }
        }
      }),
      prisma.assessment.create({
        data: {
          title: 'Personality Assessment',
          description: 'Big Five personality traits evaluation',
          type: 'personality',
          subject: 'Psychology',
          gradeLevel: '9-12',
          duration: 45,
          totalMarks: 50,
          instructions: 'Rate each statement based on how accurately it describes you.',
          isActive: true,
          createdBy: adminUsers[0].id,
          questions: {
            traits: {
              name: 'Personality Traits',
              questions: [
                { id: 1, text: 'I am the life of the party', trait: 'extraversion', type: 'likert', points: 2 },
                { id: 2, text: 'I feel comfortable around people', trait: 'extraversion', type: 'likert', points: 2 },
                { id: 3, text: 'I start conversations', trait: 'extraversion', type: 'likert', points: 2 },
                { id: 4, text: 'I have a good imagination', trait: 'openness', type: 'likert', points: 2 },
                { id: 5, text: 'I am always prepared', trait: 'conscientiousness', type: 'likert', points: 2 }
              ]
            }
          }
        }
      })
    ]);

    // Create Assessment Results
    console.log('📊 Creating assessment results...');
    const assessmentResults = [];
    
    for (let i = 0; i < students.length; i++) {
      for (let j = 0; j < assessments.length; j++) {
        const baseScore = 70 + Math.random() * 25; // Random score between 70-95
        const result = await prisma.assessmentResult.create({
          data: {
            studentId: students[i].id,
            assessmentId: assessments[j].id,
            score: Math.round(baseScore),
            maxScore: assessments[j].totalMarks,
            percentage: Math.round((baseScore / assessments[j].totalMarks) * 100),
            grade: baseScore >= 90 ? 'A' : baseScore >= 80 ? 'B' : baseScore >= 70 ? 'C' : 'D',
            timeSpent: Math.floor(assessments[j].duration * (0.7 + Math.random() * 0.3)),
            submittedAt: new Date(),
            isComplete: true,
            answers: {
              [`question_${j + 1}`]: `Sample answer for question ${j + 1}`,
              [`question_${j + 2}`]: `Sample answer for question ${j + 2}`
            },
            feedback: `Good performance! Areas for improvement: ${j % 2 === 0 ? 'calculation speed' : 'attention to detail'}.`
          }
        });
        assessmentResults.push(result);
      }
    }

    // Create Analytics Data
    console.log('📈 Creating analytics data...');
    for (let i = 0; i < students.length; i++) {
      await prisma.analytics.create({
        data: {
          studentId: students[i].id,
          period: 'Q1-2024',
          averageGrade: 85 + Math.random() * 10,
          attendance: 90 + Math.random() * 8,
          behaviorScore: 80 + Math.random() * 15,
          subjectPerformance: {
            Mathematics: 85 + Math.random() * 10,
            Science: 82 + Math.random() * 12,
            English: 88 + Math.random() * 8,
            'Social Studies': 84 + Math.random() * 10
          },
          learningPatterns: {
            preferredLearningStyle: ['visual', 'kinesthetic', 'auditory'][Math.floor(Math.random() * 3)],
            peakPerformanceTime: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)],
            averageStudyTime: 2 + Math.random() * 3
          },
          recommendations: [
            'Focus on problem-solving techniques',
            'Increase practice in weak areas',
            'Participate more in class discussions'
          ],
          strengths: ['Analytical thinking', 'Creative problem solving'],
          areasForImprovement: ['Time management', 'Test anxiety'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    console.log('\n✅ Database seeding completed successfully!');
    
    // Print summary
    const userCount = await prisma.user.count();
    const teacherCount = await prisma.teacher.count();
    const studentCount = await prisma.student.count();
    const parentCount = await prisma.parent.count();
    const schoolCount = await prisma.school.count();
    const assessmentCount = await prisma.assessment.count();
    const resultCount = await prisma.assessmentResult.count();
    const analyticsCount = await prisma.analytics.count();

    console.log('\n📊 Database Summary:');
    console.log('=' * 50);
    console.log(`🏫 Schools: ${schoolCount}`);
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`👩‍🏫 Teachers: ${teacherCount}`);
    console.log(`🎓 Students: ${studentCount}`);
    console.log(`👪 Parents: ${parentCount}`);
    console.log(`📝 Assessments: ${assessmentCount}`);
    console.log(`📊 Assessment Results: ${resultCount}`);
    console.log(`📈 Analytics Records: ${analyticsCount}`);

    console.log('\n🔐 Admin Login Credentials:');
    console.log('=' * 50);
    console.log('📧 Email: admin@edusight.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('🌐 URL: http://localhost:3000/auth/signin');

    console.log('\n🔐 Additional Login Credentials:');
    console.log('=' * 50);
    console.log('ADMIN ACCOUNTS:');
    console.log('• superadmin@edusight.com / superadmin / superadmin123');
    console.log('• demo.admin@example.com / demoadmin / demo123');
    console.log('\nTEACHER ACCOUNTS:');
    console.log('• teacher1@edusight.com / teacher1 / teacher123');
    console.log('• teacher2@edusight.com / teacher2 / teacher123');
    console.log('• teacher3@edusight.com / teacher3 / teacher123');
    console.log('\nSTUDENT ACCOUNTS:');
    console.log('• student1@example.com / student1 / student123');
    console.log('• student2@example.com / student2 / student123');
    console.log('• student3@example.com / student3 / student123');
    console.log('\nPARENT ACCOUNTS:');
    console.log('• parent1@example.com / parent1 / parent123');
    console.log('• parent2@example.com / parent2 / parent123');
    console.log('• parent3@example.com / parent3 / parent123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
