// Comprehensive Assessment Data Persistence Service
import { prisma } from './prisma';
import { calculateCareerMatches } from './career-mapping-data';

export interface AssessmentData {
  academic?: any;
  psychometric?: any;
  physical?: any;
  parentInsights?: any;
  skills?: Record<string, string>;
  interests?: string[];
  values?: string[];
}

export interface PersistenceResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class AssessmentPersistenceService {
  // Create or update assessment session
  static async createSession(data: {
    studentId?: string;
    parentId?: string;
    sessionType: string;
    studentName: string;
    studentAge: number;
    studentGrade?: string;
    ageGroup?: string;
  }): Promise<PersistenceResult> {
    try {
      const session = await prisma.assessmentSession.create({
        data: {
          studentId: data.studentId || null,
          parentId: data.parentId || null,
          sessionType: data.sessionType,
          studentName: data.studentName,
          studentAge: data.studentAge,
          studentGrade: data.studentGrade,
          ageGroup: data.ageGroup,
          status: 'IN_PROGRESS',
          currentStep: 'DATA_COLLECTION',
          progress: 0.0
        }
      });

      return { success: true, data: session };
    } catch (error) {
      console.error('Error creating assessment session:', error);
      return { success: false, error: 'Failed to create assessment session' };
    }
  }

  // Save questionnaire responses
  static async saveQuestionnaireResponse(data: {
    sessionId: string;
    questionnaireId: string;
    responses: any[];
    timeSpent?: number;
    status?: string;
  }): Promise<PersistenceResult> {
    try {
      // Get questionnaire details for scoring
      const questionnaire = await prisma.questionnaire.findUnique({
        where: { id: data.questionnaireId },
        include: {
          questions: {
            include: { options: true }
          }
        }
      });

      if (!questionnaire) {
        return { success: false, error: 'Questionnaire not found' };
      }

      // Calculate score
      const { score, interpretation } = this.calculateScore(data.responses, questionnaire);

      // Save response
      const response = await prisma.questionnaireResponse.upsert({
        where: {
          sessionId_questionnaireId: {
            sessionId: data.sessionId,
            questionnaireId: data.questionnaireId
          }
        },
        update: {
          status: data.status || 'COMPLETED',
          timeSpent: data.timeSpent,
          answeredQuestions: data.responses.length,
          score,
          interpretation,
          completedAt: data.status === 'COMPLETED' ? new Date() : null,
          responses: {
            deleteMany: {},
            create: data.responses.map((response: any) => ({
              questionId: response.questionId,
              optionId: response.optionId,
              value: response.value,
              textResponse: response.textResponse,
              timeSpent: response.timeSpent
            }))
          }
        },
        create: {
          sessionId: data.sessionId,
          questionnaireId: data.questionnaireId,
          status: data.status || 'COMPLETED',
          timeSpent: data.timeSpent,
          totalQuestions: questionnaire.questions.length,
          answeredQuestions: data.responses.length,
          score,
          interpretation,
          completedAt: data.status === 'COMPLETED' ? new Date() : null,
          responses: {
            create: data.responses.map((response: any) => ({
              questionId: response.questionId,
              optionId: response.optionId,
              value: response.value,
              textResponse: response.textResponse,
              timeSpent: response.timeSpent
            }))
          }
        }
      });

      // Update session progress
      await this.updateSessionProgress(data.sessionId);

      return { success: true, data: response };
    } catch (error) {
      console.error('Error saving questionnaire response:', error);
      return { success: false, error: 'Failed to save questionnaire response' };
    }
  }

