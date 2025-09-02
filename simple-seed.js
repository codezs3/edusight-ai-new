const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🚀 Starting user data seeding...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.assessment.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.student.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    // Create Schools
    console.log('🏫 Creating schools...');
    const school1 = await prisma.school.create({
      data: {
        name: 'EduSight Demo School',
        address: '123 Education St, Learning City, LC 12345',
        phone: '+1-555-EDU-DEMO',
        email: 'admin@edusightdemo.edu',
        website: 'https://edusightdemo.edu',
        type: 'public',
        board: 'CBSE'
      }
    });

    const school2 = await prisma.school.create({
      data: {
        name: 'Innovation Academy',
        address: '456 Tech Blvd, Innovation Park, IP 67890',
        phone: '+1-555-INN-ACAD',
        email: 'contact@innovationacademy.edu',
        website: 'https://innovationacademy.edu',
        type: 'private',
        board: 'ICSE'
      }
    });

    // Create Admin Users
    console.log('👨‍💼 Creating admin users...');
    const admin1 = await prisma.user.create({
      data: {
        email: 'admin@edusight.com',
        name: 'System Administrator',
        role: 'ADMIN',
        phone: '+1-555-ADMIN-01',
        address: 'Admin Office, EduSight HQ',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const admin2 = await prisma.user.create({
      data: {
        email: 'superadmin@edusight.com',
        name: 'Super Administrator',
        role: 'ADMIN',
        phone: '+1-555-ADMIN-02',
        address: 'Super Admin Office, EduSight HQ',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const admin3 = await prisma.user.create({
      data: {
        email: 'demo.admin@example.com',
        name: 'Demo Admin User',
        role: 'ADMIN',
        phone: '+1-555-DEMO-ADM',
        address: 'Demo Office, EduSight HQ',
        isActive: true,
        emailVerified: new Date()
      }
    });

    // Create Teacher Users
    console.log('👩‍🏫 Creating teacher users...');
    const teacher1User = await prisma.user.create({
      data: {
        email: 'teacher1@edusight.com',
        name: 'Emma Wilson',
        role: 'TEACHER',
        phone: '+1-555-TEACH-01',
        address: '123 Teacher Lane, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const teacher2User = await prisma.user.create({
      data: {
        email: 'teacher2@edusight.com',
        name: 'David Rodriguez',
        role: 'TEACHER',
        phone: '+1-555-TEACH-02',
        address: '456 Educator St, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    // Create Teacher Profiles
    console.log('📚 Creating teacher profiles...');
    const teacher1 = await prisma.teacher.create({
      data: {
        userId: teacher1User.id,
        schoolId: school1.id,
        employeeId: 'EMP001',
        department: 'Mathematics',
        subjects: 'Mathematics, Statistics, Pre-Calculus',
        isActive: true
      }
    });

    const teacher2 = await prisma.teacher.create({
      data: {
        userId: teacher2User.id,
        schoolId: school1.id,
        employeeId: 'EMP002',
        department: 'Science',
        subjects: 'Physics, Chemistry, Biology',
        isActive: true
      }
    });

    // Create Parent Users
    console.log('👪 Creating parent users...');
    const parent1User = await prisma.user.create({
      data: {
        email: 'parent1@example.com',
        name: 'Robert Thompson',
        role: 'PARENT',
        phone: '+1-555-PARENT-01',
        address: '789 Family Ave, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const parent2User = await prisma.user.create({
      data: {
        email: 'parent2@example.com',
        name: 'Priya Patel',
        role: 'PARENT',
        phone: '+1-555-PARENT-02',
        address: '321 Guardian St, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    // Create Parent Profiles
    console.log('👨‍👩‍👧‍👦 Creating parent profiles...');
    const parent1 = await prisma.parent.create({
      data: {
        userId: parent1User.id,
        occupation: 'Software Engineer',
        income: '75000-100000',
        education: 'Masters',
        isActive: true
      }
    });

    const parent2 = await prisma.parent.create({
      data: {
        userId: parent2User.id,
        occupation: 'Medical Doctor',
        income: '100000+',
        education: 'Doctorate',
        isActive: true
      }
    });

    // Create Student Users
    console.log('👨‍🎓 Creating student users...');
    const student1User = await prisma.user.create({
      data: {
        email: 'student1@example.com',
        name: 'Alex Thompson',
        role: 'STUDENT',
        phone: '+1-555-STUD-01',
        address: '789 Family Ave, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const student2User = await prisma.user.create({
      data: {
        email: 'student2@example.com',
        name: 'Maya Patel',
        role: 'STUDENT',
        phone: '+1-555-STUD-02',
        address: '321 Guardian St, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    const student3User = await prisma.user.create({
      data: {
        email: 'student3@example.com',
        name: 'Jordan Kim',
        role: 'STUDENT',
        phone: '+1-555-STUD-03',
        address: '654 Student Blvd, Learning City',
        isActive: true,
        emailVerified: new Date()
      }
    });

    // Create Student Profiles
    console.log('🎓 Creating student profiles...');
    const student1 = await prisma.student.create({
      data: {
        userId: student1User.id,
        schoolId: school1.id,
        parentId: parent1.id,
        grade: '10',
        section: 'A',
        rollNumber: '10A001',
        dateOfBirth: new Date('2008-05-15'),
        gender: 'male',
        bloodGroup: 'O+',
        isActive: true
      }
    });

    const student2 = await prisma.student.create({
      data: {
        userId: student2User.id,
        schoolId: school1.id,
        parentId: parent2.id,
        grade: '11',
        section: 'B',
        rollNumber: '11B002',
        dateOfBirth: new Date('2007-08-22'),
        gender: 'female',
        bloodGroup: 'A+',
        isActive: true
      }
    });

    const student3 = await prisma.student.create({
      data: {
        userId: student3User.id,
        schoolId: school2.id,
        grade: '9',
        section: 'A',
        rollNumber: '9A003',
        dateOfBirth: new Date('2009-02-10'),
        gender: 'other',
        bloodGroup: 'B+',
        isActive: true
      }
    });

    // Create Assessments
    console.log('📝 Creating assessments...');
    await prisma.assessment.create({
      data: {
        studentId: student1.id,
        title: 'Mathematics Test 1',
        description: 'Algebra and geometry assessment',
        assessmentType: 'academic',
        data: JSON.stringify({
          subject: 'Mathematics',
          gradedBy: teacher1.userId,
          testDate: '2024-01-15',
          remarks: 'Good performance in algebra section'
        }),
        score: 85,
        maxScore: 100
      }
    });

    await prisma.assessment.create({
      data: {
        studentId: student2.id,
        title: 'Science Quiz 1',
        description: 'Physics and chemistry fundamentals',
        assessmentType: 'academic',
        data: JSON.stringify({
          subject: 'Science',
          gradedBy: teacher2.userId,
          testDate: '2024-01-20',
          remarks: 'Excellent understanding of physics concepts'
        }),
        score: 92,
        maxScore: 100
      }
    });

    await prisma.assessment.create({
      data: {
        studentId: student3.id,
        title: 'English Essay',
        description: 'Creative writing and literature analysis',
        assessmentType: 'academic',
        data: JSON.stringify({
          subject: 'English',
          gradedBy: teacher1.userId,
          testDate: '2024-01-25',
          remarks: 'Creative writing skills need improvement'
        }),
        score: 78,
        maxScore: 100
      }
    });

    console.log('\n✅ Database seeding completed successfully!');
    
    // Print summary
    const userCount = await prisma.user.count();
    const teacherCount = await prisma.teacher.count();
    const studentCount = await prisma.student.count();
    const parentCount = await prisma.parent.count();
    const schoolCount = await prisma.school.count();
    const assessmentCount = await prisma.assessment.count();

    console.log('\n📊 Database Summary:');
    console.log('=' * 50);
    console.log(`🏫 Schools: ${schoolCount}`);
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`👩‍🏫 Teachers: ${teacherCount}`);
    console.log(`🎓 Students: ${studentCount}`);
    console.log(`👪 Parents: ${parentCount}`);
    console.log(`📝 Assessments: ${assessmentCount}`);

    console.log('\n🔐 Admin Login Credentials (Use any for testing):');
    console.log('=' * 50);
    console.log('📧 Email: admin@edusight.com');
    console.log('👤 Name: System Administrator');
    console.log('🔑 Role: ADMIN');
    console.log('');
    console.log('📧 Email: superadmin@edusight.com');
    console.log('👤 Name: Super Administrator');
    console.log('🔑 Role: ADMIN');
    console.log('');
    console.log('📧 Email: demo.admin@example.com');
    console.log('👤 Name: Demo Admin User');
    console.log('🔑 Role: ADMIN');

    console.log('\n🔐 Other User Accounts:');
    console.log('=' * 50);
    console.log('TEACHER ACCOUNTS:');
    console.log('• teacher1@edusight.com - Emma Wilson');
    console.log('• teacher2@edusight.com - David Rodriguez');
    console.log('\nSTUDENT ACCOUNTS:');
    console.log('• student1@example.com - Alex Thompson');
    console.log('• student2@example.com - Maya Patel');
    console.log('• student3@example.com - Jordan Kim');
    console.log('\nPARENT ACCOUNTS:');
    console.log('• parent1@example.com - Robert Thompson');
    console.log('• parent2@example.com - Priya Patel');

    console.log('\n🌐 Next Steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/auth/signin');
    console.log('3. Use any admin email above to log in');
    console.log('4. Access admin dashboard at: /dashboard/admin');

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
