const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDemoUsers() {
  console.log('🌱 Seeding demo users...');

  try {
    // Demo Admin User
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@edusight.com' },
      update: {
        name: 'Admin Demo',
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email: 'admin@edusight.com',
        name: 'Admin Demo',
        role: 'ADMIN',
        isActive: true,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'admin@edusight.com',
            access_token: adminPassword
          }
        }
      },
      include: {
        accounts: true
      }
    });

    // Demo Teacher User
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    
    const teacherUser = await prisma.user.upsert({
      where: { email: 'teacher@edusight.com' },
      update: {
        name: 'Teacher Demo',
        role: 'TEACHER',
        isActive: true,
      },
      create: {
        email: 'teacher@edusight.com',
        name: 'Teacher Demo',
        role: 'TEACHER',
        isActive: true,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'teacher@edusight.com',
            access_token: teacherPassword
          }
        }
      },
      include: {
        accounts: true
      }
    });

    // Demo Parent User
    const parentPassword = await bcrypt.hash('parent123', 12);
    
    const parentUser = await prisma.user.upsert({
      where: { email: 'parent@edusight.com' },
      update: {
        name: 'Parent Demo',
        role: 'PARENT',
        isActive: true,
      },
      create: {
        email: 'parent@edusight.com',
        name: 'Parent Demo',
        role: 'PARENT',
        isActive: true,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'parent@edusight.com',
            access_token: parentPassword
          }
        }
      },
      include: {
        accounts: true
      }
    });

    // Demo Student User
    const studentPassword = await bcrypt.hash('student123', 12);
    
    const studentUser = await prisma.user.upsert({
      where: { email: 'student@edusight.com' },
      update: {
        name: 'Student Demo',
        role: 'STUDENT',
        isActive: true,
      },
      create: {
        email: 'student@edusight.com',
        name: 'Student Demo',
        role: 'STUDENT',
        isActive: true,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'student@edusight.com',
            access_token: studentPassword
          }
        }
      },
      include: {
        accounts: true
      }
    });

    console.log('✅ Demo users created successfully!');
    console.log('\n📋 Demo User Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                    DEMO USERS                           │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ 👑 ADMIN    │ admin@edusight.com    │ admin123        │');
    console.log('│ 👩‍🏫 TEACHER  │ teacher@edusight.com  │ teacher123      │');
    console.log('│ 👨‍👩‍👦 PARENT   │ parent@edusight.com   │ parent123       │');
    console.log('│ 🎓 STUDENT  │ student@edusight.com  │ student123      │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    return {
      admin: adminUser,
      teacher: teacherUser,
      parent: parentUser,
      student: studentUser
    };

  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDemoUsers();
  } catch (error) {
    console.error('Failed to seed demo users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedDemoUsers };
