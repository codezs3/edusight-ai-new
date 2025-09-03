# EduSight - Educational Analytics Platform

A comprehensive student assessment platform built with modern open-source technologies, evaluating Academic Performance, Psychological Well-being & Physical Health with AI-powered analytics.

## 🚀 Technology Stack

### Frontend & Framework
- **Next.js 15.5.2** - React framework with App Router (Recently Upgraded)
- **React 18.3.1** - UI library with hooks and modern patterns (Stable Version)
- **TypeScript** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS framework (Stable Configuration)

### Authentication & Database
- **Auth.js (NextAuth.js v5)** - Authentication with multiple providers (Latest Version)
- **Prisma 6.15.0** - Type-safe database ORM
- **SQLite** - Development database / **PostgreSQL** - Production database
- **Stripe.js** - Payment processing and subscriptions

### Data Processing & ML
- **TensorFlow.js** - Machine learning in the browser
- **Papaparse** - CSV parsing and processing
- **PDF.js** - PDF document processing
- **Tesseract.js** - OCR for image text extraction

### Visualization & Analytics
- **Plotly.js** - Interactive charts and graphs
- **D3.js** - Custom data visualizations
- **React Hook Form** - Form handling with validation
- **Framer Motion** - Smooth animations

### Workflow & Analytics
- **Apache Airflow** - Workflow orchestration
- **Apache Superset** - Business intelligence and analytics

### Deployment & Performance
- **Vercel** - Deployment platform
- **React Query** - Data fetching and caching
- **Zod** - Runtime type validation

## 📋 Features

### 🎯 Core Assessment Areas
- **Academic Performance** - Grade tracking, subject analysis, study habits
- **Psychological Wellbeing** - Mood, stress, confidence, social interaction
- **Physical Health** - BMI, exercise, sleep quality, health conditions
- **Career Guidance** - Interest mapping, skill development, recommendations

### 🤖 AI-Powered Insights
- **Academic Prediction** - Performance forecasting using neural networks
- **Career Path Recommendation** - ML-based career suggestions
- **Behavioral Risk Assessment** - Early intervention identification
- **Personalized Recommendations** - Tailored improvement strategies

### 📚 Assessment Management System
- **Multi-Framework Support** - IGCSE, IB, ICSE, CBSE, STREAM + Custom Frameworks
- **Subject Management** - Create and manage subjects within each framework
- **Assessment Types** - Marks, Rubrics, and Custom assessment methods
- **Assessment Cycles** - Monthly, Quarterly, Six-monthly, Yearly cycles
- **Template System** - Standard templates for schools and parents
- **Skills Integration** - Comprehensive skills mapping and assessment

### 🔧 Admin Dashboard Features
- **User Management** - Complete CRUD operations for all user types
- **Academic Management** - Framework, subject, and assessment administration
- **Maintenance Module** - System backup and Google Drive integration
- **Analytics & Reports** - Comprehensive data visualization and insights
- **Financial Management** - Billing, subscriptions, and payment tracking

### 👥 Role-Based Dashboards
- **Admin Dashboard** - Complete system administration and oversight
- **Teacher Dashboard** - Student management and assessment tools
- **Parent Dashboard** - Child progress tracking and communication
- **Student Dashboard** - Personal progress and goal management
- **Counselor Dashboard** - Student guidance and intervention tools

### 📁 Document Upload System (NEW)
- **Parent Uploads** - Submit student documents for processing
- **School Uploads** - Bulk document uploads and management
- **Admin Viewing** - Document review and management interface
- **File Processing** - Automated document analysis and categorization

### 🛠️ Advanced Features
- **Interactive Dashboards** - Real-time data visualization
- **Multi-file Upload** - CSV, Excel, PDF, and image processing
- **Google Drive Integration** - Automated backup and storage
- **Demo User System** - Quick development and testing access
- **Workflow Engine** - Automated educational processes
- **Mobile Responsive** - Optimized for all devices
- **Subscription Management** - Flexible pricing tiers with Stripe

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/edusight.git
   cd edusight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create demo users (for development)**
   ```bash
   npm run seed:demo
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (Development - SQLite)
DATABASE_URL="file:./prisma/dev.db"

# Database (Production - PostgreSQL)
# DATABASE_URL="postgresql://username:password@localhost:5432/edusight"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Optional: External Services
DJANGO_API_URL="http://localhost:8000/api"
AIRFLOW_BASE_URL="http://localhost:8080"
SUPERSET_URL="http://localhost:8088"
```

### Database Setup

1. **Install PostgreSQL** and create a database
2. **Update DATABASE_URL** in your `.env.local`
3. **Run migrations**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Authentication Setup

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`

2. **Stripe Setup**:
   - Create account at [Stripe](https://stripe.com)
   - Get API keys from dashboard
   - Set up webhook endpoints for subscription events

## 👥 Demo Users for Development

For easy development and testing, the application includes a comprehensive demo user system:

### Quick Access
Visit the sign-in page at `http://localhost:3001/auth/signin` and use the **Demo Users** panel for one-click login.

### Available Demo Users

| Role | Email | Password | Dashboard Access |
|------|-------|----------|------------------|
| 👑 **Admin** | `admin@edusight.com` | `admin123` | Complete system administration |
| 👩‍🏫 **Teacher** | `teacher@edusight.com` | `teacher123` | Student assessment tools |
| 👨‍👩‍👦 **Parent** | `parent@edusight.com` | `parent123` | Child progress tracking |
| 🎓 **Student** | `student@edusight.com` | `student123` | Personal dashboard |

### Features
- **Auto-fill credentials** - Click any demo user to instantly fill login form
- **Role-based redirects** - Automatic navigation to appropriate dashboard
- **Development-ready** - Perfect for testing different user perspectives
- **Secure** - Properly hashed passwords with bcrypt

### Management Commands
```bash
# Create/reset demo users
npm run seed:demo

# The demo users are created automatically and safely
# (Uses upsert - no duplicates will be created)
```

For complete demo user documentation, see [DEMO_USERS.md](DEMO_USERS.md).

## 📊 Data Processing

### Supported File Types
- **CSV Files** - Student data, grades, assessments
- **Excel Files** - Spreadsheet data (.xlsx, .xls)
- **PDF Documents** - Reports, transcripts, assessments
- **Images** - Scanned documents with OCR processing

### File Upload Features
- **Drag & Drop** interface
- **Progress tracking** with real-time updates
- **Data validation** and error reporting
- **Automatic parsing** and normalization
- **Preview and confirmation** before processing

## 🤖 Machine Learning

### TensorFlow.js Models
- **Academic Performance Predictor** - Neural network for grade prediction
- **Career Path Recommender** - Multi-class classification for career suggestions
- **Behavioral Risk Assessment** - Early warning system for at-risk students

### Model Features
- **Client-side inference** - Fast, private predictions
- **Real-time analysis** - Instant feedback and recommendations
- **Continuous learning** - Models improve with more data
- **Explainable AI** - Clear reasoning for predictions

## 📈 Analytics & Visualization

### Chart Types
- **Academic Performance** - Bar charts, line graphs, radar charts
- **Progress Tracking** - Timeline visualizations
- **Comparison Charts** - Peer benchmarking
- **Interactive Dashboards** - Drill-down capabilities

### Visualization Libraries
- **Plotly.js** - Statistical charts and scientific plots
- **D3.js** - Custom interactive visualizations
- **Responsive Design** - Mobile-optimized charts

## 🔐 Security & Privacy

### Data Protection
- **Encrypted storage** - All sensitive data encrypted at rest
- **Secure transmission** - HTTPS/TLS for all communications
- **Access controls** - Role-based permissions
- **Audit logging** - Complete activity tracking

