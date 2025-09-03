import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();
    const studentId = params.id;

    // Get comprehensive student data for visualization
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true } },
        repositories: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        eduSightScores: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        scoreAggregations: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        academicAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        behavioralAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        careerAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Generate various visualization data
    const visualizations = {
      academicPerformance: generateAcademicVisualization(student),
      behavioralTrends: generateBehavioralVisualization(student),
      careerGuidance: generateCareerVisualization(student),
      eduSightScoreHistory: generateEduSightScoreVisualization(student),
      subjectRadar: generateSubjectRadarChart(student),
      progressTimeline: generateProgressTimeline(student),
      recommendations: generateRecommendationChart(student),
      summary: generateSummaryDashboard(student)
    };

    return NextResponse.json({
      success: true,
      visualizations,
      metadata: {
        studentName: student.user.name,
        generatedAt: new Date().toISOString(),
        dataPoints: calculateTotalDataPoints(student),
        confidence: calculateOverallConfidence(student)
      },
      message: 'Visualizations generated successfully'
    });

  } catch (error) {
    console.error('Visualization generation error:', error);
    return NextResponse.json({
      error: 'Visualization generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateAcademicVisualization(student: any): any {
  const visualization = {
    type: 'academic_performance',
    charts: {
      subjectScores: {
        type: 'bar',
        data: [] as any[],
        title: 'Subject Performance',
        xAxis: 'Subjects',
        yAxis: 'Normalized Score (0-100)'
      },
      gradeDistribution: {
        type: 'pie',
        data: [] as any[],
        title: 'Grade Distribution'
      },
      performanceTrend: {
        type: 'line',
        data: [] as any[],
        title: 'Academic Performance Over Time',
        xAxis: 'Time Period',
        yAxis: 'Average Score'
      }
    }
  };

  // Process academic repositories for current scores
  const academicRepos = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'academic' && repo.dataCategory === 'grades_and_performance'
  );

  if (academicRepos.length > 0) {
    try {
      const latestRepo = academicRepos[0];
      const repoData = JSON.parse(latestRepo.structuredData);
      
      if (repoData.grades) {
        // Subject scores bar chart
        visualization.charts.subjectScores.data = repoData.grades.map((grade: any) => ({
          subject: grade.subject || grade.normalizedSubject,
          score: normalizeGradeToScore(grade.grade),
          grade: grade.grade,
          color: getScoreColor(normalizeGradeToScore(grade.grade))
        }));

        // Grade distribution pie chart
        const gradeRanges = {
          'Excellent (90-100)': 0,
          'Good (80-89)': 0,
          'Satisfactory (70-79)': 0,
          'Needs Improvement (60-69)': 0,
          'Below Average (<60)': 0
        };

        repoData.grades.forEach((grade: any) => {
          const score = normalizeGradeToScore(grade.grade);
          if (score >= 90) gradeRanges['Excellent (90-100)']++;
          else if (score >= 80) gradeRanges['Good (80-89)']++;
          else if (score >= 70) gradeRanges['Satisfactory (70-79)']++;
          else if (score >= 60) gradeRanges['Needs Improvement (60-69)']++;
          else gradeRanges['Below Average (<60)']++;
        });

        visualization.charts.gradeDistribution.data = Object.entries(gradeRanges)
          .filter(([, count]) => count > 0)
          .map(([range, count]) => ({
            category: range,
            count,
            percentage: Math.round((count / repoData.grades.length) * 100)
          }));
      }
    } catch (error) {
      console.error('Error processing academic repository:', error);
    }
  }

  // Performance trend from multiple repositories
  if (academicRepos.length > 1) {
    const trendData = academicRepos.reverse().map((repo: any) => {
      try {
        const repoData = JSON.parse(repo.structuredData);
        if (repoData.grades) {
          const scores = repoData.grades.map((g: any) => normalizeGradeToScore(g.grade)).filter((s: number) => !isNaN(s));
          const average = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
          return {
            date: new Date(repo.createdAt).toLocaleDateString(),
            score: Math.round(average * 10) / 10,
            dataPoints: scores.length
          };
        }
      } catch (error) {
        return null;
      }
    }).filter(Boolean);

    visualization.charts.performanceTrend.data = trendData;
  }

  return visualization;
}

function generateBehavioralVisualization(student: any): any {
  const visualization = {
    type: 'behavioral_analysis',
    charts: {
      riskLevelHistory: {
        type: 'line',
        data: [] as any[],
        title: 'Behavioral Risk Level Over Time',
        xAxis: 'Assessment Date',
        yAxis: 'Risk Level'
      },
      indicatorFrequency: {
        type: 'bar',
        data: [] as any[],
        title: 'Behavioral Indicators Frequency',
        xAxis: 'Indicators',
        yAxis: 'Frequency'
      },
      interventionProgress: {
        type: 'gauge',
        data: {} as any,
        title: 'Intervention Effectiveness'
      }
    }
  };

  // Risk level history
  if (student.behavioralAnalyses.length > 0) {
    const riskLevelMapping = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
    
    visualization.charts.riskLevelHistory.data = student.behavioralAnalyses.reverse().map((analysis: any) => ({
      date: new Date(analysis.createdAt).toLocaleDateString(),
      riskLevel: analysis.riskLevel,
      riskValue: riskLevelMapping[analysis.riskLevel as keyof typeof riskLevelMapping] || 1,
      confidence: analysis.confidence
    }));

    // Indicator frequency analysis
    const allIndicators: string[] = [];
    student.behavioralAnalyses.forEach((analysis: any) => {
      try {
        const results = JSON.parse(analysis.results);
        if (results.indicators) {
          allIndicators.push(...results.indicators);
        }
      } catch (error) {
        console.error('Error parsing behavioral analysis:', error);
      }
    });

    const indicatorCounts = allIndicators.reduce((acc: any, indicator: string) => {
      acc[indicator] = (acc[indicator] || 0) + 1;
      return acc;
    }, {});

    visualization.charts.indicatorFrequency.data = Object.entries(indicatorCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([indicator, count]) => ({
        indicator: indicator.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        category: categorizeIndicator(indicator)
      }));

    // Intervention progress gauge
    const latestRiskLevel = student.behavioralAnalyses[0].riskLevel;
    const interventionScore = calculateInterventionScore(student.behavioralAnalyses);
    
    visualization.charts.interventionProgress.data = {
      currentRiskLevel: latestRiskLevel,
      interventionScore,
      recommendation: getInterventionRecommendation(latestRiskLevel, interventionScore)
    };
  }

  return visualization;
}

function generateCareerVisualization(student: any): any {
  const visualization = {
    type: 'career_guidance',
    charts: {
      careerRecommendations: {
        type: 'horizontal_bar',
        data: [] as any[],
        title: 'Top Career Recommendations',
        xAxis: 'Compatibility Score',
        yAxis: 'Career Paths'
      },
      skillsRadar: {
        type: 'radar',
        data: {} as any,
        title: 'Skills Profile Assessment'
      },
      interestDistribution: {
        type: 'doughnut',
        data: [] as any[],
        title: 'Interest Areas Distribution'
      }
    }
  };

  if (student.careerAnalyses.length > 0) {
    try {
      const careerAnalysis = JSON.parse(student.careerAnalyses[0].results);
      
      // Career recommendations
      if (careerAnalysis.recommendations) {
        visualization.charts.careerRecommendations.data = careerAnalysis.recommendations
          .slice(0, 8)
          .map((career: any, index: number) => ({
            career: career.name || career.title,
            compatibility: career.score || (90 - index * 5), // Fallback scoring
            description: career.description || '',
            category: career.category || 'General'
          }));
      }

      // Skills radar chart
      if (careerAnalysis.skillsProfile) {
        visualization.charts.skillsRadar.data = {
          skills: Object.entries(careerAnalysis.skillsProfile).map(([skill, score]) => ({
            skill: skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: Math.round((score as number) * 10) / 10,
            maxScore: 100
          })),
          averageScore: Object.values(careerAnalysis.skillsProfile).reduce((a: number, b: number) => a + b, 0) / Object.keys(careerAnalysis.skillsProfile).length
        };
      }

      // Interest distribution
      if (careerAnalysis.interests) {
        const interestCategories = categorizeInterests(careerAnalysis.interests);
        visualization.charts.interestDistribution.data = Object.entries(interestCategories).map(([category, count]) => ({
          category: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count,
          percentage: Math.round((count as number / careerAnalysis.interests.length) * 100)
        }));
      }
    } catch (error) {
      console.error('Error processing career analysis:', error);
    }
  }

  return visualization;
}

function generateEduSightScoreVisualization(student: any): any {
  const visualization = {
    type: 'edusight_360_score',
    charts: {
      currentScoreBreakdown: {
        type: 'stacked_bar',
        data: {} as any,
        title: 'Current EduSight 360° Score Breakdown'
      },
      scoreHistory: {
        type: 'multi_line',
        data: [] as any[],
        title: 'EduSight Score Progression',
        xAxis: 'Assessment Date',
        yAxis: 'Score (0-100)'
      },
      domainComparison: {
        type: 'radar',
        data: {} as any,
        title: 'Domain Performance Comparison'
      }
    }
  };

  if (student.eduSightScores.length > 0) {
    const latestScore = student.eduSightScores[0];
    
    // Current score breakdown
    visualization.charts.currentScoreBreakdown.data = {
      academic: latestScore.academicScore,
      psychological: latestScore.psychologicalScore,
      physical: latestScore.physicalScore,
      overall: latestScore.overallScore,
      framework: latestScore.framework
    };

    // Score history
    visualization.charts.scoreHistory.data = student.eduSightScores.reverse().map((score: any) => ({
      date: new Date(score.createdAt).toLocaleDateString(),
      academic: score.academicScore,
      psychological: score.psychologicalScore,
      physical: score.physicalScore,
      overall: score.overallScore
    }));

    // Domain comparison radar
    visualization.charts.domainComparison.data = {
      domains: [
        { domain: 'Academic', score: latestScore.academicScore, maxScore: 100 },
        { domain: 'Psychological', score: latestScore.psychologicalScore, maxScore: 100 },
        { domain: 'Physical', score: latestScore.physicalScore, maxScore: 100 }
      ],
      averageScore: (latestScore.academicScore + latestScore.psychologicalScore + latestScore.physicalScore) / 3
    };
  }

  return visualization;
}

function generateSubjectRadarChart(student: any): any {
  const chart = {
    type: 'radar',
    title: 'Subject Performance Radar',
    data: {
      subjects: [] as any[],
      averageScore: 0
    }
  };

  const academicRepos = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'academic' && repo.dataCategory === 'grades_and_performance'
  );

  if (academicRepos.length > 0) {
    try {
      const latestRepo = academicRepos[0];
      const repoData = JSON.parse(latestRepo.structuredData);
      
      if (repoData.grades) {
        const subjects = repoData.grades.map((grade: any) => ({
          subject: grade.subject || grade.normalizedSubject,
          score: normalizeGradeToScore(grade.grade),
          maxScore: 100
        }));

        chart.data.subjects = subjects;
        chart.data.averageScore = subjects.reduce((acc: number, subj: any) => acc + subj.score, 0) / subjects.length;
      }
    } catch (error) {
      console.error('Error processing subject radar data:', error);
    }
  }

  return chart;
}

