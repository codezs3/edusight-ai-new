#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsers() {
  console.log('🚀 Creating comprehensive demo users for EduSight...\n');

  // Demo users with different roles
  const demoUsers = [
    // Admin Users
    {
      email: 'admin@edusight.com',
      name: 'System Administrator',
      role: 'ADMIN',
      phone: '+1-555-0101',
      address: '123 Admin Street, Tech City, TC 12345'
    },
    {
      email: 'superadmin@edusight.com',
      name: 'Super Admin',
      role: 'ADMIN',
      phone: '+1-555-0102',
      address: '456 Executive Ave, Management City, MC 67890'
    },

    // Teachers
    {
      email: 'teacher1@edusight.com',
      name: 'Sarah Johnson',
      role: 'TEACHER',
      phone: '+1-555-0201',
      address: '789 Education Blvd, Learning Town, LT 11111'
    },
    {
      email: 'teacher2@edusight.com',
      name: 'Michael Chen',
      role: 'TEACHER',
      phone: '+1-555-0202',
      address: '321 Academic Way, Study City, SC 22222'
    },
    {
      email: 'teacher3@edusight.com',
      name: 'Emily Rodriguez',
      role: 'TEACHER',
      phone: '+1-555-0203',
      address: '654 Knowledge St, Wisdom Valley, WV 33333'
    },

    // Students
    {
      email: 'student1@edusight.com',
      name: 'Alex Thompson',
      role: 'STUDENT',
      phone: '+1-555-0301',
      address: '111 Student Lane, Campus City, CC 44444'
    },
    {
      email: 'student2@edusight.com',
      name: 'Emma Wilson',
      role: 'STUDENT',
      phone: '+1-555-0302',
      address: '222 Learner Ave, Study Town, ST 55555'
    },
    {
      email: 'student3@edusight.com',
      name: 'James Davis',
      role: 'STUDENT',
      phone: '+1-555-0303',
      address: '333 Scholar Road, Education City, EC 66666'
    },
    {
      email: 'student4@edusight.com',
      name: 'Sophia Martinez',
      role: 'STUDENT',
      phone: '+1-555-0304',
      address: '444 Pupil Place, Learning District, LD 77777'
    },

    // Parents
    {
      email: 'parent1@edusight.com',
      name: 'Robert Thompson',
      role: 'PARENT',
      phone: '+1-555-0401',
      address: '111 Student Lane, Campus City, CC 44444' // Same as Alex Thompson
    },
    {
      email: 'parent2@edusight.com',
      name: 'Lisa Wilson',
      role: 'PARENT',
      phone: '+1-555-0402',
      address: '222 Learner Ave, Study Town, ST 55555' // Same as Emma Wilson
    },
    {
      email: 'parent3@edusight.com',
      name: 'David Martinez',
      role: 'PARENT',
      phone: '+1-555-0403',
      address: '444 Pupil Place, Learning District, LD 77777' // Same as Sophia Martinez
    },

    // Counselors
    {
      email: 'counselor1@edusight.com',
      name: 'Dr. Amanda Foster',
      role: 'COUNSELOR',
      phone: '+1-555-0501',
      address: '555 Guidance Ave, Support City, SC 88888'
    },
    {
      email: 'counselor2@edusight.com',
      name: 'Dr. Mark Stevens',
      role: 'COUNSELOR',
      phone: '+1-555-0502',
      address: '666 Wellness Blvd, Care Town, CT 99999'
    },

    // CRM/Sales Users (using ADMIN role with specific naming)
    {
      email: 'crm@edusight.com',
      name: 'CRM Manager',
      role: 'ADMIN',
      phone: '+1-555-0601',
      address: '777 Sales Street, Business District, BD 10101'
    },
    {
      email: 'sales1@edusight.com',
      name: 'Jennifer Sales',
      role: 'ADMIN',
      phone: '+1-555-0602',
      address: '888 Revenue Road, Commerce City, CC 20202'
    },

    // Accounts/Finance Users (using ADMIN role with specific naming)
    {
      email: 'accounts@edusight.com',
      name: 'Finance Manager',
      role: 'ADMIN',
      phone: '+1-555-0701',
      address: '999 Finance Ave, Money District, MD 30303'
    },
    {
      email: 'accountant1@edusight.com',
      name: 'Patricia Accountant',
      role: 'ADMIN',
      phone: '+1-555-0702',
      address: '1010 Budget Blvd, Fiscal City, FC 40404'
    },

    // School Administration
    {
      email: 'principal@edusight.com',
      name: 'Dr. Principal Smith',
      role: 'ADMIN',
      phone: '+1-555-0801',
      address: '1111 School Drive, Education District, ED 50505'
    },
    {
      email: 'vp@edusight.com',
      name: 'Vice Principal Jones',
      role: 'ADMIN',
      phone: '+1-555-0802',
      address: '1212 Academy Way, Learning Center, LC 60606'
    },

    // Customer Service Representatives
    {
      email: 'customer1@edusight.com',
      name: 'Customer Service Rep',
      role: 'ADMIN',
      phone: '+1-555-0901',
      address: '1313 Service Street, Support Center, SC 70707'
    },
    {
      email: 'support@edusight.com',
      name: 'Technical Support',
      role: 'ADMIN',
      phone: '+1-555-0902',
      address: '1414 Help Desk Ave, Assistance City, AC 80808'
    }
  ];

  // Create users
  for (const userData of demoUsers) {
    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          emailVerified: new Date(),
        }
      });
      console.log(`✅ Created user: ${user.email} (${user.role}) - ${user.name}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️  User ${userData.email} already exists - skipping`);
      } else {
        console.log(`❌ Error creating user ${userData.email}: ${error.message}`);
      }
    }
  }

  // Create schools
  console.log('\n📚 Creating demo schools...');
  const schools = [
    {
      name: 'EduSight Demo Elementary',
      address: '100 Elementary Ave, Primary City, PC 11111',
      phone: '+1-555-1001',
      email: 'elementary@edusightdemo.edu',
      type: 'public',
      board: 'CBSE'
    },
    {
      name: 'EduSight Demo High School',
      address: '200 High School Blvd, Secondary City, SC 22222',
      phone: '+1-555-1002',
      email: 'highschool@edusightdemo.edu',
      type: 'private',
      board: 'ICSE'
    },
    {
      name: 'EduSight International Academy',
      address: '300 International Way, Global City, GC 33333',
      phone: '+1-555-1003',
      email: 'international@edusightdemo.edu',
      type: 'international',
      board: 'IB'
    }
  ];

  for (const schoolData of schools) {
    try {
      const school = await prisma.school.create({
        data: schoolData
      });
      console.log(`✅ Created school: ${school.name}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️  School ${schoolData.name} already exists - skipping`);
      } else {
        console.log(`❌ Error creating school ${schoolData.name}: ${error.message}`);
      }
    }
  }

  // Create student profiles for student users
  console.log('\n👨‍🎓 Creating student profiles...');
  const studentUsers = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  });

  const school = await prisma.school.findFirst();

  for (let i = 0; i < studentUsers.length; i++) {
    const user = studentUsers[i];
    try {
      await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: school?.id,
          grade: `Grade ${8 + i}`,
          section: String.fromCharCode(65 + i), // A, B, C, D
          rollNumber: `STU${String(i + 1).padStart(3, '0')}`,
          dateOfBirth: new Date(2008 - i, 5, 15), // Different birth years
          gender: i % 2 === 0 ? 'Male' : 'Female',
          bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4]
        }
      });
      console.log(`✅ Created student profile for: ${user.name}`);
    } catch (error) {
      console.log(`⚠️  Student profile for ${user.name} already exists - skipping`);
    }
  }

  // Create teacher profiles
  console.log('\n👨‍🏫 Creating teacher profiles...');
  const teacherUsers = await prisma.user.findMany({
    where: { role: 'TEACHER' }
  });

  const subjects = ['Mathematics, Physics', 'English, Literature', 'Science, Chemistry'];

  for (let i = 0; i < teacherUsers.length; i++) {
    const user = teacherUsers[i];
    try {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          schoolId: school?.id,
          employeeId: `TCH${String(i + 1).padStart(3, '0')}`,
          department: ['Science', 'Arts', 'Commerce'][i % 3],
          subjects: subjects[i % subjects.length]
        }
      });
      console.log(`✅ Created teacher profile for: ${user.name}`);
    } catch (error) {
      console.log(`⚠️  Teacher profile for ${user.name} already exists - skipping`);
    }
  }

  // Create parent profiles and link to students
  console.log('\n👨‍👩‍👧‍👦 Creating parent profiles...');
  const parentUsers = await prisma.user.findMany({
    where: { role: 'PARENT' }
  });

  const students = await prisma.student.findMany({
    include: { user: true }
  });

  for (let i = 0; i < parentUsers.length && i < students.length; i++) {
    const parentUser = parentUsers[i];
    const student = students[i];
    
    try {
      const parent = await prisma.parent.create({
        data: {
          userId: parentUser.id,
          occupation: ['Engineer', 'Doctor', 'Teacher', 'Business Owner'][i % 4],
          income: ['50000-75000', '75000-100000', '100000+'][i % 3],
          education: ['Bachelor', 'Master', 'PhD'][i % 3]
        }
      });

      // Link parent to student
      await prisma.student.update({
        where: { id: student.id },
        data: { parentId: parent.id }
      });

      console.log(`✅ Created parent profile for: ${parentUser.name} -> linked to ${student.user.name}`);
    } catch (error) {
      console.log(`⚠️  Parent profile for ${parentUser.name} already exists - skipping`);
    }
  }

  // Create sample assessments
  console.log('\n📋 Creating sample assessments...');
  const assessmentTypes = ['academic', 'psychological', 'physical'];
  const assessmentTitles = [
    'Mathematics Assessment',
    'Psychological Wellbeing Check',
    'Physical Fitness Test',
    'Science Evaluation',
    'Career Interest Survey'
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    for (let j = 0; j < 3; j++) {
      try {
        await prisma.assessment.create({
          data: {
            studentId: student.id,
            title: assessmentTitles[j],
            description: `Comprehensive ${assessmentTypes[j]} evaluation for ${student.user.name}`,
            assessmentType: assessmentTypes[j],
            data: JSON.stringify({
              subjects: ['Math', 'Science', 'English'],
              scores: [85 + Math.floor(Math.random() * 15), 78 + Math.floor(Math.random() * 20), 92 + Math.floor(Math.random() * 8)],
              feedback: `Good performance with room for improvement in specific areas.`,
              recommendations: ['Focus on problem-solving', 'Increase reading comprehension', 'Maintain current level']
            }),
            score: 75 + Math.floor(Math.random() * 25),
            maxScore: 100
          }
        });
      } catch (error) {
        // Skip if already exists
      }
    }
  }
  console.log(`✅ Created sample assessments for all students`);

  console.log('\n✅ Demo user creation completed successfully!');
  console.log('\n🔐 Login Credentials (Password: password123 for all users):');
  console.log('\n📊 ADMIN USERS:');
  console.log('- admin@edusight.com (System Administrator)');
  console.log('- superadmin@edusight.com (Super Admin)');
  console.log('- principal@edusight.com (School Principal)');
  console.log('- vp@edusight.com (Vice Principal)');
  
  console.log('\n💼 CRM/SALES USERS:');
  console.log('- crm@edusight.com (CRM Manager)');
  console.log('- sales1@edusight.com (Sales Representative)');
  
  console.log('\n💰 ACCOUNTS/FINANCE USERS:');
  console.log('- accounts@edusight.com (Finance Manager)');
  console.log('- accountant1@edusight.com (Accountant)');
  
  console.log('\n🎓 SCHOOL USERS:');
  console.log('- teacher1@edusight.com (Sarah Johnson - Teacher)');
  console.log('- teacher2@edusight.com (Michael Chen - Teacher)');
  console.log('- teacher3@edusight.com (Emily Rodriguez - Teacher)');
  
  console.log('\n👨‍🎓 STUDENT USERS:');
  console.log('- student1@edusight.com (Alex Thompson)');
  console.log('- student2@edusight.com (Emma Wilson)');
  console.log('- student3@edusight.com (James Davis)');
  console.log('- student4@edusight.com (Sophia Martinez)');
  
  console.log('\n👨‍👩‍👧‍👦 PARENT USERS:');
  console.log('- parent1@edusight.com (Robert Thompson)');
  console.log('- parent2@edusight.com (Lisa Wilson)');
  console.log('- parent3@edusight.com (David Martinez)');
  
  console.log('\n🧠 COUNSELOR USERS:');
  console.log('- counselor1@edusight.com (Dr. Amanda Foster)');
  console.log('- counselor2@edusight.com (Dr. Mark Stevens)');
  
  console.log('\n🎧 CUSTOMER SERVICE:');
  console.log('- customer1@edusight.com (Customer Service Rep)');
  console.log('- support@edusight.com (Technical Support)');

  console.log('\n📊 Summary:');
  const userCount = await prisma.user.count();
  const studentCount = await prisma.student.count();
  const teacherCount = await prisma.teacher.count();
  const parentCount = await prisma.parent.count();
  const schoolCount = await prisma.school.count();
  const assessmentCount = await prisma.assessment.count();
  
  console.log(`- Total Users: ${userCount}`);
  console.log(`- Students: ${studentCount}`);
  console.log(`- Teachers: ${teacherCount}`);
  console.log(`- Parents: ${parentCount}`);
  console.log(`- Schools: ${schoolCount}`);
  console.log(`- Assessments: ${assessmentCount}`);
}

async function main() {
  try {
    await createDemoUsers();
  } catch (error) {
    console.error('❌ Demo user creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
