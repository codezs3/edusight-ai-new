-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "address" TEXT,
    "schoolId" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "dateOfJoining" DATETIME,
    "employeeId" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'B2C',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "type" TEXT,
    "board" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "establishedYear" INTEGER,
    "capacity" INTEGER,
    "principalName" TEXT,
    "principalEmail" TEXT,
    "principalPhone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "pincode" TEXT,
    "timezone" TEXT DEFAULT 'Asia/Kolkata',
    "language" TEXT DEFAULT 'en',
    "currency" TEXT DEFAULT 'INR',
    "schoolAdminId" TEXT,
    "subscriptionType" TEXT DEFAULT 'trial',
    "subscriptionEnds" DATETIME,
    "maxStudents" INTEGER DEFAULT 100,
    "maxTeachers" INTEGER DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "schools_schoolAdminId_fkey" FOREIGN KEY ("schoolAdminId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT,
    "grade" TEXT,
    "section" TEXT,
    "rollNumber" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "bloodGroup" TEXT,
    "parentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT,
    "employeeId" TEXT,
    "department" TEXT,
    "subjects" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "teachers_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT,
    "occupation" TEXT,
    "income" TEXT,
    "education" TEXT,
    "relationship" TEXT,
    "emergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "parents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assessmentType" TEXT NOT NULL,
    "data" TEXT,
    "score" REAL,
    "maxScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "assessments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "status" TEXT NOT NULL,
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "assessment_frameworks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "framework_subjects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "frameworkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "framework_subjects_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "assessment_frameworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subject_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "category" TEXT,
    "level" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subject_skills_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "framework_subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skill_assessment_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "assessmentTypeId" TEXT NOT NULL,
    "config" TEXT,
    "weightage" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "skill_assessment_types_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "subject_skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "skill_assessment_types_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "assessment_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessment_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "config" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "assessment_cycles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "subject_assessment_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "assessmentTypeId" TEXT NOT NULL,
    "config" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subject_assessment_types_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "framework_subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subject_assessment_types_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "assessment_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessment_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frameworkId" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "assessment_templates_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "assessment_frameworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assessment_templates_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "assessment_cycles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "fileSize" TEXT,
    "fileName" TEXT,
    "googleDriveId" TEXT,
    "errorMessage" TEXT,
    "userId" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "backup_configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scheduleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "schedulePattern" TEXT,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "includePrismaDb" BOOLEAN NOT NULL DEFAULT true,
    "includeUploads" BOOLEAN NOT NULL DEFAULT true,
    "includeConfig" BOOLEAN NOT NULL DEFAULT true,
    "googleDriveFolder" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastBackupAt" DATETIME,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "document_uploads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "uploaderId" TEXT NOT NULL,
    "uploaderType" TEXT NOT NULL,
    "studentId" TEXT,
    "schoolId" TEXT,
    "processedAt" DATETIME,
    "processedBy" TEXT,
    "processingNotes" TEXT,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "metadata" TEXT,
    "tags" TEXT,
    "confidentiality" TEXT NOT NULL DEFAULT 'standard',
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validationNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "document_uploads_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_uploads_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_uploads_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "upload_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionName" TEXT NOT NULL,
    "description" TEXT,
    "uploaderId" TEXT NOT NULL,
    "uploaderType" TEXT NOT NULL,
    "allowedTypes" TEXT,
    "maxFileSize" INTEGER,
    "maxFiles" INTEGER,
    "autoProcess" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT,
    "schoolId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "filesUploaded" INTEGER NOT NULL DEFAULT 0,
    "totalSize" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    CONSTRAINT "upload_sessions_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "upload_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "upload_sessions_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "academic_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "academic_analyses_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "academic_analyses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "behavioral_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "behavioral_analyses_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "behavioral_analyses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "career_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "recommendedCareers" TEXT NOT NULL,
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "career_analyses_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "career_analyses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "framework_detections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "detectedFramework" TEXT,
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "indicators" TEXT NOT NULL,
    "suggestedFrameworks" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "framework_detections_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "framework_detections_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "data_normalizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "originalData" TEXT NOT NULL,
    "normalizedData" TEXT NOT NULL,
    "mappings" TEXT NOT NULL,
    "warnings" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "data_normalizations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "data_normalizations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_repositories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "repositoryType" TEXT NOT NULL DEFAULT 'academic',
    "dataCategory" TEXT NOT NULL,
    "structuredData" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "student_repositories_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_repositories_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "edusight_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "documentId" TEXT,
    "academicScore" REAL NOT NULL DEFAULT 0.0,
    "psychologicalScore" REAL NOT NULL DEFAULT 0.0,
    "physicalScore" REAL NOT NULL DEFAULT 0.0,
    "overallScore" REAL NOT NULL DEFAULT 0.0,
    "framework" TEXT,
    "missingFrameworks" TEXT,
    "calculations" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "edusight_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "edusight_scores_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "score_aggregations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "aggregationType" TEXT NOT NULL DEFAULT 'comprehensive',
    "academicAggregation" TEXT NOT NULL,
    "behavioralAggregation" TEXT NOT NULL,
    "trendAnalysis" TEXT NOT NULL,
    "dataPoints" INTEGER NOT NULL DEFAULT 0,
    "confidence" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "score_aggregations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "score_aggregations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_uploads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MasterAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "predictions" TEXT NOT NULL,
    "trends" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "SchoolAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolId" TEXT NOT NULL,
    "avgAcademicScore" REAL NOT NULL,
    "avgSkillsScore" REAL NOT NULL,
    "avgPhysicalScore" REAL NOT NULL,
    "avgPsychologicalScore" REAL NOT NULL,
    "overallRating" REAL NOT NULL,
    "subjectPerformance" TEXT NOT NULL,
    "topSubjects" TEXT NOT NULL,
    "strugglingSubjects" TEXT NOT NULL,
    "skillsDistribution" TEXT NOT NULL,
    "emergingSkills" TEXT NOT NULL,
    "skillGaps" TEXT NOT NULL,
    "performanceTrend" TEXT NOT NULL,
    "riskStudents" INTEGER NOT NULL,
    "potentialToppers" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "gradeDistribution" TEXT NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SchoolAnalytics_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegionAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regionName" TEXT NOT NULL,
    "regionType" TEXT NOT NULL,
    "totalSchools" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "avgPerformance" REAL NOT NULL,
    "topFrameworks" TEXT NOT NULL,
    "subjectStrengths" TEXT NOT NULL,
    "skillTrends" TEXT NOT NULL,
    "rankingPosition" INTEGER,
    "performanceGrade" TEXT,
    "growthProjection" TEXT NOT NULL,
    "emergingTrends" TEXT NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubjectAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectName" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "avgScore" REAL NOT NULL,
    "passRate" REAL NOT NULL,
    "excellenceRate" REAL NOT NULL,
    "difficultyLevel" TEXT NOT NULL,
    "conceptualGaps" TEXT NOT NULL,
    "improvementAreas" TEXT NOT NULL,
    "relatedSkills" TEXT NOT NULL,
    "prerequisiteSkills" TEXT NOT NULL,
    "performanceTrend" TEXT NOT NULL,
    "popularityTrend" TEXT NOT NULL,
    "futureRelevance" REAL NOT NULL,
    "careerConnections" TEXT NOT NULL,
    "totalAssessments" INTEGER NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillName" TEXT NOT NULL,
    "skillCategory" TEXT NOT NULL,
    "avgLevel" REAL NOT NULL,
    "developmentRate" REAL NOT NULL,
    "subjectCorrelations" TEXT NOT NULL,
    "careerRelevance" TEXT NOT NULL,
    "ageGroupStrengths" TEXT NOT NULL,
    "genderDistribution" TEXT NOT NULL,
    "futureImportance" REAL NOT NULL,
    "developmentTrend" TEXT NOT NULL,
    "bestPractices" TEXT NOT NULL,
    "commonChallenges" TEXT NOT NULL,
    "totalAssessments" INTEGER NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DomainAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainName" TEXT NOT NULL,
    "avgPerformance" REAL NOT NULL,
    "studentInterest" REAL NOT NULL,
    "marketDemand" REAL NOT NULL,
    "coreSkills" TEXT NOT NULL,
    "emergingSkills" TEXT NOT NULL,
    "careerPaths" TEXT NOT NULL,
    "salaryProjections" TEXT NOT NULL,
    "growthOpportunities" TEXT NOT NULL,
    "recommendedSubjects" TEXT NOT NULL,
    "topInstitutions" TEXT NOT NULL,
    "industryTrends" TEXT NOT NULL,
    "skillGapAnalysis" TEXT NOT NULL,
    "futureOutlook" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MLModelMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelName" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "precision" REAL NOT NULL,
    "recall" REAL NOT NULL,
    "f1Score" REAL NOT NULL,
    "trainingDataSize" INTEGER NOT NULL,
    "lastTrainingDate" DATETIME NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "performance" TEXT NOT NULL,
    "hyperparameters" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DataProcessingJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "outputData" TEXT,
    "errorDetails" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "processingTime" INTEGER,
    "triggeredBy" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "userEmail" TEXT,
    "userRole" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" TEXT,
    "severity" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentId_key" ON "payments"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_frameworks_name_key" ON "assessment_frameworks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_frameworks_code_key" ON "assessment_frameworks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "framework_subjects_frameworkId_name_key" ON "framework_subjects"("frameworkId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "subject_skills_subjectId_name_key" ON "subject_skills"("subjectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_assessment_types_skillId_assessmentTypeId_key" ON "skill_assessment_types"("skillId", "assessmentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_types_name_key" ON "assessment_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_types_code_key" ON "assessment_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_cycles_name_key" ON "assessment_cycles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_cycles_code_key" ON "assessment_cycles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subject_assessment_types_subjectId_assessmentTypeId_key" ON "subject_assessment_types"("subjectId", "assessmentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "backup_configurations_name_key" ON "backup_configurations"("name");

-- CreateIndex
CREATE INDEX "MasterAnalytics_dataType_idx" ON "MasterAnalytics"("dataType");

-- CreateIndex
CREATE INDEX "MasterAnalytics_lastUpdated_idx" ON "MasterAnalytics"("lastUpdated");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAnalytics_dataType_entityId_key" ON "MasterAnalytics"("dataType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAnalytics_schoolId_key" ON "SchoolAnalytics"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionAnalytics_regionName_regionType_key" ON "RegionAnalytics"("regionName", "regionType");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectAnalytics_subjectName_framework_key" ON "SubjectAnalytics"("subjectName", "framework");

-- CreateIndex
CREATE UNIQUE INDEX "SkillAnalytics_skillName_key" ON "SkillAnalytics"("skillName");

-- CreateIndex
CREATE UNIQUE INDEX "DomainAnalytics_domainName_key" ON "DomainAnalytics"("domainName");

-- CreateIndex
CREATE INDEX "MLModelMetrics_modelName_idx" ON "MLModelMetrics"("modelName");

-- CreateIndex
CREATE INDEX "MLModelMetrics_isActive_idx" ON "MLModelMetrics"("isActive");

-- CreateIndex
CREATE INDEX "DataProcessingJob_status_idx" ON "DataProcessingJob"("status");

-- CreateIndex
CREATE INDEX "DataProcessingJob_jobType_idx" ON "DataProcessingJob"("jobType");

-- CreateIndex
CREATE INDEX "DataProcessingJob_priority_idx" ON "DataProcessingJob"("priority");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_userEmail_idx" ON "AuditLog"("userEmail");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_status_idx" ON "AuditLog"("status");

-- CreateIndex
CREATE INDEX "SecurityEvent_eventType_idx" ON "SecurityEvent"("eventType");

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_idx" ON "SecurityEvent"("userId");

-- CreateIndex
CREATE INDEX "SecurityEvent_userEmail_idx" ON "SecurityEvent"("userEmail");

-- CreateIndex
CREATE INDEX "SecurityEvent_severity_idx" ON "SecurityEvent"("severity");

-- CreateIndex
CREATE INDEX "SecurityEvent_timestamp_idx" ON "SecurityEvent"("timestamp");

-- CreateIndex
CREATE INDEX "SecurityEvent_ipAddress_idx" ON "SecurityEvent"("ipAddress");
