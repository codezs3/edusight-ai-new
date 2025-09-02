# Admin Login Troubleshooting Guide

## 🔐 Admin User Credentials

After running the database seeding, you can log in with these credentials:

### **Primary Admin Account**
- **Email**: `admin@edusight.com`
- **Name**: System Administrator
- **Role**: ADMIN

### **Alternative Admin Accounts**
- **Email**: `superadmin@edusight.com`
- **Name**: Super Administrator
- **Role**: ADMIN

- **Email**: `demo.admin@example.com`
- **Name**: Demo Admin User
- **Role**: ADMIN

### **Other Test Accounts**
**Teachers:**
- `teacher1@edusight.com` - Emma Wilson
- `teacher2@edusight.com` - David Rodriguez

**Students:**
- `student1@example.com` - Alex Thompson
- `student2@example.com` - Maya Patel
- `student3@example.com` - Jordan Kim

**Parents:**
- `parent1@example.com` - Robert Thompson
- `parent2@example.com` - Priya Patel

## 🚨 Common Admin Login Issues & Solutions

### 1. **"TypeError: r is not a function" Error**
**Solution Applied**: 
- ✅ Updated NextAuth v5 compatibility in `/api/auth/[...nextauth]/route.ts`
- ✅ Fixed auth handler export format

### 2. **"JWT Session Error" / "Decryption Failed"**
**Solution Applied**:
- ✅ Updated to NextAuth v5 beta with compatible auth core
- ✅ Fixed authentication configuration

### 3. **Database Connection Issues**
**Solution Applied**:
- ✅ Updated database imports in maintenance modules
- ✅ Verified Prisma client configuration

## 🔧 Quick Fixes to Try

### **Method 1: Clear Browser Data**
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear all cookies and local storage
4. Refresh the page

### **Method 2: Use Demo Accounts**
If admin login fails, try these demo accounts:

**Teacher Account:**
- Username: `teacher1@example.com`
- Password: `teacher123`

**Student Account:**
- Username: `student1@example.com`  
- Password: `student123`

### **Method 3: Database Check**
Run this command to verify admin users exist:
```bash
npx prisma studio
```
Then check the `User` table for admin accounts.

## 🚀 Access Steps

### **Step 1: Navigate to Login**
1. Go to `http://localhost:3000`
2. Click "Sign In" or go to `http://localhost:3000/auth/signin`

### **Step 2: Use Credentials**
1. Select "Sign in with Credentials"
2. Enter admin email and password
3. Click "Sign In"

### **Step 3: Access Admin Dashboard**
After successful login:
1. You'll be redirected to the dashboard
2. Admin users will see the "Admin Dashboard" link
3. Navigate to `/dashboard/admin` for full admin features

## 🛠️ Maintenance Module Access

Once logged in as admin:
1. Go to **Dashboard → Admin → System Maintenance**
2. URL: `http://localhost:3000/dashboard/admin/maintenance`
3. Configure Google Drive backup if needed

## 🔍 Debugging Steps

### **Check Console Errors**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for authentication errors
4. Report specific error messages

### **Verify Environment**
Ensure your `.env.local` file contains:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="edusight-dev-secret-key-2024"
```

### **Reset Authentication**
If login continues to fail:
1. Stop the dev server
2. Delete `.next` folder
3. Run `npm run dev` again
4. Try logging in again

## 📞 Still Having Issues?

### **Re-create Sample Data**
```bash
python create_simple_sample_data.py
```

### **Check Database Schema**
```bash
npx prisma db push
npx prisma generate
```

### **Restart Development Server**
```bash
# Stop server
Ctrl+C

# Start again
npm run dev
```

## ✅ Expected Behavior

After successful admin login, you should see:
- ✅ Admin Dashboard with comprehensive metrics
- ✅ "System Maintenance" option in the sidebar  
- ✅ User management capabilities
- ✅ System configuration options
- ✅ Backup and maintenance tools

---

**Need More Help?**
Check the browser console for specific error messages and include them when asking for support.
