#!/usr/bin/env python3
"""
Create admin users for EduSight application
This script creates proper admin accounts with correct credentials and roles
"""

import os
import sys
import sqlite3
import hashlib
import uuid
from datetime import datetime

def hash_password(password):
    """Create a simple hash for password (for demo purposes)"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_admin_users():
    """Create admin users in the database"""
    
    # Database path
    db_path = os.path.join(os.path.dirname(__file__), 'prisma', 'dev.db')
    
    if not os.path.exists(db_path):
        print("❌ Database not found. Please run 'npx prisma db push' first.")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔧 Creating admin users...")
        
        # Admin users data
        admin_users = [
            {
                'id': str(uuid.uuid4()),
                'email': 'admin@edusight.com',
                'username': 'admin',
                'password': hash_password('admin123'),
                'name': 'System Administrator',
                'role': 'admin',
                'isActive': True,
                'emailVerified': datetime.now().isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'email': 'superadmin@edusight.com', 
                'username': 'superadmin',
                'password': hash_password('superadmin123'),
                'name': 'Super Administrator',
                'role': 'admin',
                'isActive': True,
                'emailVerified': datetime.now().isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'email': 'demo.admin@example.com',
                'username': 'demoadmin',
                'password': hash_password('demo123'),
                'name': 'Demo Admin User',
                'role': 'admin',
                'isActive': True,
                'emailVerified': datetime.now().isoformat()
            }
        ]
        
        # Delete existing admin users first
        cursor.execute("DELETE FROM User WHERE role = 'admin'")
        print("🗑️  Removed existing admin users")
        
        # Insert new admin users
        for user in admin_users:
            cursor.execute("""
                INSERT INTO User (
                    id, email, username, password, name, role, 
                    isActive, emailVerified, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user['id'], user['email'], user['username'], user['password'],
                user['name'], user['role'], user['isActive'], user['emailVerified'],
                datetime.now().isoformat(), datetime.now().isoformat()
            ))
            print(f"✅ Created admin: {user['email']} (username: {user['username']})")
        
        # Also ensure we have proper admin entries in any related tables
        # Update existing non-admin users to ensure we don't have conflicts
        cursor.execute("""
            UPDATE User SET role = 'user' 
            WHERE role != 'admin' AND (role IS NULL OR role = '')
        """)
        
        conn.commit()
        conn.close()
        
        print("\n🎉 Admin users created successfully!")
        print("\n🔐 Login Credentials:")
        print("=" * 50)
        for user in admin_users:
            original_password = {
                'admin@edusight.com': 'admin123',
                'superadmin@edusight.com': 'superadmin123', 
                'demo.admin@example.com': 'demo123'
            }[user['email']]
            print(f"📧 Email: {user['email']}")
            print(f"👤 Username: {user['username']}")
            print(f"🔑 Password: {original_password}")
            print(f"🏷️  Role: {user['role']}")
            print("-" * 30)
        
        print("\n🌐 Access URLs:")
        print("• Login: http://localhost:3000/auth/signin")
        print("• Admin Dashboard: http://localhost:3000/dashboard/admin")
        print("• System Maintenance: http://localhost:3000/dashboard/admin/maintenance")
        
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def verify_admin_users():
    """Verify that admin users were created properly"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'prisma', 'dev.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT email, username, name, role FROM User WHERE role = 'admin'")
        admins = cursor.fetchall()
        
        print(f"\n✅ Found {len(admins)} admin users:")
        for admin in admins:
            print(f"   • {admin[0]} ({admin[1]}) - {admin[2]}")
        
        conn.close()
        return len(admins) > 0
        
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 EduSight Admin User Creator")
    print("=" * 40)
    
    if create_admin_users():
        if verify_admin_users():
            print("\n✅ All admin users created and verified successfully!")
            print("\n📝 Next steps:")
            print("1. Start the development server: npm run dev")
            print("2. Navigate to: http://localhost:3000/auth/signin")
            print("3. Use any of the admin credentials above to log in")
            print("4. Access admin features through the dashboard")
        else:
            print("\n⚠️  Admin users created but verification failed")
    else:
        print("\n❌ Failed to create admin users")
        sys.exit(1)