  // Save assessment data
  static async saveAssessment(data: {
    sessionId: string;
    type: string;
    subtype?: string;
    assessmentData: any;
    results?: any;
    score?: number;
    interpretation?: string;
    recommendations?: any[];
  }): Promise<PersistenceResult> {
    try {
      const assessment = await prisma.assessment.upsert({
        where: {
          sessionId_type: {
            sessionId: data.sessionId,
            type: data.type
          }
        },
        update: {
          subtype: data.subtype,
          data: data.assessmentData,
          results: data.results,
          score: data.score,
          interpretation: data.interpretation,
          recommendations: data.recommendations,
          status: 'COMPLETED',
          completedAt: new Date()
        },
        create: {
          sessionId: data.sessionId,
          type: data.type,
          subtype: data.subtype,
          data: data.assessmentData,
          results: data.results,
          score: data.score,
          interpretation: data.interpretation,
          recommendations: data.recommendations,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      // Update session data collection status
      await this.updateDataCollectionStatus(data.sessionId, data.type, true);

      return { success: true, data: assessment };
    } catch (error) {
      console.error('Error saving assessment:', error);
      return { success: false, error: 'Failed to save assessment' };
    }
  }

  // Save AI insights
  static async saveAIInsights(data: {
    sessionId: string;
    insights: any[];
  }): Promise<PersistenceResult> {
    try {
      const createdInsights = await Promise.all(
        data.insights.map(async (insight: any) => {
          return await prisma.aIInsight.create({
            data: {
              sessionId: data.sessionId,
              domain: insight.domain,
              insight: insight.insight,
              confidence: insight.confidence,
              recommendations: insight.recommendations,
              priority: insight.priority,
              source: insight.source,
              prompt: insight.prompt,
              response: insight.response
            }
          });
        })
      );

      return { success: true, data: createdInsights };
    } catch (error) {
      console.error('Error saving AI insights:', error);
      return { success: false, error: 'Failed to save AI insights' };
    }
  }

  // Save career mappings
  static async saveCareerMappings(data: {
    sessionId: string;
    assessmentData: AssessmentData;
  }): Promise<PersistenceResult> {
    try {
      // Convert assessment data to personality profile
      const personalityProfile = {
        bigFive: {
          openness: data.assessmentData.psychometric?.bigFive?.openness || 0.5,
          conscientiousness: data.assessmentData.psychometric?.bigFive?.conscientiousness || 0.5,
          extraversion: data.assessmentData.psychometric?.bigFive?.extraversion || 0.5,
          agreeableness: data.assessmentData.psychometric?.bigFive?.agreeableness || 0.5,
          neuroticism: data.assessmentData.psychometric?.bigFive?.neuroticism || 0.5
        },
        mbti: data.assessmentData.psychometric?.mbti,
        skills: data.assessmentData.skills || {},
        interests: data.assessmentData.interests || [],
        values: data.assessmentData.values || [],
        academicPerformance: data.assessmentData.academic || {}
      };

      // Calculate career matches
      const careerMatches = calculateCareerMatches(personalityProfile);

      // Save career mappings
      const createdMappings = await Promise.all(
        careerMatches.slice(0, 10).map(async (match: any) => {
          // Get or create career field
          let careerField = await prisma.careerField.findFirst({
            where: { name: match.jobTitle }
          });

          if (!careerField) {
            careerField = await prisma.careerField.create({
              data: {
                name: match.jobTitle,
                description: `Career field for ${match.jobTitle}`,
                category: 'GENERAL',
                growthRate: 5.0,
                educationLevel: 'BACHELORS',
                skills: match.strengths || [],
                personalityTraits: [],
                workEnvironment: []
              }
            });
          }

          return await prisma.careerMapping.create({
            data: {
              sessionId: data.sessionId,
              careerFieldId: careerField.id,
              matchScore: match.matchScore,
              confidence: match.confidence,
              reasoning: match.reasoning,
              strengths: match.strengths,
              gaps: match.gaps,
              recommendations: match.recommendations,
              timeline: match.timeline,
              priority: match.priority,
              isRecommended: match.priority === 'HIGH'
            }
          });
        })
      );

      return { success: true, data: createdMappings };
    } catch (error) {
      console.error('Error saving career mappings:', error);
      return { success: false, error: 'Failed to save career mappings' };
    }
  }

  // Save comprehensive report
  static async saveReport(data: {
    sessionId: string;
    reportType: string;
    content: any;
    summary?: string;
    recommendations?: any[];
    insights?: any[];
    metadata?: any;
  }): Promise<PersistenceResult> {
    try {
      const report = await prisma.assessmentReport.create({
        data: {
          sessionId: data.sessionId,
          reportType: data.reportType,
          content: data.content,
          summary: data.summary,
          recommendations: data.recommendations,
          insights: data.insights,
          metadata: data.metadata,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      return { success: true, data: report };
    } catch (error) {
      console.error('Error saving report:', error);
      return { success: false, error: 'Failed to save report' };
    }
  }

  // Get complete assessment data
  static async getCompleteAssessment(sessionId: string): Promise<PersistenceResult> {
    try {
      const session = await prisma.assessmentSession.findUnique({
        where: { id: sessionId },
        include: {
          questionnaires: {
            include: {
              questionnaire: true,
              responses: {
                include: {
                  question: true,
                  option: true
                }
              }
            }
          },
          assessments: true,
          aiInsights: true,
          careerMappings: {
            include: {
              careerField: true,
              careerPath: true
            }
          },
          finalReport: true
        }
      });

      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      return { success: true, data: session };
    } catch (error) {
      console.error('Error fetching complete assessment:', error);
      return { success: false, error: 'Failed to fetch assessment data' };
    }
  }

  // Helper methods
  private static calculateScore(responses: any[], questionnaire: any): { score: number; interpretation: string } {
    let totalScore = 0;
    let maxScore = 0;
    let answeredQuestions = 0;

    responses.forEach((response) => {
      if (response.value !== null && response.value !== undefined) {
        totalScore += response.value;
        answeredQuestions++;
      }
    });

    // Calculate max possible score
    questionnaire.questions.forEach((question: any) => {
      const maxOptionValue = Math.max(...question.options.map((opt: any) => opt.value));
      maxScore += maxOptionValue;
    });

    const score = answeredQuestions > 0 ? (totalScore / maxScore) * 100 : 0;

    // Generate interpretation
    let interpretation = '';
    if (score >= 80) {
      interpretation = 'Excellent performance with strong alignment to assessment criteria';
    } else if (score >= 60) {
      interpretation = 'Good performance with moderate alignment to assessment criteria';
    } else if (score >= 40) {
      interpretation = 'Average performance with some areas for improvement';
    } else {
      interpretation = 'Below average performance with significant areas for development';
    }

    return { score, interpretation };
  }

  private static async updateSessionProgress(sessionId: string): Promise<void> {
    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        questionnaires: true,
        assessments: true
      }
    });

    if (!session) return;

    // Calculate progress based on completed components
    const totalComponents = 4;
    let completedComponents = 0;

    if (session.academicDataCollected) completedComponents++;
    if (session.psychometricDataCollected) completedComponents++;
    if (session.physicalDataCollected) completedComponents++;
    if (session.parentInsightsCollected) completedComponents++;

    const progress = completedComponents / totalComponents;

    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        progress,
        lastActivityAt: new Date(),
        status: progress === 1 ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: progress === 1 ? new Date() : null
      }
    });
  }

  private static async updateDataCollectionStatus(sessionId: string, type: string, isCompleted: boolean): Promise<void> {
    const updateData: any = {};

    switch (type) {
      case 'ACADEMIC':
        updateData.academicDataCollected = isCompleted;
        break;
      case 'PSYCHOMETRIC':
        updateData.psychometricDataCollected = isCompleted;
        break;
      case 'PHYSICAL':
        updateData.physicalDataCollected = isCompleted;
        break;
      case 'PARENT_INSIGHTS':
        updateData.parentInsightsCollected = isCompleted;
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.assessmentSession.update({
        where: { id: sessionId },
        data: updateData
      });
    }
  }
}

// Export utility functions
export const saveAssessmentData = AssessmentPersistenceService.saveAssessment;
export const saveQuestionnaireData = AssessmentPersistenceService.saveQuestionnaireResponse;
export const saveAIInsights = AssessmentPersistenceService.saveAIInsights;
export const saveCareerMappings = AssessmentPersistenceService.saveCareerMappings;
export const saveReport = AssessmentPersistenceService.saveReport;
export const getCompleteAssessment = AssessmentPersistenceService.getCompleteAssessment;
