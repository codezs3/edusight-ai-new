# 🚀 EduSight Platform - Developer Documentation

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [ML Algorithms Documentation](#ml-algorithms-documentation)
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
- **AI-powered educational analytics** with 10 ML algorithms
- **CRM system** for lead management
- **Multi-framework support** (CBSE, ICSE, IGCSE, IB)
- **Modern responsive website** with appointment booking

### Key Features
- 🤖 **10 Advanced ML Algorithms** (Random Forest, XGBoost, Neural Networks, etc.)
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

### ML & Analytics
- **scikit-learn 1.7.1** - Machine learning algorithms
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
├── ml_predictions/     # ML algorithms & predictions
├── crm/               # Customer relationship management
└── templates/
    ├── dashboard/     # Admin templates
    └── website/       # B2C website templates
```

---

## 🤖 ML Algorithms Documentation

### Overview
EduSight implements **10 advanced ML algorithms** for educational analytics:

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

### ML Model Training Pipeline
**File**: `ml_predictions/management/commands/initialize_ml.py`

```bash
# Initialize all ML models
python manage.py initialize_ml
```

### Advanced ML Engine Usage
**File**: `ml_predictions/advanced_ml_views.py`

```python
# Import and use
from ml_predictions.advanced_ml_views import AdvancedMLPredictor

predictor = AdvancedMLPredictor()
predictor.load_or_train_models()

# Make predictions
performance = predictor.predict_performance(student_data)
risk = predictor.assess_risk(student_data)
career = predictor.recommend_career(student_data)
```

---

## 📄 Pages & Components Documentation

### B2C Website Structure

#### 1. Homepage (`templates/website/home.html`)
**URL**: `/`
**Purpose**: Main landing page with DMIT focus
**Features**:
- Hero section with DMIT preview
- Feature showcase (6 cards)
- DMIT pricing (₹2,999)
- Process explanation (4 steps)
- Testimonials (3 reviews)
- CTA sections

**Key Components**:
```html
<!-- Hero with DMIT preview -->
<section class="hero-section">
    <!-- DMIT analysis preview card -->
    <div class="card-custom p-4 bg-white bg-opacity-10">
        <!-- Real-time stats display -->
    </div>
</section>

<!-- Features grid -->
<section class="section-padding bg-light">
    <!-- 6 feature cards with animations -->
</section>

<!-- DMIT pricing -->
<section class="section-padding">
    <!-- Pricing card with ₹2,999 package -->
</section>
```

#### 2. DMIT Information Page (`templates/website/dmit_info.html`)
**URL**: `/dmit/`
**Purpose**: Detailed DMIT explanation and benefits
**Features**:
- Scientific foundation explanation
- Age group recommendations (3-6, 7-12, 13-17, 18+)
- 6-step process visualization
- Benefits breakdown

#### 3. Appointment Booking (`templates/website/book_appointment.html`)
**URL**: `/book-appointment/`
**Purpose**: DMIT test booking with form validation
**Features**:
- Multi-section form (Parent info, Child info, Schedule, Address)
- Date/time validation
- Real-time form validation
- FAQ accordion
- Terms & conditions

**Form Fields**:
```python
# Parent Information
first_name, last_name, email, phone

# Child Information  
child_name, child_age, child_grade

# Scheduling
preferred_date, preferred_time

# Address
address, city, state, pincode, special_instructions
```

#### 4. Framework Pages
**URLs**: `/frameworks/{cbse|icse|igcse|ib|psychological|physical}/`
**Template**: `templates/website/framework_detail.html`
**Purpose**: Framework-specific information and features

#### 5. About Us (`templates/website/about.html`)
**URL**: `/about/`
**Features**: Team information, company story, expertise areas

#### 6. Contact Us (`templates/website/contact.html`)
**URL**: `/contact/`
**Features**: Contact form, office locations, social media links

### Admin Dashboard Structure

#### 1. Main Dashboard (`templates/dashboard/dashboard.html`)
**URL**: `/dashboard/`
**Purpose**: Analytics overview with ML integration
**Features**:
- Statistics cards (Students, Tests, ML Algorithms)
- ML status indicator
- Advanced charts with Chart.js
- Mega menu navigation
- Responsive design

**Key Features**:
```html
<!-- ML Status Indicator -->
<div class="ml-status-indicator">
    🤖 Advanced ML Engine v2.0 - 10 ML Algorithms Active
</div>

<!-- Statistics Dashboard -->
<div class="stats-dashboard">
    <!-- 4 stat cards including ML Algorithms count -->
</div>

<!-- Advanced Charts -->
<div class="charts-section">
    <!-- Performance chart with ML predictions -->
    <!-- Compact analytics grid -->
</div>
```

#### 2. Mega Menu Implementation
**File**: `templates/dashboard/dashboard.html` (Lines 995-1180)
**Features**:
- Multi-level dropdown structure
- Responsive mobile menu
- Framework-specific submenus
- Icon integration

```css
/* Mega Menu CSS */
.mega-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: var(--shadow-xl);
    padding: 2rem;
}