function generateProgressTimeline(student: any): any {
  const timeline = {
    type: 'timeline',
    title: 'Student Progress Timeline',
    data: [] as any[]
  };

  // Collect all significant events
  const events: any[] = [];

  // Academic milestones
  student.academicAnalyses.forEach((analysis: any) => {
    events.push({
      date: analysis.createdAt,
      type: 'academic',
      title: 'Academic Assessment',
      description: `Academic analysis completed with ${Math.round(analysis.confidence * 100)}% confidence`,
      icon: 'academic'
    });
  });

  // Behavioral milestones
  student.behavioralAnalyses.forEach((analysis: any) => {
    events.push({
      date: analysis.createdAt,
      type: 'behavioral',
      title: `Behavioral Risk: ${analysis.riskLevel}`,
      description: `Behavioral assessment indicating ${analysis.riskLevel} risk level`,
      icon: 'behavioral'
    });
  });

  // EduSight score milestones
  student.eduSightScores.forEach((score: any) => {
    events.push({
      date: score.createdAt,
      type: 'score',
      title: `EduSight Score: ${score.overallScore}`,
      description: `360° assessment with overall score of ${score.overallScore}/100`,
      icon: 'score'
    });
  });

  // Sort events by date (newest first)
  timeline.data = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return timeline;
}

