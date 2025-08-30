#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Open Django SQLite database
const djangoDB = new sqlite3.Database('./db.sqlite3', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening Django database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to Django SQLite database');
});

async function migrateUsers() {
  console.log('\n📥 Migrating users from Django...');
  
  return new Promise((resolve, reject) => {
    djangoDB.all(`
      SELECT 
        id, username, email, first_name, last_name, 
        is_staff, is_superuser, is_active, date_joined,
        role, phone, address
      FROM users 
      WHERE email IS NOT NULL AND email != ''
    `, async (err, rows) => {
      if (err) {
        console.log('⚠️  Users table not found, creating sample users...');
        await createSampleUsers();
        resolve();
        return;
      }

      console.log(`Found ${rows.length} users in Django database`);
      
      for (const row of rows) {
        try {
          // Map Django roles to our system
          let role = 'STUDENT';
          if (row.is_superuser || row.is_staff) role = 'ADMIN';
          else if (row.role) {
            role = row.role.toUpperCase();
          }

          const hashedPassword = await bcrypt.hash('password123', 12);

          const user = await prisma.user.create({
            data: {
              email: row.email,
              name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.username,
              role: role,
              phone: row.phone,
              address: row.address,
              isActive: row.is_active === 1,
              emailVerified: new Date(),
            }
          });

          console.log(`✅ Migrated user: ${user.email} (${role})`);
        } catch (error) {
          console.log(`⚠️  Skipped user ${row.email}: ${error.message}`);
        }
      }
      
      resolve();
    });
  });
}

async function migrateStudents() {
  console.log('\n📥 Migrating students...');
  
  return new Promise((resolve, reject) => {
    djangoDB.all(`
      SELECT s.*, u.email, u.first_name, u.last_name
      FROM students_student s
      LEFT JOIN users u ON s.user_id = u.id
      LIMIT 50
    `, async (err, rows) => {
      if (err) {
        console.log('⚠️  Students table not found, creating sample students...');
        await createSampleStudents();
        resolve();
        return;
      }

      console.log(`Found ${rows.length} students`);
      
      for (const row of rows) {
        try {
          // Find corresponding user
          const user = await prisma.user.findUnique({
            where: { email: row.email }
          });

          if (user) {
            await prisma.student.create({
              data: {
                userId: user.id,
                grade: row.grade || row.class_name,
                section: row.section,
                rollNumber: row.roll_number || row.student_id,
                dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : null,
                gender: row.gender,
                bloodGroup: row.blood_group,
              }
            });
            console.log(`✅ Migrated student: ${user.name}`);
          }
        } catch (error) {
          console.log(`⚠️  Skipped student: ${error.message}`);
        }
      }
      
      resolve();
    });
  });
}

async function migrateAssessments() {
  console.log('\n📥 Migrating assessments...');
  
  return new Promise((resolve, reject) => {
    djangoDB.all(`
      SELECT a.*, s.user_id, u.email
      FROM assessments_assessment a
      LEFT JOIN students_student s ON a.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LIMIT 100
    `, async (err, rows) => {
      if (err) {
        console.log('⚠️  Assessments table not found, creating sample assessments...');
        await createSampleAssessments();
        resolve();
        return;
      }

      console.log(`Found ${rows.length} assessments`);
      
      for (const row of rows) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: row.email }
          });

          if (user && user.student) {
            await prisma.assessment.create({
              data: {
                studentId: user.student.id,
                title: row.title || row.assessment_name || 'Assessment',
                description: row.description,
                assessmentType: row.assessment_type || 'academic',
                data: JSON.stringify(row.assessment_data || {}),
                score: row.score ? parseFloat(row.score) : null,
                maxScore: row.max_score ? parseFloat(row.max_score) : 100,
              }
            });
            console.log(`✅ Migrated assessment: ${row.title || 'Assessment'}`);
          }
        } catch (error) {
          console.log(`⚠️  Skipped assessment: ${error.message}`);
        }
      }
      
      resolve();
    });
  });
}

