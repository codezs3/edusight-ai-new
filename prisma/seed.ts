import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  // Create account for admin
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'credentials',
        providerAccountId: admin.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: admin.id,
      password: adminPassword,
    },
  });

  // Create a school
  const school = await prisma.school.upsert({
    where: { name: 'Demo Elementary School' },
    update: {},
    create: {
      name: 'Demo Elementary School',
      address: '123 Education St, Learning City, LC 12345',
      phone: '+1-555-0123',
      email: 'info@demo-elementary.edu',
      principalName: 'Dr. Jane Smith',
      establishedYear: 2010,
      totalStudents: 500,
      description: 'A progressive elementary school focused on innovative learning.',
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
      schoolId: school.id,
      emailVerified: new Date(),
    },
  });

  // Create account for school admin
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'credentials',
        providerAccountId: schoolAdmin.id,
      },
    },
    update: {},
    create: {
      userId: schoolAdmin.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: schoolAdmin.id,
      password: schoolAdminPassword,
    },
  });

  // Link school admin to school
  await prisma.school.update({
    where: { id: school.id },
    data: {
      admins: {
        connect: { id: schoolAdmin.id }
      }
    }
  });

  // Create parent user
  const parentPassword = await bcrypt.hash('parent123', 12);
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@edusight.com' },
    update: {},
    create: {
      email: 'parent@edusight.com',
      name: 'Parent User',
      role: 'PARENT',
      schoolId: school.id,
      phone: '+1-555-0124',
      emailVerified: new Date(),
    },
  });

  // Create account for parent
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'credentials',
        providerAccountId: parentUser.id,
      },
    },
    update: {},
    create: {
      userId: parentUser.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: parentUser.id,
      password: parentPassword,
    },
  });

  // Create parent profile
  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      schoolId: school.id,
      occupation: 'Software Engineer',
      emergencyContact: '+1-555-0125',
    },
  });

  // Create student users and profiles
  const student1User = await prisma.user.create({
    data: {
      email: 'student1@demo.edu',
      name: 'Alice Johnson',
      role: 'STUDENT',
      schoolId: school.id,
      emailVerified: new Date(),
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      schoolId: school.id,
      parentId: parent.id,
      grade: 'Grade 3',
      dateOfBirth: new Date('2015-05-15'),
      enrollmentDate: new Date('2021-09-01'),
      studentId: 'STU001',
    },
  });

  const student2User = await prisma.user.create({
    data: {
      email: 'student2@demo.edu',
      name: 'Bob Johnson',
      role: 'STUDENT',
      schoolId: school.id,
      emailVerified: new Date(),
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      schoolId: school.id,
      parentId: parent.id,
      grade: 'Grade 1',
      dateOfBirth: new Date('2017-08-22'),
      enrollmentDate: new Date('2023-09-01'),
      studentId: 'STU002',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📚 Sample accounts created:');
  console.log('🔑 Admin: admin@edusight.com / admin123');
  console.log('🏫 School Admin: schooladmin@edusight.com / schooladmin123');
  console.log('👨‍👩‍👧‍👦 Parent: parent@edusight.com / parent123');
  console.log(`📊 School: ${school.name} (ID: ${school.id})`);
  console.log(`👶 Students: ${student1.studentId} (Alice), ${student2.studentId} (Bob)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
