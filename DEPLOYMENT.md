# EduSight Deployment Guide

This guide covers deployment options for the EduSight platform in various environments.

## 🚀 Quick Deployment Options

### Option 1: Local Development
```bash
# 1. Clone and setup
git clone <repository-url>
cd edusight
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt
pip install -r requirements_airflow.txt

# 3. Setup database
python manage.py migrate
python manage.py createsuperuser

# 4. Initialize Airflow
export AIRFLOW_HOME=$(pwd)/airflow_home
airflow db init
airflow users create --username admin --password admin123 --firstname Admin --lastname User --role Admin --email admin@edusight.com

# 5. Start services
python manage.py runserver &
airflow webserver -p 8080 &
airflow scheduler &
```

### Option 2: Docker Deployment
```bash
# Create docker-compose.yml and deploy
docker-compose up -d
```

### Option 3: Cloud Deployment (AWS/GCP/Azure)
```bash
# Use provided Terraform/CloudFormation templates
terraform init
terraform apply
```

## 🌐 Production Configuration

### Environment Variables
```bash
# Django
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Airflow
AIRFLOW__CORE__EXECUTOR=CeleryExecutor
AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://user:pass@host:port/airflow_db
AIRFLOW__CELERY__BROKER_URL=redis://localhost:6379/0
AIRFLOW__CELERY__RESULT_BACKEND=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-email-password

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Database Configuration
```python
# PostgreSQL (Recommended for production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'edusight_db',
        'USER': 'edusight_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🐳 Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://postgres:password@db:5432/edusight
    depends_on:
      - db
      - redis
    volumes:
      - media_volume:/app/media
      - static_volume:/app/staticfiles

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: edusight
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  airflow-webserver:
    build: .
    command: airflow webserver
    ports:
      - "8080:8080"
    environment:
      - AIRFLOW__CORE__EXECUTOR=CeleryExecutor
      - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://postgres:password@db:5432/airflow
      - AIRFLOW__CELERY__BROKER_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  airflow-scheduler:
    build: .
    command: airflow scheduler
    environment:
      - AIRFLOW__CORE__EXECUTOR=CeleryExecutor
      - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://postgres:password@db:5432/airflow
      - AIRFLOW__CELERY__BROKER_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery-worker:
    build: .
    command: airflow celery worker
    environment:
      - AIRFLOW__CORE__EXECUTOR=CeleryExecutor
      - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://postgres:password@db:5432/airflow
      - AIRFLOW__CELERY__BROKER_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - web

volumes:
  postgres_data:
  media_volume:
  static_volume:
```

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt requirements_airflow.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements_airflow.txt

# Copy project
COPY . .

# Create directories
RUN mkdir -p media staticfiles logs

# Collect static files
RUN python manage.py collectstatic --noinput

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV AIRFLOW_HOME=/app/airflow_home

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "edusight_django.wsgi:application"]
```

## ☁️ Cloud Deployment

### AWS Deployment
```bash
# Using AWS Elastic Beanstalk
eb init edusight-platform
eb create production
eb deploy

# Using AWS ECS with Fargate
aws ecs create-cluster --cluster-name edusight-cluster
aws ecs create-service --cluster edusight-cluster --service-name edusight-service
```

### Google Cloud Platform
```bash
# Using Google App Engine
gcloud app deploy app.yaml

# Using Google Kubernetes Engine
kubectl apply -f k8s/
```

### Azure Deployment
```bash
# Using Azure Container Instances
az container create --resource-group edusight-rg --name edusight-app
```

## 🔧 Nginx Configuration

### nginx.conf
```nginx
upstream django {
    server web:8000;
}

upstream airflow {
    server airflow-webserver:8080;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;

    client_max_body_size 100M;

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /airflow/ {
        proxy_pass http://airflow/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/media/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

## 📊 Monitoring & Logging

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'django'
    static_configs:
      - targets: ['web:8000']
  
  - job_name: 'airflow'
    static_configs:
      - targets: ['airflow-webserver:8080']
```

### Grafana Dashboards
- Django application metrics
- Airflow workflow monitoring
- System resource utilization
- Error rate and response time tracking

## 🔒 Security Checklist

### Pre-deployment Security
- [ ] Change all default passwords
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable CSRF protection
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
- [ ] Enable audit logging
- [ ] Configure backup strategy

### Production Security Settings
```python
# settings/production.py
DEBUG = False
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

## 📈 Performance Optimization

### Database Optimization
```python
# Database connection pooling
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'OPTIONS': {
            'MAX_CONNS': 20,
            'MIN_CONNS': 5,
        }
    }
}
```

### Caching Configuration
```python
# Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run tests
        run: |
          python manage.py test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 📞 Support & Troubleshooting

### Common Issues
1. **Airflow won't start**: Check AIRFLOW_HOME environment variable
2. **Database connection failed**: Verify database credentials and connectivity
3. **File upload fails**: Check media directory permissions
4. **OCR not working**: Install tesseract-ocr system package

### Logs Location
- Django: `/app/logs/django.log`
- Airflow: `/app/airflow_home/logs/`
- Nginx: `/var/log/nginx/`

### Health Check Endpoints
- Django: `http://yourdomain.com/health/`
- Airflow: `http://yourdomain.com/airflow/health`

For additional support, contact: admin@edusight.com
