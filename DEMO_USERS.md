# 🎭 Demo Users for Development

This document contains the credentials for demo users that are automatically available in the development environment.

## 🚀 Quick Start

### Automatic Setup
Demo users are automatically created when you run:
```bash
npm run seed:demo
```

### Available Demo Users

| Role | Email | Password | Dashboard Access |
|------|-------|----------|------------------|
| 👑 **Admin** | `admin@edusight.com` | `admin123` | `/dashboard/admin` |
| 👩‍🏫 **Teacher** | `teacher@edusight.com` | `teacher123` | `/dashboard/teacher` |
| 👨‍👩‍👦 **Parent** | `parent@edusight.com` | `parent123` | `/dashboard/parent` |
| 🎓 **Student** | `student@edusight.com` | `student123` | `/dashboard/student` |

## 📱 How to Use

### Option 1: Auto-Fill from Sign-In Page
1. Go to `/auth/signin`
2. Click on the "Demo Users" panel (desktop) or demo users button (mobile)
3. Click any user to auto-fill their credentials
4. Click "Sign in"

### Option 2: Manual Entry
1. Go to `/auth/signin`
2. Enter the email and password manually
3. Click "Sign in"

## 🔧 Development Features

### Re-create Demo Users
If you need to reset or recreate demo users:
```bash
npm run seed:demo
```

### Sign-In Page Features
- **Desktop**: Demo users panel on the right side
- **Mobile**: Floating demo users button with overlay
- **Auto-fill**: Click any demo user to automatically fill credentials
- **Role-based Redirects**: Users are automatically redirected to their appropriate dashboard

## 🛡️ Security Notes

- These are **development-only** credentials
- Passwords are properly hashed using bcrypt
- Each user has appropriate role-based access
- Do **NOT** use these credentials in production

## 🎯 Testing Different Roles

Each demo user provides access to different features:

### Admin (`admin@edusight.com`)
- Full system access
- User management
- Assessment frameworks
- Academic management
- Maintenance tools
- Google Drive backup
- Financial reports

### Teacher (`teacher@edusight.com`)
- Student assessment tools
- Grade management
- Class overview
- Report generation

### Parent (`parent@edusight.com`)
- Child progress tracking
- Assessment results
- Communication tools
- Report access

### Student (`student@edusight.com`)
- Personal dashboard
- Assessment history
- Progress tracking
- Goal setting

## 🔄 Automated Setup

The demo users are created with the `upsert` operation, which means:
- If the user doesn't exist, it will be created
- If the user already exists, it will be updated
- No duplicate users will be created
- Safe to run multiple times

## 📊 Database Structure

Demo users are stored in:
- `User` table: Basic user information and roles
- `Account` table: Authentication credentials (password stored in `access_token` field)

---

**Happy Development! 🚀**