### Compliance
- **GDPR compliant** - Data protection and privacy rights
- **FERPA compliant** - Educational records protection
- **SOC 2 Type II** - Security and availability standards

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 API Documentation

### REST Endpoints
- `GET /api/students` - List students
- `POST /api/assessments` - Create assessment
- `GET /api/analytics/:studentId` - Get student analytics
- `POST /api/ml/predict` - ML predictions

### GraphQL (Optional)
- Flexible data querying
- Real-time subscriptions
- Type-safe operations

## 🧪 Testing

### Test Suites
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Testing Stack
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking

## 📖 Development

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Type checking

### Development Workflow
1. Create feature branch
2. Write tests
3. Implement feature
4. Run quality checks
5. Submit pull request

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Database Issues
```bash
# Prisma client not initialized
npx prisma generate

# Database connection issues
npx prisma db push

# Reset database (development only)
npx prisma db push --force-reset
npm run seed:demo
```

#### Authentication Issues
```bash
# NextAuth session errors
# Ensure NEXTAUTH_SECRET is set in .env.local
NEXTAUTH_SECRET="your-secret-key"

# Demo users not working
npm run seed:demo
```

#### Build/Development Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Port Conflicts
The application runs on port **3001** by default. If you need to change it:
```bash
# Update package.json
"dev": "next dev -p YOUR_PORT"

# Update NEXTAUTH_URL in .env.local
NEXTAUTH_URL="http://localhost:YOUR_PORT"
```

### Known Issues
- **Hydration Warnings**: Resolved in latest version
- **Tailwind CSS v4 Compatibility**: Using stable v3.4.17 configuration
- **React 19 Compatibility**: Reverted to stable React 18.3.1

### Getting Help
If you encounter issues:
1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/your-org/edusight/issues)
3. Create a new issue with detailed reproduction steps

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [Demo Users Guide](DEMO_USERS.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Server](https://discord.gg/edusight)
- [GitHub Discussions](https://github.com/your-org/edusight/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/edusight)

### Professional Support
- Email: support@edusight.com
- Enterprise: enterprise@edusight.com

## 🎯 Current Status & Roadmap

### ✅ Recently Completed (Latest Release)
- **Next.js 15 & React 18 Upgrade** - Latest stable versions with improved performance
- **NextAuth v5 Migration** - Enhanced authentication system with better security
- **Demo User System** - Complete development user management for easy testing
- **Assessment Management System** - Full CRUD for frameworks, subjects, types, and cycles
- **Academic Menu Integration** - Comprehensive admin dashboard with academic tools
- **Skills Management System** - Advanced skills mapping and assessment capabilities
- **Google Drive Integration** - Automated backup and maintenance tools
- **React Hydration Fixes** - Resolved SSR/CSR mismatches for smooth user experience
- **Prisma Schema Optimization** - Enhanced database models for assessment and user management

### 🚧 Currently In Development
- **Document Upload System** - File upload and processing for parents and schools
- **Admin Document Viewer** - Comprehensive document management interface
- **Enhanced Analytics** - Advanced reporting and data visualization
- **Mobile Responsiveness** - Improved mobile experience across all dashboards

### 📅 Upcoming Features (Q1 2024)
- [ ] Real-time notifications system
- [ ] Advanced file processing (OCR, automated categorization)
- [ ] Enhanced parent-teacher communication tools
- [ ] Student progress prediction algorithms

### 📅 Future Roadmap (Q2-Q3 2024)
- [ ] Mobile app development (React Native)
- [ ] Advanced ML models for educational insights
- [ ] Multi-language support (i18n)
- [ ] Real-time collaboration features
- [ ] Integration marketplace
- [ ] AI-powered tutoring system

### 🔧 Technical Improvements
- [ ] Performance optimization
- [ ] Enhanced test coverage
- [ ] CI/CD pipeline improvements
- [ ] Advanced caching strategies

---

**Built with ❤️ by the EduSight Team**

For more information, visit [edusight.com](https://edusight.com)