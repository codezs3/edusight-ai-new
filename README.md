# EduSight - Educational Analytics Platform

A comprehensive student assessment platform built with modern open-source technologies, evaluating Academic Performance, Psychological Well-being & Physical Health with AI-powered analytics.

## 🚀 Technology Stack

### Frontend & Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### Authentication & Database
- **Auth.js (NextAuth.js)** - Authentication with multiple providers
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
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

### Core Assessment Areas
- **Academic Performance** - Grade tracking, subject analysis, study habits
- **Psychological Wellbeing** - Mood, stress, confidence, social interaction
- **Physical Health** - BMI, exercise, sleep quality, health conditions
- **Career Guidance** - Interest mapping, skill development, recommendations

### AI-Powered Insights
- **Academic Prediction** - Performance forecasting using neural networks
- **Career Path Recommendation** - ML-based career suggestions
- **Behavioral Risk Assessment** - Early intervention identification
- **Personalized Recommendations** - Tailored improvement strategies

### Advanced Features
- **Interactive Dashboards** - Real-time data visualization
- **Multi-file Upload** - CSV, Excel, PDF, and image processing
- **Role-based Access** - Student, Parent, Teacher, Admin, Counselor roles
- **Subscription Management** - Flexible pricing tiers with Stripe
- **Mobile Responsive** - Optimized for all devices

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
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/edusight"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
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
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

2. **Stripe Setup**:
   - Create account at [Stripe](https://stripe.com)
   - Get API keys from dashboard
   - Set up webhook endpoints for subscription events

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

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Server](https://discord.gg/edusight)
- [GitHub Discussions](https://github.com/your-org/edusight/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/edusight)

### Professional Support
- Email: support@edusight.com
- Enterprise: enterprise@edusight.com

## 🎯 Roadmap

### Q1 2024
- [ ] Mobile app development
- [ ] Advanced ML models
- [ ] Multi-language support

### Q2 2024
- [ ] Real-time collaboration
- [ ] Advanced reporting
- [ ] Integration marketplace

### Q3 2024
- [ ] AI-powered tutoring
- [ ] Predictive analytics
- [ ] Parent mobile app

---

**Built with ❤️ by the EduSight Team**

For more information, visit [edusight.com](https://edusight.com)