function generateRecommendationChart(student: any): any {
  const chart = {
    type: 'priority_matrix',
    title: 'Action Recommendations Matrix',
    data: {
      highPriority: [] as string[],
      mediumPriority: [] as string[],
      lowPriority: [] as string[],
      monitoring: [] as string[]
    }
  };

  // Collect recommendations from latest analyses
  if (student.eduSightScores.length > 0) {
    try {
      const recommendations = JSON.parse(student.eduSightScores[0].recommendations);
      
      recommendations.forEach((rec: string) => {
        if (rec.toLowerCase().includes('urgent') || rec.toLowerCase().includes('immediate')) {
          chart.data.highPriority.push(rec);
        } else if (rec.toLowerCase().includes('consider') || rec.toLowerCase().includes('recommended')) {
          chart.data.mediumPriority.push(rec);
        } else if (rec.toLowerCase().includes('maintain') || rec.toLowerCase().includes('continue')) {
          chart.data.monitoring.push(rec);
        } else {
          chart.data.lowPriority.push(rec);
        }
      });
    } catch (error) {
      console.error('Error processing recommendations:', error);
    }
  }

  return chart;
}

function generateSummaryDashboard(student: any): any {
  const summary = {
    type: 'dashboard_summary',
    title: 'Student Overview Dashboard',
    metrics: {
      overallHealth: 'Good', // Default
      totalAssessments: 0,
      lastUpdated: null as string | null,
      riskLevel: 'low',
      academicTrend: 'stable',
      confidence: 0
    },
    keyInsights: [] as string[],
    quickActions: [] as string[]
  };

  // Calculate metrics
  summary.metrics.totalAssessments = 
    student.academicAnalyses.length + 
    student.behavioralAnalyses.length + 
    student.careerAnalyses.length;

  if (student.eduSightScores.length > 0) {
    const latestScore = student.eduSightScores[0];
    summary.metrics.lastUpdated = new Date(latestScore.createdAt).toLocaleDateString();
    
    if (latestScore.overallScore >= 80) {
      summary.metrics.overallHealth = 'Excellent';
    } else if (latestScore.overallScore >= 70) {
      summary.metrics.overallHealth = 'Good';
    } else if (latestScore.overallScore >= 60) {
      summary.metrics.overallHealth = 'Fair';
    } else {
      summary.metrics.overallHealth = 'Needs Attention';
    }
  }

  if (student.behavioralAnalyses.length > 0) {
    summary.metrics.riskLevel = student.behavioralAnalyses[0].riskLevel;
  }

  // Generate key insights
  if (student.scoreAggregations.length > 0) {
    try {
      const aggregation = JSON.parse(student.scoreAggregations[0].trendAnalysis);
      summary.metrics.academicTrend = aggregation.academicTrend || 'stable';
      
      if (aggregation.milestones) {
        summary.keyInsights.push(...aggregation.milestones.slice(0, 3));
      }
    } catch (error) {
      console.error('Error processing trend analysis:', error);
    }
  }

  // Generate quick actions
  if (summary.metrics.overallHealth === 'Needs Attention') {
    summary.quickActions.push('Schedule comprehensive review');
  }
  if (summary.metrics.riskLevel === 'high' || summary.metrics.riskLevel === 'critical') {
    summary.quickActions.push('Implement behavioral intervention');
  }
  if (summary.metrics.academicTrend === 'declining') {
    summary.quickActions.push('Arrange academic support');
  }

  return summary;
}