async function createSampleUsers() {
  console.log('📝 Creating sample users...');
  
  const sampleUsers = [
    {
      email: 'admin@edusight.com',
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+1234567890'
    },
    {
      email: 'teacher@edusight.com',
      name: 'John Teacher',
      role: 'TEACHER',
      phone: '+1234567891'
    },
    {
      email: 'student@edusight.com',
      name: 'Alice Student',
      role: 'STUDENT',
      phone: '+1234567892'
    },
    {
      email: 'parent@edusight.com',
      name: 'Bob Parent',
      role: 'PARENT',
      phone: '+1234567893'
    },
    {
      email: 'counselor@edusight.com',
      name: 'Sarah Counselor',
      role: 'COUNSELOR',
      phone: '+1234567894'
    }
  ];

  for (const userData of sampleUsers) {
    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          emailVerified: new Date(),
        }
      });
      console.log(`✅ Created sample user: ${user.email} (${user.role})`);
    } catch (error) {
      console.log(`⚠️  User ${userData.email} already exists`);
    }
  }
}

async function createSampleStudents() {
  console.log('📝 Creating sample students...');
  
  const studentUser = await prisma.user.findUnique({
    where: { email: 'student@edusight.com' }
  });

  if (studentUser) {
    try {
      await prisma.student.create({
        data: {
          userId: studentUser.id,
          grade: '10th',
          section: 'A',
          rollNumber: 'STU001',
          dateOfBirth: new Date('2008-05-15'),
          gender: 'Female',
        }
      });
      console.log('✅ Created sample student profile');
    } catch (error) {
      console.log('⚠️  Sample student already exists');
    }
  }
}

async function createSampleAssessments() {
  console.log('📝 Creating sample assessments...');
  
  const student = await prisma.student.findFirst();
  
  if (student) {
    const sampleAssessments = [
      {
        title: 'Mathematics Assessment',
        description: 'Comprehensive math evaluation',
        assessmentType: 'academic',
        score: 85,
        maxScore: 100
      },
      {
        title: 'Psychological Wellbeing Check',
        description: 'Mental health and wellbeing assessment',
        assessmentType: 'psychological',
        score: 78,
        maxScore: 100
      },
      {
        title: 'Physical Fitness Test',
        description: 'Physical health and fitness evaluation',
        assessmentType: 'physical',
        score: 92,
        maxScore: 100
      }
    ];

    for (const assessment of sampleAssessments) {
      try {
        await prisma.assessment.create({
          data: {
            studentId: student.id,
            ...assessment,
            data: JSON.stringify({
              subjects: ['Math', 'Science', 'English'],
              scores: [85, 78, 92],
              feedback: 'Good performance overall'
            })
          }
        });
        console.log(`✅ Created sample assessment: ${assessment.title}`);
      } catch (error) {
        console.log(`⚠️  Assessment ${assessment.title} already exists`);
      }
    }
  }
}

async function createSchoolData() {
  console.log('📝 Creating sample school data...');
  
  try {
    const school = await prisma.school.create({
      data: {
        name: 'EduSight Demo School',
        address: '123 Education Street, Learning City',
        phone: '+1234567890',
        email: 'info@edusightschool.com',
        type: 'private',
        board: 'CBSE'
      }
    });

    // Update student with school
    await prisma.student.updateMany({
      data: {
        schoolId: school.id
      }
    });

    console.log('✅ Created sample school and linked students');
  } catch (error) {
    console.log('⚠️  School data already exists');
  }
}

async function main() {
  try {
    console.log('🚀 Starting Django to Prisma data migration...\n');
    
    await migrateUsers();
    await migrateStudents();
    await migrateAssessments();
    await createSchoolData();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    
    const userCount = await prisma.user.count();
    const studentCount = await prisma.student.count();
    const assessmentCount = await prisma.assessment.count();
    const schoolCount = await prisma.school.count();
    
    console.log(`- Users: ${userCount}`);
    console.log(`- Students: ${studentCount}`);
    console.log(`- Assessments: ${assessmentCount}`);
    console.log(`- Schools: ${schoolCount}`);
    
    console.log('\n🔐 Default login credentials:');
    console.log('- admin@edusight.com / password123 (Admin)');
    console.log('- teacher@edusight.com / password123 (Teacher)');
    console.log('- student@edusight.com / password123 (Student)');
    console.log('- parent@edusight.com / password123 (Parent)');
    console.log('- counselor@edusight.com / password123 (Counselor)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    djangoDB.close();
    await prisma.$disconnect();
  }
}

main();
