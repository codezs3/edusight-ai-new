import jsPDF from 'jspdf';

interface AssessmentData {
  student: {
    name: string;
    grade: string;
    school?: string;
    dateOfBirth?: string;
  };
  scores: {
    academic: number;
    physical: number;
    psychological: number;
    total: number;
  };
  breakdown: {
    academic: {
      mathematics: number;
      science: number;
      english: number;
      socialStudies: number;
    };
    physical: {
      fitness: number;
      health: number;
      growth: number;
    };
    psychological: {
      emotional: number;
      social: number;
      behavioral: number;
    };
  };
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  generatedDate: Date;
  assessmentId: string;
}

export class BrandedPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  async generateAssessmentReport(data: AssessmentData): Promise<Blob> {
    // Header with EduSight branding
    this.addHeader();
    
    // Student information
    this.addStudentInfo(data.student);
    
    // Assessment overview
    this.addAssessmentOverview(data.scores);
    
    // Detailed breakdown
    this.addDetailedBreakdown(data.breakdown);
    
    // 360° Score visualization
    this.add360ScoreVisualization(data.scores);
    
    // Recommendations and insights
    this.addRecommendationsSection(data);
    
    // Footer with watermark and security
    this.addFooter(data);
    
    // Convert to blob
    const pdfBlob = this.doc.output('blob');
    return pdfBlob;
  }

  private addHeader(): void {
    // EduSight Logo and Branding
    this.doc.setFillColor(37, 99, 235); // Blue background
    this.doc.rect(0, 0, this.pageWidth, 30, 'F');
    
    // Logo text (in a real implementation, you would use an actual logo image)
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EduSight', this.margin, 20);
    
    // Tagline
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('360° Educational Assessment Platform', this.margin, 25);
    
    // Report title
    this.doc.setTextColor(37, 99, 235);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.currentY = 45;
    this.doc.text('Comprehensive Assessment Report', this.margin, this.currentY);
    
    this.currentY += 15;
  }

  private addStudentInfo(student: any): void {
    // Student Information Box
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 'FD');
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Student Information', this.margin + 5, this.currentY + 8);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const infoStartY = this.currentY + 15;
    this.doc.text(`Name: ${student.name}`, this.margin + 5, infoStartY);
    this.doc.text(`Grade: ${student.grade}`, this.margin + 80, infoStartY);
    
    if (student.school) {
      this.doc.text(`School: ${student.school}`, this.margin + 5, infoStartY + 5);
    }
    
    if (student.dateOfBirth) {
      this.doc.text(`Date of Birth: ${new Date(student.dateOfBirth).toLocaleDateString()}`, this.margin + 80, infoStartY + 5);
    }
    
    this.currentY += 35;
  }

  private addAssessmentOverview(scores: any): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235);
    this.doc.text('Assessment Overview', this.margin, this.currentY);
    
    this.currentY += 10;
    
    // EduSight 360° Score - Large display
    this.doc.setFillColor(37, 99, 235);
    this.doc.circle(this.pageWidth / 2, this.currentY + 25, 20, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(scores.total.toString(), this.pageWidth / 2 - 8, this.currentY + 25);
    
    this.doc.setFontSize(10);
    this.doc.text('EduSight 360°', this.pageWidth / 2 - 15, this.currentY + 32);
    this.doc.text('Score', this.pageWidth / 2 - 8, this.currentY + 37);
    
    // Category scores
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    
    const scoresStartY = this.currentY + 55;
    const scoreBoxWidth = 50;
    const scoreBoxHeight = 20;
    
    // Academic Score
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(this.margin, scoresStartY, scoreBoxWidth, scoreBoxHeight, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Academic', this.margin + 5, scoresStartY + 8);
    this.doc.text(scores.academic.toString(), this.margin + 5, scoresStartY + 15);
    
    // Physical Score
    this.doc.setFillColor(16, 185, 129);
    this.doc.rect(this.margin + 60, scoresStartY, scoreBoxWidth, scoreBoxHeight, 'F');
    this.doc.text('Physical', this.margin + 65, scoresStartY + 8);
    this.doc.text(scores.physical.toString(), this.margin + 65, scoresStartY + 15);
    
    // Psychological Score
    this.doc.setFillColor(139, 92, 246);
    this.doc.rect(this.margin + 120, scoresStartY, scoreBoxWidth, scoreBoxHeight, 'F');
    this.doc.text('Psychological', this.margin + 125, scoresStartY + 8);
    this.doc.text(scores.psychological.toString(), this.margin + 125, scoresStartY + 15);
    
    this.currentY += 85;
  }

  private addDetailedBreakdown(breakdown: any): void {
    this.checkPageBreak(60);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235);
    this.doc.text('Detailed Performance Breakdown', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Academic Breakdown
    this.addCategoryBreakdown('Academic Performance', breakdown.academic, {r: 59, g: 130, b: 246});
    
    // Physical Breakdown
    this.addCategoryBreakdown('Physical Health', breakdown.physical, {r: 16, g: 185, b: 129});
    
    // Psychological Breakdown
    this.addCategoryBreakdown('Psychological Profile', breakdown.psychological, {r: 139, g: 92, b: 246});
  }

  private addCategoryBreakdown(title: string, data: any, color: {r: number, g: number, b: number}): void {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(color.r, color.g, color.b);
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 8;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      
      // Progress bar
      const barWidth = 80;
      const barHeight = 4;
      
      this.doc.text(`${label}:`, this.margin + 5, this.currentY);
      this.doc.text(`${value}%`, this.margin + 120, this.currentY);
      
      // Background bar
      this.doc.setFillColor(230, 230, 230);
      this.doc.rect(this.margin + 35, this.currentY - 3, barWidth, barHeight, 'F');
      
      // Progress bar
      this.doc.setFillColor(color.r, color.g, color.b);
      this.doc.rect(this.margin + 35, this.currentY - 3, (barWidth * value) / 100, barHeight, 'F');
      
      this.currentY += 7;
    });
    
    this.currentY += 5;
  }

  private add360ScoreVisualization(scores: any): void {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235);
    this.doc.text('360° Score Analysis', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Score interpretation
    const getScoreInterpretation = (score: number) => {
      if (score >= 90) return { label: 'Exceptional', color: {r: 34, g: 197, b: 94} };
      if (score >= 80) return { label: 'Excellent', color: {r: 59, g: 130, b: 246} };
      if (score >= 70) return { label: 'Good', color: {r: 245, g: 158, b: 11} };
      if (score >= 60) return { label: 'Developing', color: {r: 251, g: 146, b: 60} };
      return { label: 'Needs Support', color: {r: 239, g: 68, b: 68} };
    };
    
    const interpretation = getScoreInterpretation(scores.total);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(interpretation.color.r, interpretation.color.g, interpretation.color.b);
    this.doc.text(`Overall Performance: ${interpretation.label}`, this.margin, this.currentY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`Your child's EduSight 360° Score of ${scores.total} indicates ${interpretation.label.toLowerCase()} performance`, this.margin, this.currentY + 8);
    this.doc.text('across academic, physical, and psychological dimensions.', this.margin, this.currentY + 15);
    
    this.currentY += 25;
  }

  private addRecommendationsSection(data: AssessmentData): void {
    this.checkPageBreak(60);
    
    // Strengths
    this.addBulletSection('Key Strengths', data.strengths, {r: 34, g: 197, b: 94});
    
    // Recommendations
    this.addBulletSection('Recommendations for Growth', data.recommendations, {r: 59, g: 130, b: 246});
    
    // Areas for improvement
    this.addBulletSection('Areas for Focused Attention', data.areasForImprovement, {r: 245, g: 158, b: 11});
  }

  private addBulletSection(title: string, items: string[], color: {r: number, g: number, b: number}): void {
    this.checkPageBreak(items.length * 6 + 15);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(color.r, color.g, color.b);
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 10;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    items.forEach(item => {
      this.doc.text('•', this.margin + 5, this.currentY);
      
      // Wrap text if too long
      const lines = this.doc.splitTextToSize(item, this.pageWidth - 2 * this.margin - 10);
      lines.forEach((line: string, index: number) => {
        this.doc.text(line, this.margin + 10, this.currentY + (index * 5));
      });
      
      this.currentY += Math.max(5, lines.length * 5);
    });
    
    this.currentY += 5;
  }

  private addFooter(data: AssessmentData): void {
    // Go to bottom of page
    this.currentY = this.pageHeight - 40;
    
    // Report metadata
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    
    this.doc.text(`Report ID: ${data.assessmentId}`, this.margin, this.currentY);
    this.doc.text(`Generated: ${data.generatedDate.toLocaleDateString()}`, this.margin, this.currentY + 5);
    this.doc.text(`Generated: ${data.generatedDate.toLocaleTimeString()}`, this.margin, this.currentY + 10);
    
    // EduSight watermark and branding
    this.doc.setFontSize(10);
    this.doc.setTextColor(37, 99, 235);
    this.doc.text('Powered by EduSight - 360° Educational Assessment Platform', this.margin, this.currentY + 20);
    
    // Security and authenticity notice
    this.doc.setFontSize(7);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text('This report is generated by EduSight AI and is for educational purposes only.', this.margin, this.currentY + 25);
    this.doc.text('For questions about this assessment, please contact support@edusight.com', this.margin, this.currentY + 30);
    
    // Add subtle background watermark
    this.doc.setTextColor(240, 240, 240);
    this.doc.setFontSize(50);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EduSight', this.pageWidth / 2 - 40, this.pageHeight / 2, {
      angle: 45
    });
  }

  private checkPageBreak(neededSpace: number): void {
    if (this.currentY + neededSpace > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }
}

// Utility function to generate PDF for download
export async function generateBrandedAssessmentPDF(assessmentData: AssessmentData): Promise<Blob> {
  const generator = new BrandedPDFGenerator();
  return await generator.generateAssessmentReport(assessmentData);
}

// Utility function to trigger PDF download
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
