# EduSight - Comprehensive Student Assessment Platform

EduSight is an advanced educational assessment platform that provides comprehensive analysis of students across academic, psychological, and physical health domains using the **EPR (Edusight Prism Rating)** system.

## 🌟 Key Features

### 🎯 EPR Assessment System
- **Holistic Student Evaluation**: Academic (40%) + Psychological (30%) + Physical (30%)
- **Scientific Scoring**: Based on validated instruments (SDQ, DASS-21, PERMA)
- **Performance Bands**: Thriving, Healthy Progress, Needs Support, At-Risk
- **Predictive Analytics**: Future performance projections and recommendations

### 🔄 Apache Airflow Workflow Management
- **Automated Workflows**: Daily EPR calculations, lead processing, system maintenance
- **Custom Operators**: EduSight-specific automation for assessments and CRM
- **Professional Scheduling**: Cron-based scheduling with retry logic and monitoring
- **Real-time Monitoring**: Web interface for workflow management and triggering

### 📊 Advanced Analytics Engine
- **Benchmarking**: Compare with national, state, and local averages
- **Trend Analysis**: Performance patterns and improvement tracking
- **Predictive Modeling**: ML-powered future performance predictions
- **Interactive Visualizations**: Charts, graphs, and radar plots

### 📁 Intelligent File Processing
- **Multi-format Support**: CSV, Excel, PDF, Word documents, images
- **AI-powered OCR**: Extract data from scanned documents and images
- **Automatic Classification**: Smart detection of academic, psychological, or physical data
- **Data Validation**: Automatic error detection and correction suggestions

### 🎨 Modern Web Interface
- **Customer Portal**: Complete workflow from data upload to report generation
- **Admin Dashboard**: Comprehensive management interface with Airflow integration
- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Real-time Updates**: AJAX-powered interactions and live status updates

## 🏗️ Architecture

```
EduSight Platform
├── Django Backend (Python 3.9+)
├── Apache Airflow (Workflow Management)
├── SQLite Database (Development)
├── Bootstrap 5 Frontend
├── ML/AI Processing Engine
└── PDF Report Generator
```

## 📦 Installation

### Prerequisites
- Python 3.9+
- Git
- Virtual Environment

### Setup Instructions

1. **Clone the Repository**
```bash
git clone <repository-url>
cd edusight
```

2. **Create Virtual Environment**
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
pip install -r requirements_airflow.txt
```

4. **Database Setup**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

5. **Initialize Airflow**
```bash
# Set Airflow home
export AIRFLOW_HOME=$(pwd)/airflow_home  # Linux/Mac
$env:AIRFLOW_HOME = "$(pwd)/airflow_home"  # Windows PowerShell

# Initialize Airflow database
airflow db init

# Create Airflow admin user
airflow users create --username admin --password admin123 --firstname Admin --lastname User --role Admin --email admin@edusight.com
```

6. **Start Services**
```bash
# Terminal 1: Django Development Server
python manage.py runserver

# Terminal 2: Airflow Webserver
airflow webserver -p 8080

# Terminal 3: Airflow Scheduler
airflow scheduler
```

## 🚀 Quick Start

### For Students/Parents (B2C)

1. **Visit the Website**: Navigate to `http://localhost:8000`
2. **Choose Assessment Plan**: Basic (₹499), Gold (₹899), Platinum (₹1499)
3. **Complete Payment**: Redirected to student dashboard
4. **Upload Data**: Academic records, medical reports, assessment results
5. **Data Validation**: Review and fix any data issues
6. **Get Analysis**: Comprehensive EPR analysis and insights
7. **Download Report**: Professional PDF report with recommendations

### For Administrators

1. **Access Admin Panel**: `http://localhost:8000/admin-panel/`
2. **Manage Workflows**: `http://localhost:8000/admin-panel/workflows/`
3. **Airflow Interface**: `http://localhost:8080`
4. **Monitor System**: Real-time dashboards and analytics

## 📋 Workflow Process

### Customer Journey (10-Step Process)

1. **Payment Completion** → Customer Portal Access
2. **Data Upload** → CSV, Excel, PDF, Images, Documents
3. **Data Validation** → AI-powered error detection and correction
4. **Data Analysis** → Comprehensive multi-domain analysis
5. **Benchmark Comparison** → National/state/local comparisons
6. **Prediction Analysis** → Future performance projections
7. **EPR Calculation** → Scientific scoring across all domains
8. **Advanced Analytics** → Filter-based detailed insights
9. **Report Generation** → Professional branded PDF reports
10. **Dashboard Management** → Ongoing data and report access

### Automated Workflows

#### Daily EPR Calculation
- **Schedule**: Every day at 6:00 AM
- **Process**: System health → EPR calculation → Alert generation → Reporting
- **Outputs**: At-risk student alerts, daily summary reports

#### Lead Processing
- **Schedule**: Every 2 hours
- **Process**: Lead scoring → Hot/warm/cold categorization → Follow-up scheduling
- **Outputs**: Sales alerts, CRM integration, automated follow-ups

#### System Maintenance
- **Schedule**: Daily at 2:00 AM
- **Process**: Database optimization → Backup creation → Log cleanup → Health monitoring
- **Outputs**: System health reports, automated backups

## 🧠 EPR Scoring Algorithm

### Academic Domain (40% Weight)
- Standardized test scores
- GPA and grade performance
- Attendance and engagement
- Teacher evaluations
- Homework completion rates