.mega-menu-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}
```

---

## 🗄️ Database Schema

### Core Models

#### 1. Student Models (`students/models.py`)
```python
class User(AbstractUser):
    """Custom user model extending Django's AbstractUser"""
    user_type = CharField(choices=USER_TYPE_CHOICES)
    date_of_birth = DateField()
    phone = CharField(max_length=15)

class Student(Model):
    """Student profile with academic information"""
    user = OneToOneField(User)
    student_id = CharField(unique=True)
    grade = CharField(max_length=10)
    school = ForeignKey(School)
    parent = ForeignKey(Parent)
```

#### 2. Assessment Models (`assessments/models.py`)
```python
class Assessment(Model):
    """Assessment configuration"""
    title = CharField(max_length=200)
    assessment_type = CharField(choices=TYPE_CHOICES)
    # academic, psychological, physical, wellbeing, dmit

class AssessmentResult(Model):
    """Individual assessment results"""
    student = ForeignKey(Student)
    assessment = ForeignKey(Assessment)
    percentage = DecimalField(max_digits=5, decimal_places=2)
    completed_at = DateTimeField()
```

#### 3. ML Prediction Models (`ml_predictions/models.py`)
```python
class MLModel(Model):
    """ML model metadata"""
    name = CharField(max_length=100)
    model_type = CharField(choices=MODEL_TYPE_CHOICES)
    # neural_network, random_forest, svm, etc.
    version = CharField(max_length=20)
    accuracy_score = DecimalField(max_digits=5, decimal_places=2)
    is_active = BooleanField(default=True)

class MLPrediction(Model):
    """ML prediction results"""
    student = ForeignKey(Student)
    prediction_type = CharField(choices=PREDICTION_TYPE_CHOICES)
    # academic_performance, career_recommendation, risk_assessment
    input_data = JSONField()
    prediction_result = JSONField()
    confidence_score = DecimalField(max_digits=5, decimal_places=2)
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
    "ml_algorithms_active": 10,
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

# ML predictions
GET /api/ml/predictions/
{
    "total_predictions": 0,
    "total_models": 14,
    "avg_accuracy": 89.2,
    "recent_predictions": [...]
}
```

### ML Prediction APIs
```python
# Generate prediction
POST /ml/predict/<student_id>/
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
    "model_type": "Random Forest ML",
    "recommendations": [...]
}
```

### CRM APIs
```python
# Form submission capture
POST /ajax/contact/
{
    "form_type": "dmit_inquiry",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "message": "Interested in DMIT test"
}