// Helper functions
function normalizeGradeToScore(grade: string): number {
  const gradeStr = grade.trim();

  if (/^[A-F][+-]?$/i.test(gradeStr)) {
    const letterGrades: { [key: string]: number } = {
      'A+': 97, 'A': 94, 'A-': 90,
      'B+': 87, 'B': 84, 'B-': 80,
      'C+': 77, 'C': 74, 'C-': 70,
      'D+': 67, 'D': 64, 'D-': 60,
      'F': 50
    };
    return letterGrades[gradeStr.toUpperCase()] || 0;
  }

  if (/^\d{1,3}(\.\d+)?%?$/.test(gradeStr)) {
    const numMatch = gradeStr.match(/(\d{1,3}(?:\.\d+)?)/);
    if (numMatch) {
      return Math.min(100, parseFloat(numMatch[1]));
    }
  }

  return 0;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#10B981'; // Green
  if (score >= 80) return '#3B82F6'; // Blue
  if (score >= 70) return '#F59E0B'; // Amber
  if (score >= 60) return '#EF4444'; // Red
  return '#6B7280'; // Gray
}

function categorizeIndicator(indicator: string): string {
  if (indicator.includes('positive') || indicator.includes('cooperative')) return 'positive';
  if (indicator.includes('concern') || indicator.includes('difficulty')) return 'concern';
  if (indicator.includes('social')) return 'social';
  if (indicator.includes('academic')) return 'academic';
  return 'general';
}

