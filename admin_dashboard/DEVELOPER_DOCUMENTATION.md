# 🚀 EduSight Platform - Developer Documentation
**CONFIDENTIAL - ADMIN ACCESS ONLY**

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Advanced Analytics Documentation](#advanced-analytics-documentation)
4. [Pages & Components](#pages--components)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [CRM System](#crm-system)
8. [Setup & Installation](#setup--installation)
9. [Development Guidelines](#development-guidelines)
10. [Deployment Instructions](#deployment-instructions)

---

## 🎯 Platform Overview

**EduSight** is a comprehensive B2C educational analytics platform that combines:
- **DMIT (Dermatoglyphics Multiple Intelligence Test)** analysis
- **Advanced predictive analytics** with 10 algorithmic models
- **CRM system** for lead management
- **Multi-framework support** (CBSE, ICSE, IGCSE, IB)
- **Modern responsive website** with appointment booking

### Key Features
- 🤖 **10 Advanced Algorithmic Models** (Random Forest, XGBoost, Neural Networks, etc.)
- 🧬 **DMIT Testing** with home collection service (₹2,999)
- 📊 **Real-time Analytics Dashboard**
- 🎯 **CRM & Lead Management**
- 📱 **Responsive Modern UI** with mega menu
- 🔒 **Secure Authentication System**

---

## 🏗️ Architecture & Technology Stack

### Backend Framework
- **Django 5.2.5** - Main web framework
- **Django REST Framework** - API development
- **SQLite3** - Database (can be upgraded to PostgreSQL)
- **Python 3.11+** - Programming language

### Advanced Analytics & Processing
- **scikit-learn 1.7.1** - Algorithmic modeling
- **TensorFlow 2.20.0** - Deep learning & neural networks
- **XGBoost 3.0.4** - Gradient boosting
- **LightGBM 4.6.0** - Fast gradient boosting
- **NumPy & Pandas** - Data processing
- **Matplotlib & Seaborn** - Data visualization

### Frontend
- **Bootstrap 5.3.0** - CSS framework
- **Chart.js** - Interactive charts
- **Font Awesome 6.4.0** - Icons
- **AOS (Animate On Scroll)** - Animations
- **Vanilla JavaScript** - Frontend interactivity

### Apps Structure
```
edusight_django/
├── dashboard/          # Admin dashboard & analytics
├── students/           # Student management
├── assessments/        # Assessment system
├── data_analytics/     # Data analysis tools
├── ml_predictions/     # Advanced algorithmic predictions
├── crm/               # Customer relationship management
└── templates/
    ├── dashboard/     # Admin templates
    └── website/       # B2C website templates
```

---

## 🤖 Advanced Analytics Documentation

### Overview
EduSight implements **10 advanced algorithmic models** for educational analytics:

### 1. Random Forest Regressor
**File**: `ml_models/advanced_ml_engine.py` (Line 139-184)
**Purpose**: Academic performance prediction
**Features Used**: `age, gender, grade, psychological_score, physical_score`
**Accuracy**: 85-95%

```python
# Usage Example
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42
)
prediction = model.predict(student_features)
```

### 2. XGBoost Classifier
**File**: `ml_models/advanced_ml_engine.py` (Line 186-235)
**Purpose**: Student risk assessment
**Features Used**: `academic_score, psychological_score, age`
**Output**: Risk levels (Low/Medium/High)

```python
# Usage Example
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1
)
risk_level = model.predict(student_data)
```

### 3. LightGBM Classifier
**File**: `ml_models/advanced_ml_engine.py` (Line 237-282)
**Purpose**: Career recommendation system
**Features Used**: `academic_score, psychological_score, physical_score`
**Output**: Career aptitude categories

### 4. Neural Network (TensorFlow/Keras)
**File**: `ml_models/advanced_ml_engine.py` (Line 284-343)
**Purpose**: Complex pattern recognition in academic data
**Architecture**: 
- Input Layer: 8 features
- Hidden Layers: 128 → 64 → 32 neurons
- Output: 1 (regression)
- Activation: ReLU, Dropout for regularization

```python
# Neural Network Architecture
model = Sequential([
    Dense(128, activation='relu', input_shape=(8,)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(1, activation='linear')
])
```

### 5. Support Vector Machine (SVM)
**File**: `ml_models/advanced_ml_engine.py` (Line 345-386)
**Purpose**: Performance categorization
**Kernel**: RBF (Radial Basis Function)
**Output**: Performance categories (Excellent/Good/Average/Needs Improvement)

### 6. Logistic Regression
**File**: `ml_models/advanced_ml_engine.py` (Line 388-420)
**Purpose**: Binary classification for risk factors
**Features**: Statistical approach for interpretable results

### 7. Decision Tree Classifier
**File**: `ml_models/advanced_ml_engine.py` (Line 422-440)
**Purpose**: Interpretable decision making
**Max Depth**: 10 levels for optimal balance

### 8. K-Nearest Neighbors (KNN)
**File**: `ml_models/advanced_ml_engine.py` (Line 442-460)
**Purpose**: Similarity-based recommendations
**Neighbors**: 5 (optimal for educational data)

### 9. Naive Bayes
**File**: `ml_models/advanced_ml_engine.py` (Line 462-480)
**Purpose**: Probabilistic classification
**Type**: Gaussian Naive Bayes for continuous features

### 10. Ensemble Methods
**File**: `ml_models/advanced_ml_engine.py` (Line 482-510)
**Purpose**: Combining multiple algorithms for better accuracy
**Method**: Voting Classifier (Hard Voting)

### Algorithmic Model Training Pipeline
**File**: `ml_predictions/management/commands/initialize_ml.py`

```bash
# Initialize all algorithmic models
python manage.py initialize_ml
```

### Advanced Analytics Engine Usage
**File**: `ml_predictions/advanced_ml_views.py`

```python
# Import and use
from ml_predictions.advanced_ml_views import AdvancedMLPredictor
```

---

## 📊 Database Schema

### Core Models

#### 1. Student Models (`students/models.py`)
```python
class Student(Model):
    """Main student profile"""
    user = OneToOneField(User, related_name='student_profile')
    student_id = CharField(max_length=20, unique=True)
    grade = CharField(max_length=3)
    section = CharField(max_length=5)
    roll_number = CharField(max_length=10)
    date_of_birth = DateField()
    blood_group = CharField(max_length=5)
    emergency_contact = CharField(max_length=17)
    address = TextField()
    admission_date = DateField()
    is_active = BooleanField(default=True)
```

#### 2. Assessment Models (`assessments/models.py`)
```python
class Assessment(Model):
    """Assessment configurations"""
    assessment_id = UUIDField(default=uuid.uuid4)
    title = CharField(max_length=200)
    description = TextField()
    assessment_type = CharField(choices=TYPE_CHOICES)
    # academic, psychological, physical, dmit
    max_score = IntegerField()
    passing_score = IntegerField()
    duration_minutes = IntegerField()
    instructions = TextField()
    is_active = BooleanField(default=True)

class AssessmentResult(Model):
    """Individual assessment results"""
    result_id = UUIDField(default=uuid.uuid4)
    student = ForeignKey(Student)
    assessment = ForeignKey(Assessment)
    score = IntegerField()
    percentage = DecimalField(max_digits=5, decimal_places=2)
    time_taken = IntegerField()  # in minutes
    started_at = DateTimeField()
    completed_at = DateTimeField()
    answers_data = JSONField()  # Store detailed answers
```

#### 3. EPR System Models (`epr_system/data_models.py`)
```python
class StudentDataProfile(Model):
    """Main EPR profile for students"""
    profile_id = UUIDField(default=uuid.uuid4)
    student = ForeignKey(User)
    payment_status = CharField(choices=PAYMENT_STATUS_CHOICES)
    plan_type = CharField(choices=PLAN_CHOICES)
    current_academic_year = CharField(max_length=9)
    total_epr_score = DecimalField(max_digits=5, decimal_places=2)
    academic_score = DecimalField(max_digits=5, decimal_places=2)
    psychological_score = DecimalField(max_digits=5, decimal_places=2)
    physical_score = DecimalField(max_digits=5, decimal_places=2)
    performance_band = CharField(choices=BAND_CHOICES)
    # thriving, healthy_progress, needs_support, at_risk
```

#### 4. CRM Models (`crm/models.py`)
```python
class Lead(Model):
    """Lead/prospect information"""
    lead_id = UUIDField(default=uuid.uuid4)
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    email = EmailField()
    phone = CharField(max_length=17)
    child_name = CharField(max_length=100)
    child_age = IntegerField()
    status = CharField(choices=LEAD_STATUS_CHOICES)
    # new, contacted, interested, qualified, converted
    interested_in_dmit = BooleanField(default=False)

class Appointment(Model):
    """DMIT and consultation appointments"""
    appointment_id = UUIDField(default=uuid.uuid4)
    lead = ForeignKey(Lead)
    appointment_type = CharField(choices=APPOINTMENT_TYPE_CHOICES)
    # dmit, consultation, career_guidance
    scheduled_date = DateTimeField()
    location_type = CharField(choices=LOCATION_CHOICES)
    # home, center, online
    price = DecimalField(max_digits=10, decimal_places=2, default=2999.00)
    status = CharField(choices=STATUS_CHOICES)
    # scheduled, confirmed, completed, cancelled
```

---

## 🔌 API Endpoints

### Dashboard APIs
```python
# Dashboard statistics
GET /api/dashboard/
{
    "total_students": 13,
    "total_assessments": 188,
    "algorithms_active": 10,
    "recent_activities": [...]
}

# Student list
GET /api/students/
{
    "students": [
        {
            "id": 1,
            "name": "John Doe",
            "grade": "10",
            "performance_score": 85.5
        }
    ]
}

# Advanced predictions
GET /api/analytics/predictions/
{
    "total_predictions": 0,
    "total_models": 14,
    "avg_accuracy": 89.2,
    "recent_predictions": [...]
}
```

### Advanced Prediction APIs
```python
# Generate prediction
POST /analytics/predict/<student_id>/
{
    "prediction_type": "performance_forecast",
    "student_data": {
        "age": 15,
        "academic_score": 85,
        "psychological_score": 78
    }
}

# Response
{
    "predicted_score": 87.3,
    "confidence": 89.2,
    "model_used": "random_forest",
    "feature_importance": {...},
    "recommendations": [...]
}
```

---

## 🎯 CRM System

### Lead Management
- **Lead Capture**: Website forms, DMIT inquiries, assessment bookings
- **Lead Scoring**: Automated scoring based on engagement and demographics
- **Lead Nurturing**: Email campaigns and follow-up workflows
- **Conversion Tracking**: From inquiry to assessment completion

### Appointment System
- **DMIT Bookings**: ₹2,999 home collection service
- **Consultation Scheduling**: Career guidance and parent consultations
- **Location Management**: Home visits, center appointments, online sessions
- **Payment Integration**: Razorpay integration for secure payments

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 16+ (for frontend build tools)
- SQLite3 (or PostgreSQL for production)
- Redis (for caching and sessions)

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/edusight.git
cd edusight
```

2. **Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Database Setup**
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. **Load Sample Data**
```bash
python manage.py loaddata fixtures/sample_data.json
python create_comprehensive_sample_data.py
```

6. **Initialize Advanced Models**
```bash
python manage.py initialize_ml
```

7. **Run Development Server**
```bash
python manage.py runserver
```

---

## 📋 Development Guidelines

### Code Standards
- **PEP 8**: Python code formatting
- **Type Hints**: Use type hints for all functions
- **Documentation**: Comprehensive docstrings
- **Testing**: Unit tests for all critical functions

### Security Best Practices
- **Input Validation**: Validate all user inputs
- **CSRF Protection**: Enable for all forms
- **SQL Injection**: Use Django ORM parameterized queries
- **Authentication**: Strong password requirements
- **Data Privacy**: GDPR compliance for student data

### Performance Optimization
- **Database Indexes**: Optimize query performance
- **Caching**: Redis for frequently accessed data
- **Pagination**: Large dataset handling
- **Image Optimization**: Compress and resize images

---

## 🚀 Deployment Instructions

### Production Environment

1. **Server Setup**
```bash
# Ubuntu 20.04 LTS
sudo apt update
sudo apt install python3.11 python3.11-venv nginx supervisor postgresql redis-server
```

2. **Application Deployment**
```bash
# Clone and setup
git clone https://github.com/yourusername/edusight.git /var/www/edusight
cd /var/www/edusight
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Database Configuration**
```bash
# PostgreSQL setup
sudo -u postgres createdb edusight_prod
sudo -u postgres createuser edusight_user
```

4. **Static Files**
```bash
python manage.py collectstatic --noinput
```

5. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /static/ {
        alias /var/www/edusight/staticfiles/;
    }
    
    location /media/ {
        alias /var/www/edusight/media/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

6. **SSL Certificate**
```bash
sudo certbot --nginx -d yourdomain.com
```

### Environment Variables
```bash
# Production settings
DJANGO_SETTINGS_MODULE=edusight_django.settings.production
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/edusight_prod
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DEBUG=False
```

---

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Django Debug Toolbar**: Development performance insights
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance monitoring
- **PostgreSQL Logs**: Database query optimization

### Business Analytics
- **Google Analytics**: Website traffic and user behavior
- **Custom Dashboard**: Student engagement metrics
- **CRM Analytics**: Lead conversion and sales performance
- **Assessment Analytics**: Completion rates and performance trends

---

## 🔐 Security Configuration

### Authentication & Authorization
- **Django Auth**: Built-in user authentication
- **Permission Classes**: Role-based access control
- **Session Security**: Secure session configuration
- **Password Policies**: Strong password requirements

### Data Protection
- **Encryption**: Sensitive data encryption
- **Backup Strategy**: Automated daily backups
- **Access Logs**: Comprehensive audit trails
- **GDPR Compliance**: Data privacy regulations

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Database Optimization**: Weekly index rebuilds
- **Log Rotation**: Daily log cleanup
- **Security Updates**: Monthly security patches
- **Backup Verification**: Weekly backup testing

### Support Channels
- **Admin Dashboard**: Built-in support ticket system
- **Email Support**: technical@edusight.com
- **Documentation**: Internal wiki and API docs
- **Training**: Regular developer training sessions

---

**© 2024 EduSight Platform - Confidential Developer Documentation**
