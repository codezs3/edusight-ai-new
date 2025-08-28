# Edusight Analytics Platform - Django Version

## 🚀 Overview

Edusight is an AI-powered K-12 education analytics platform built with Django. It provides comprehensive assessment tracking, analytics, and machine learning insights for educational institutions.

## 🏗️ Architecture

- **Backend**: Django 5.2.5
- **Database**: SQLite (easily upgradable to MySQL/PostgreSQL)
- **Frontend**: Bootstrap 5, Chart.js, Font Awesome
- **APIs**: Django REST Framework
- **Authentication**: Django's built-in auth system

## 📁 Project Structure

```
edusight/
├── edusight_django/          # Django project settings
├── dashboard/               # Dashboard app
├── students/               # Students management app
├── assessments/            # Assessments app
├── data_analytics/         # Analytics app
├── ml_predictions/         # ML predictions app
├── templates/              # Django templates
├── static/                 # Static files
├── media/                  # Media files
├── manage.py              # Django management script
├── db.sqlite3             # SQLite database
├── index.html             # Landing page
├── proxy.php              # PHP proxy script
├── redirect.php           # Redirect script
└── .htaccess              # Apache configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- pip
- XAMPP (for Apache server)

### 1. Install Dependencies

```bash
pip install Django==5.2.5
pip install djangorestframework
pip install django-cors-headers
pip install python-decouple
pip install Pillow
```

### 2. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser

```bash
python manage.py createsuperuser
# Username: admin
# Password: admin123
```

### 4. Start Django Server

```bash
python manage.py runserver 0.0.0.0:8000
```

## 🌐 Access Points

### Direct Django Access
- **Dashboard**: http://localhost:8000/
- **Admin Panel**: http://localhost:8000/admin/
- **API Endpoints**: http://localhost:8000/api/

### Through Apache (localhost.com/edusight)
- **Main Site**: http://localhost.com/edusight/
- **Dashboard**: http://localhost.com/edusight/dashboard/
- **Admin**: http://localhost.com/edusight/admin/

## 🔐 Login Credentials

- **Username**: admin
- **Password**: admin123

## 📊 Features

### 1. Dashboard
- Real-time statistics
- Interactive charts
- Recent activities feed
- Responsive design

### 2. Student Management
- Student profiles
- Academic records
- Attendance tracking
- Performance analytics

### 3. Assessment System
- Academic assessments
- Psychological assessments
- Physical assessments
- DMIT assessments

### 4. Analytics & Reporting
- Performance trends
- Comparative analysis
- Custom reports
- Data visualization

### 5. ML Integration
- Performance predictions
- Career recommendations
- Risk assessment
- Learning style analysis

## 🔧 Configuration

### Django Settings
The main configuration is in `edusight_django/settings.py`:

- **Database**: SQLite (default)
- **Static Files**: Configured for development
- **CORS**: Enabled for API access
- **Authentication**: Django's built-in system

### Apache Configuration
The `.htaccess` file handles URL rewriting and proxy settings.

## 📱 API Endpoints

### Dashboard API
- `GET /api/dashboard/` - Dashboard statistics
- `GET /api/students/` - Student list
- `GET /api/assessments/stats/` - Assessment statistics
- `GET /api/ml/predictions/` - ML predictions

### Authentication
- `POST /accounts/login/` - User login
- `POST /accounts/logout/` - User logout

## 🚀 Deployment

### Development
1. Start Django server: `python manage.py runserver 0.0.0.0:8000`
2. Access via: http://localhost:8000/

### Production
1. Configure production database (MySQL/PostgreSQL)
2. Set `DEBUG = False` in settings
3. Configure static files collection
4. Set up proper web server (Nginx/Apache)

## 🔍 Troubleshooting

### Common Issues

1. **Pillow Error**: Install Pillow for ImageField support
   ```bash
   pip install Pillow
   ```

2. **Database Migration Errors**: Reset migrations
   ```bash
   python manage.py makemigrations --empty app_name
   python manage.py migrate
   ```

3. **Static Files Not Loading**: Collect static files
   ```bash
   python manage.py collectstatic
   ```

4. **Port Already in Use**: Change port
   ```bash
   python manage.py runserver 8001
   ```

## 📈 Performance Optimization

1. **Database Optimization**
   - Use database indexes
   - Optimize queries
   - Enable query caching

2. **Static Files**
   - Use CDN for external libraries
   - Compress CSS/JS files
   - Enable browser caching

3. **Caching**
   - Enable Django caching
   - Use Redis for session storage
   - Cache expensive queries

## 🔒 Security

1. **Authentication**
   - Use strong passwords
   - Enable two-factor authentication
   - Regular password updates

2. **Data Protection**
   - Encrypt sensitive data
   - Regular backups
   - Access logging

3. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all inputs

## 📞 Support

For technical support or questions:
- Check the Django documentation
- Review the code comments
- Test with sample data

## 🎯 Next Steps

1. **Add Sample Data**: Create demo students and assessments
2. **Customize UI**: Modify templates and styling
3. **Add Features**: Implement additional modules
4. **Performance**: Optimize for production use
5. **Security**: Implement additional security measures

---

**Edusight Analytics Platform** - Transforming Education with AI