function calculateInterventionScore(analyses: any[]): number {
  if (analyses.length < 2) return 50; // Default baseline
  
  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const latest = riskLevels.indexOf(analyses[0].riskLevel);
  const previous = riskLevels.indexOf(analyses[1].riskLevel);
  
  if (latest < previous) return 75; // Improved
  if (latest > previous) return 25; // Deteriorated
  return 50; // Stable
}

function getInterventionRecommendation(riskLevel: string, score: number): string {
  if (riskLevel === 'critical') return 'Immediate intervention required';
  if (riskLevel === 'high') return 'Comprehensive support needed';
  if (riskLevel === 'medium') return 'Regular monitoring advised';
  if (score > 60) return 'Continue current support';
  return 'Baseline monitoring';
}

function categorizeInterests(interests: string[]): any {
  const categories: any = {
    stem: 0,
    arts_humanities: 0,
    social_sciences: 0,
    business: 0,
    health_sciences: 0,
    other: 0
  };

  interests.forEach(interest => {
    const lower = interest.toLowerCase();
    if (lower.includes('science') || lower.includes('math') || lower.includes('technology')) {
      categories.stem++;
    } else if (lower.includes('art') || lower.includes('literature') || lower.includes('creative')) {
      categories.arts_humanities++;
    } else if (lower.includes('social') || lower.includes('psychology') || lower.includes('history')) {
      categories.social_sciences++;
    } else if (lower.includes('business') || lower.includes('management') || lower.includes('finance')) {
      categories.business++;
    } else if (lower.includes('health') || lower.includes('medical') || lower.includes('biology')) {
      categories.health_sciences++;
    } else {
      categories.other++;
    }
  });

  return categories;
}

function calculateTotalDataPoints(student: any): number {
  return student.repositories.length + 
         student.academicAnalyses.length + 
         student.behavioralAnalyses.length + 
         student.careerAnalyses.length +
         student.eduSightScores.length;
}

function calculateOverallConfidence(student: any): number {
  const analyses = [
    ...student.academicAnalyses,
    ...student.behavioralAnalyses,
    ...student.careerAnalyses
  ];

  if (analyses.length === 0) return 0.3;

  const avgConfidence = analyses.reduce((acc: number, analysis: any) => acc + (analysis.confidence || 0.5), 0) / analyses.length;
  return Math.round(avgConfidence * 100) / 100;
}
