const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edusight.com' },
    update: {},
    create: {
      email: 'admin@edusight.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create school admin user
  const schoolAdminPassword = await bcrypt.hash('schooladmin123', 12);
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'schooladmin@edusight.com' },
    update: {},
    create: {
      email: 'schooladmin@edusight.com',
      name: 'School Admin',
      role: 'SCHOOL_ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create parent user
  const parentPassword = await bcrypt.hash('parent123', 12);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@edusight.com' },
    update: {},
    create: {
      email: 'parent@edusight.com',
      name: 'Parent User',
      role: 'PARENT',
      emailVerified: new Date(),
    },
  });

  // Create parent record
  const parentRecord = await prisma.parent.upsert({
    where: { userId: parent.id },
    update: {},
    create: {
      userId: parent.id,
      occupation: 'Software Engineer',
      education: 'Bachelor\'s Degree',
      relationship: 'mother',
      emergencyContact: true,
    },
  });

  // Create student users
  const student1User = await prisma.user.upsert({
    where: { email: 'student1@edusight.com' },
    update: {},
    create: {
      email: 'student1@edusight.com',
      name: 'Alice Student',
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  });

  const student2User = await prisma.user.upsert({
    where: { email: 'student2@edusight.com' },
    update: {},
    create: {
      email: 'student2@edusight.com',
      name: 'Bob Student',
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  });

  // Create students
  const student1 = await prisma.student.upsert({
    where: { userId: student1User.id },
    update: {},
    create: {
      userId: student1User.id,
      grade: '10',
      section: 'A',
      rollNumber: 'STU001',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'Female',
      parentId: parentRecord.id,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { userId: student2User.id },
    update: {},
    create: {
      userId: student2User.id,
      grade: '8',
      section: 'B',
      rollNumber: 'STU002',
      dateOfBirth: new Date('2010-03-22'),
      gender: 'Male',
      parentId: parentRecord.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📚 Sample accounts created:');
  console.log('🔑 Admin: admin@edusight.com / admin123');
  console.log('🏫 School Admin: schooladmin@edusight.com / schooladmin123');
  console.log('👨‍👩‍👧‍👦 Parent: parent@edusight.com / parent123');
  console.log('👶 Student 1: student1@edusight.com (Alice, Grade 10)');
  console.log('👶 Student 2: student2@edusight.com (Bob, Grade 8)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