# Response
{
    "success": true,
    "message": "Thank you for your inquiry!",
    "submission_id": "uuid-string"
}
```

---

## 🎯 CRM System Documentation

### Lead Management
**File**: `crm/views.py`
**Features**:
- Automatic lead creation from website forms
- Lead status tracking (New → Contacted → Converted)
- Source tracking (Website, Social Media, Referral)
- Priority assignment (Low/Medium/High/Urgent)

### Call Logging
**Model**: `CallLog`
**Features**:
- Time tracking (start/end/duration)
- Call outcome recording
- Next action planning
- Integration with lead timeline

### Appointment Management
**Model**: `Appointment`
**Features**:
- DMIT appointment scheduling
- Home visit coordination
- Payment tracking (₹2,999 default)
- Status management (Scheduled → Confirmed → Completed)

### Form Submission Tracking
**Model**: `FormSubmission`
**Features**:
- All website form captures
- IP address & user agent tracking
- Automatic lead association
- Processing status tracking

---

## ⚙️ Setup & Installation

### Prerequisites
```bash
# Python 3.11+
python --version

# Required packages
pip install django==5.2.5
pip install djangorestframework
pip install django-cors-headers
pip install python-decouple
pip install Pillow
```

### ML Libraries Installation
```bash
# Advanced ML packages
pip install scikit-learn==1.7.1
pip install tensorflow==2.20.0
pip install xgboost==3.0.4
pip install lightgbm==4.6.0
pip install numpy pandas matplotlib seaborn joblib
```

### Database Setup
```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Initialize ML models
python manage.py initialize_ml

# Load sample data (optional)
python create_sample_data.py
```

### Development Server
```bash
# Start development server
python manage.py runserver 8000

# Access points:
# Website: http://localhost:8000/
# Admin Dashboard: http://localhost:8000/dashboard/
# Django Admin: http://localhost:8000/admin/
```

---

## 📝 Development Guidelines

### Code Structure
```
# App-specific organization
app_name/
├── models.py          # Database models
├── views.py           # View logic
├── urls.py            # URL routing
├── admin.py           # Admin interface
├── migrations/        # Database migrations
└── management/
    └── commands/      # Custom management commands
```

### ML Development
```python
# ML model development workflow
1. Data preparation (ml_models/advanced_ml_engine.py)
2. Model training (train_all_models method)
3. Model evaluation (cross-validation)
4. Model persistence (joblib.dump)
5. Prediction interface (advanced_ml_views.py)
```

### Frontend Development
```javascript
// JavaScript organization
1. Base animations (AOS initialization)
2. Chart.js implementations
3. Form validation
4. AJAX functionality
5. Responsive design handlers
```

### CSS Architecture
```css
/* CSS organization */
:root {
    /* Color variables */
    --primary-blue: #2563eb;
    --turquoise: #06b6d4;
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
}

/* Component-based styles */
.btn-primary-custom { /* Custom button styles */ }
.card-custom { /* Custom card styles */ }
.hero-section { /* Hero section styles */ }
```

---

## 🚀 Deployment Instructions

### Production Setup
```bash
# Environment variables (.env file)
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/edusight
ALLOWED_HOSTS=your-domain.com

# Static files collection
python manage.py collectstatic