### Psychological Domain (30% Weight)
- **SDQ**: Strengths and Difficulties Questionnaire
- **DASS-21**: Depression, Anxiety, Stress Scale
- **PERMA**: Positive Psychology metrics
- Behavioral observations
- Social skills assessment

### Physical Domain (30% Weight)
- Anthropometric data (Height, Weight, BMI)
- Fitness assessments
- Health indicators
- Activity and sleep patterns
- Nutrition assessments

### Performance Bands
- **Thriving** (85-100): Excellent across all domains
- **Healthy Progress** (70-84): Good performance with minor areas for improvement
- **Needs Support** (50-69): Requires targeted interventions
- **At-Risk** (<50): Immediate comprehensive support needed

## 🛠️ Technology Stack

### Backend
- **Django 5.2.5**: Web framework
- **Django REST Framework**: API development
- **Apache Airflow 2.8.1**: Workflow orchestration
- **SQLite/PostgreSQL**: Database
- **Celery**: Asynchronous task processing

### Machine Learning & AI
- **Scikit-learn**: ML algorithms
- **TensorFlow/Keras**: Deep learning
- **Pandas**: Data processing
- **NumPy**: Numerical computing
- **OpenCV**: Image processing
- **Tesseract OCR**: Text extraction

### Frontend
- **Bootstrap 5**: CSS framework
- **Chart.js**: Data visualization
- **jQuery**: JavaScript interactions
- **Font Awesome**: Icons

### File Processing
- **Pandas**: CSV/Excel processing
- **PyPDF2**: PDF text extraction
- **python-docx**: Word document processing
- **Pillow**: Image processing
- **pytesseract**: OCR processing

## 📊 Data Models

### Core Models
- **StudentDataProfile**: Main student data management
- **DataUpload**: File upload tracking and processing
- **AcademicDataEntry**: Academic performance records
- **PsychologicalDataEntry**: Psychological assessment data
- **PhysicalDataEntry**: Physical health and fitness data
- **DataValidationIssue**: Data quality management
- **YearwiseDataSummary**: Annual summaries and trends

### Workflow Models
- **WorkflowTemplate**: Airflow DAG templates
- **WorkflowTrigger**: Event-based triggers
- **WorkflowExecution**: Execution tracking
- **WorkflowAuditLog**: Comprehensive audit trails

## 🔧 Configuration

### Environment Variables
```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3

# Airflow Configuration
AIRFLOW_HOME=/path/to/airflow_home
AIRFLOW_BASE_URL=http://localhost:8080

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password
```

### Airflow Configuration
- **Executor**: LocalExecutor (Development), CeleryExecutor (Production)
- **Database**: SQLite (Development), PostgreSQL (Production)
- **Scheduler**: Configured for optimal performance
- **Web Authentication**: Optional RBAC integration

## 📈 API Endpoints

### Student Portal APIs
- `POST /api/upload/` - File upload
- `GET /api/analysis/` - Get analysis results
- `POST /api/epr-calculate/` - Trigger EPR calculation
- `GET /api/reports/` - Download reports

### Admin APIs
- `GET /api/admin/workflows/` - List workflows
- `POST /api/admin/workflows/trigger/` - Trigger workflow
- `GET /api/admin/analytics/` - System analytics
- `POST /api/admin/backup/` - Create backup

## 🔐 Security Features

- **Authentication**: Django's built-in authentication system
- **Authorization**: Role-based access control (RBAC)
- **File Upload Security**: Type validation and size limits
- **Data Encryption**: Sensitive data encryption
- **CSRF Protection**: Cross-site request forgery protection
- **SQL Injection Prevention**: Django ORM protection

## 🧪 Testing

```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test epr_system
python manage.py test workflow_system

# Test Airflow DAGs
airflow dags test epr_daily_calculation
```

## 📚 Documentation

### Key Documentation Files
- `DEVELOPER_DOCUMENTATION.md`: Comprehensive technical documentation
- `MIGRATION_SUMMARY.md`: Database migration details
- `airflow_home/dags/`: Workflow documentation and examples

### API Documentation
- Django Admin Interface: `http://localhost:8000/admin/`
- Airflow Web UI: `http://localhost:8080`
- REST API: Available through Django REST Framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: EduSight Development Team
- **Backend Development**: Django + Python specialists
- **Workflow Engineering**: Apache Airflow experts
- **Data Science**: ML/AI and educational assessment specialists
- **Frontend Development**: Modern web interface designers

## 📞 Support

- **Email**: support@edusight.com
- **Documentation**: [Wiki](https://github.com/your-repo/edusight/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/edusight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/edusight/discussions)

## 🚀 Deployment

### Production Deployment
1. **Database**: PostgreSQL recommended
2. **Web Server**: Nginx + Gunicorn
3. **Task Queue**: Celery + Redis
4. **Monitoring**: Prometheus + Grafana
5. **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up --scale worker=3
```

### Cloud Deployment
- **AWS**: EC2, RDS, S3, CloudWatch
- **Google Cloud**: Compute Engine, Cloud SQL, Cloud Storage
- **Azure**: Virtual Machines, Azure Database, Blob Storage

## 🔄 Version History

- **v1.0.0**: Initial release with EPR system
- **v1.1.0**: Airflow integration and workflow management
- **v1.2.0**: Advanced file processing and AI integration
- **v1.3.0**: Customer portal and complete workflow
- **v1.4.0**: Advanced analytics and benchmarking

---

**EduSight** - Empowering educational excellence through comprehensive student assessment and data-driven insights. 🎓✨