# Database migration
python manage.py migrate --settings=edusight_django.settings_production
```

### Server Configuration
```nginx
# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    
    location /static/ {
        alias /path/to/staticfiles/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### ML Model Deployment
```bash
# Ensure ML models are trained
python manage.py initialize_ml

# Verify model files exist
ls ml_models/
# Should contain: *.pkl files for trained models
```

---

## 🔧 Maintenance & Monitoring

### Log Files
```bash
# Django logs
tail -f logs/django.log

# Check ML model performance
python manage.py shell -c "
from ml_predictions.models import MLPrediction
print(f'Total predictions: {MLPrediction.objects.count()}')
"
```

### Database Maintenance
```bash
# Backup database
python manage.py dumpdata > backup.json

# Check database status
python manage.py shell -c "
from django.db import connection
print(f'Database: {connection.settings_dict[\"NAME\"]}')
"
```

### Performance Monitoring
```python
# Monitor ML predictions
GET /api/ml/predictions/
# Response time should be < 200ms

# Monitor website performance
# Forms submission rate
# Appointment booking conversion
# ML prediction accuracy trends
```

---

## 📊 Analytics & Reporting

### ML Model Performance
```python
# Model accuracy tracking
models = MLModel.objects.all()
for model in models:
    print(f"{model.name}: {model.accuracy_score}%")

# Prediction success rate
predictions = MLPrediction.objects.all()
avg_confidence = predictions.aggregate(avg=Avg('confidence_score'))
```

### Business Metrics
```python
# Lead conversion tracking
leads = Lead.objects.all()
conversion_rate = leads.filter(status='converted').count() / leads.count()

# DMIT appointment metrics
appointments = Appointment.objects.filter(appointment_type='dmit')
completed_dmit = appointments.filter(status='completed').count()
dmit_revenue = sum([apt.final_price for apt in completed_dmit])
```

---

## 🔐 Security Considerations

### Authentication
- Django's built-in authentication system
- Custom User model with role-based access
- Staff-only access to admin dashboard
- CSRF protection on all forms

### Data Protection
- SQLite database with proper file permissions
- Environment variables for sensitive data
- Input validation and sanitization
- Secure password hashing (Django default)

### ML Model Security
- Model files stored securely
- Input validation for ML predictions
- Rate limiting on prediction APIs
- Audit trail for ML predictions

---

## 📞 Support & Troubleshooting

### Common Issues

#### 1. ML Models Not Loading
```bash
# Reinitialize ML models
python manage.py initialize_ml

# Check model files
ls ml_models/
```

#### 2. Website Not Loading
```bash
# Check URLs configuration
python manage.py check
```

#### 3. Database Errors
```bash
# Reset migrations (dev only)
python manage.py migrate --fake-initial
```

### Debug Mode
```python
# Enable debug mode (settings.py)
DEBUG = True

# Check Django logs
tail -f logs/django.log
```

---

## 📈 Future Enhancements

### Planned Features
1. **Advanced Analytics Dashboard**
   - Real-time ML model performance
   - A/B testing for ML algorithms
   - Predictive analytics for business metrics

2. **Mobile Application**
   - React Native app
   - Push notifications for appointments
   - Offline DMIT report viewing

3. **Enhanced ML Capabilities**
   - Natural Language Processing for feedback analysis
   - Computer Vision for assessment automation
   - Reinforcement Learning for personalized recommendations

4. **Integration Capabilities**
   - Payment gateway integration (Razorpay/Stripe)
   - SMS/WhatsApp notifications
   - Email marketing automation
   - Google Calendar integration

---

## 📝 Contributing Guidelines

### Code Standards
- Follow PEP 8 for Python code
- Use meaningful variable names
- Add docstrings to all functions
- Include unit tests for new features

### ML Model Development
- Use cross-validation for model evaluation
- Document model parameters and performance
- Include model interpretation and explainability
- Test with edge cases and different data distributions

### Frontend Development
- Follow Bootstrap conventions
- Ensure mobile responsiveness
- Test across different browsers
- Optimize for accessibility

---

## 📋 Changelog

### Version 2.0 (Current)
- ✅ Added 10 advanced ML algorithms
- ✅ Implemented comprehensive CRM system
- ✅ Created modern B2C website with DMIT focus
- ✅ Added appointment booking system
- ✅ Implemented mega menu navigation
- ✅ Enhanced responsive design

### Version 1.0 (Previous)
- ✅ Basic Django dashboard
- ✅ Student and assessment management
- ✅ Simple analytics and reporting
- ✅ Basic authentication system

---

**© 2025 EduSight Platform - Advanced Educational Analytics with AI**

*This documentation is comprehensive and should be updated as the platform evolves. For technical support, refer to the troubleshooting section or contact the development team.*
