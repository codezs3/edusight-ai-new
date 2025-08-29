"""
Enhanced PDF generation service for the parent dashboard.
Supports multiple PDF libraries and comprehensive report generation.
"""

import os
import tempfile
from datetime import datetime
from django.conf import settings
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.utils import timezone
import json


class PDFGenerator:
    """Enhanced PDF generation class with multiple backend support."""
    
    def __init__(self, backend='reportlab'):
        """Initialize PDF generator with specified backend."""
        self.backend = backend
        self.available_backends = self._check_available_backends()
        
        if backend not in self.available_backends:
            # Fallback to the first available backend
            self.backend = self.available_backends[0] if self.available_backends else None
    
    def _check_available_backends(self):
        """Check which PDF backends are available."""
        backends = []
        
        try:
            import reportlab
            backends.append('reportlab')
        except ImportError:
            pass
        
        try:
            import weasyprint
            backends.append('weasyprint')
        except ImportError:
            pass
        
        try:
            import xhtml2pdf
            backends.append('xhtml2pdf')
        except ImportError:
            pass
        
        return backends
    
    def generate_assessment_report(self, upload_session, assessment, prediction, recommendations):
        """Generate comprehensive assessment report PDF."""
        
        if not self.available_backends:
            return self._generate_fallback_report(upload_session, assessment, prediction, recommendations)
        
        context = {
            'upload_session': upload_session,
            'assessment': assessment,
            'prediction': prediction,
            'recommendations': recommendations,
            'generated_at': timezone.now(),
            'student_name': upload_session.student_data.get('name', 'Student'),
            'parent_name': upload_session.parent_user.get_full_name(),
        }
        
        if self.backend == 'reportlab':
            return self._generate_reportlab_pdf(context)
        elif self.backend == 'weasyprint':
            return self._generate_weasyprint_pdf(context)
        elif self.backend == 'xhtml2pdf':
            return self._generate_xhtml2pdf_pdf(context)
        else:
            return self._generate_fallback_report(upload_session, assessment, prediction, recommendations)
    
    def _generate_reportlab_pdf(self, context):
        """Generate PDF using ReportLab."""
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
            from reportlab.platypus import Image as RLImage
            from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
            from reportlab.graphics.shapes import Drawing
            from reportlab.graphics.charts.barcharts import VerticalBarChart
            from reportlab.graphics.charts.piecharts import Pie
            import io
            
            # Create PDF buffer
            buffer = io.BytesIO()
            
            # Create PDF document
            doc = SimpleDocTemplate(
                buffer,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18
            )
            
            # Build story
            story = []
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.HexColor('#2E86AB')
            )
            
            subtitle_style = ParagraphStyle(
                'CustomSubtitle',
                parent=styles['Heading2'],
                fontSize=18,
                spaceAfter=20,
                textColor=colors.HexColor('#A23B72')
            )
            
            # Header
            story.append(Paragraph("EduSight Assessment Report", title_style))
            story.append(Spacer(1, 12))
            
            # Student information
            student_info = [
                ['Student Name:', context['student_name']],
                ['Parent/Guardian:', context['parent_name']],
                ['Assessment Date:', context['upload_session'].created_at.strftime('%B %d, %Y')],
                ['Report Generated:', context['generated_at'].strftime('%B %d, %Y at %I:%M %p')],
            ]
            
            student_table = Table(student_info, colWidths=[2*inch, 4*inch])
            student_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8F9FA')),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#495057')),
                ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#DEE2E6')),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#F8F9FA')])
            ]))
            
            story.append(student_table)
            story.append(Spacer(1, 20))
            
            # Assessment Overview
            story.append(Paragraph("Assessment Overview", subtitle_style))
            
            assessment_data = []
            if context['assessment']:
                assessment_data = [
                    ['Academic Performance', f"{context['assessment'].academic_score:.1f}/100"],
                    ['Psychological Wellbeing', f"{context['assessment'].psychological_score:.1f}/100"],
                    ['Physical Health', f"{context['assessment'].physical_score:.1f}/100"],
                    ['Overall Score', f"{context['assessment'].overall_score:.1f}/100"],
                ]
            
            if assessment_data:
                assessment_table = Table(assessment_data, colWidths=[3*inch, 2*inch])
                assessment_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E86AB')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#DEE2E6')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ]))
                
                story.append(assessment_table)
            else:
                story.append(Paragraph("Assessment data not available.", styles['Normal']))
            
            story.append(Spacer(1, 20))
            
            # Predictions
            if context['prediction']:
                story.append(Paragraph("Performance Predictions", subtitle_style))
                
                prediction_text = f"""
                Based on the current assessment data, our AI model predicts the following trends:
                
                • Academic Performance: {context['prediction'].predicted_academic:.1f}/100 (6-month projection)
                • Learning Efficiency: {context['prediction'].learning_efficiency:.1f}%
                • Risk Level: {context['prediction'].risk_level}
                
                These predictions are based on machine learning analysis of similar student profiles and should be used as guidance alongside professional evaluation.
                """
                
                story.append(Paragraph(prediction_text, styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Recommendations
            story.append(Paragraph("Personalized Recommendations", subtitle_style))
            
            if context['recommendations']:
                for i, rec in enumerate(context['recommendations'][:5], 1):
                    rec_text = f"""
                    <b>{i}. {rec.category}</b><br/>
                    {rec.recommendation}<br/>
                    <i>Expected Impact:</i> {rec.expected_impact}<br/>
                    <i>Timeline:</i> {rec.timeline}
                    """
                    story.append(Paragraph(rec_text, styles['Normal']))
                    story.append(Spacer(1, 10))
            else:
                story.append(Paragraph("No specific recommendations available at this time.", styles['Normal']))
            
            story.append(Spacer(1, 20))
            
            # Disclaimer
            story.append(PageBreak())
            story.append(Paragraph("Important Disclaimer", subtitle_style))
            
            disclaimer_text = """
            This assessment report is generated by EduSight's AI-powered analysis system and is intended for educational guidance purposes only. The results and recommendations should not be considered as:
            
            • Professional psychological or medical diagnosis
            • Definitive predictions of future academic performance
            • Replacement for qualified educational assessment
            • Absolute measures of student capability or potential
            
            We strongly recommend consulting with qualified educators, counselors, or specialists for comprehensive evaluation and decision-making regarding your child's education and development.
            
            For questions about this report, please contact our support team at support@edusight.com.
            """
            
            story.append(Paragraph(disclaimer_text, styles['Normal']))
            
            # Footer information
            footer_text = f"""
            <br/><br/>
            <b>Report ID:</b> {context['upload_session'].id}<br/>
            <b>Generated by:</b> EduSight Analytics Platform<br/>
            <b>Version:</b> 2.0<br/>
            <b>Generated on:</b> {context['generated_at'].strftime('%B %d, %Y at %I:%M %p')}
            """
            
            story.append(Paragraph(footer_text, styles['Normal']))
            
            # Build PDF
            doc.build(story)
            
            # Get PDF content
            pdf_content = buffer.getvalue()
            buffer.close()
            
            return pdf_content
            
        except Exception as e:
            print(f"ReportLab PDF generation failed: {e}")
            return self._generate_fallback_report(
                context['upload_session'], 
                context['assessment'], 
                context['prediction'], 
                context['recommendations']
            )
    
    def _generate_weasyprint_pdf(self, context):
        """Generate PDF using WeasyPrint."""
        try:
            import weasyprint
            
            # Render HTML template
            html_content = render_to_string('parent_dashboard/pdf_report_template.html', context)
            
            # Generate PDF
            pdf = weasyprint.HTML(string=html_content).write_pdf()
            
            return pdf
            
        except Exception as e:
            print(f"WeasyPrint PDF generation failed: {e}")
            return self._generate_fallback_report(
                context['upload_session'], 
                context['assessment'], 
                context['prediction'], 
                context['recommendations']
            )
    
    def _generate_xhtml2pdf_pdf(self, context):
        """Generate PDF using xhtml2pdf."""
        try:
            from xhtml2pdf import pisa
            import io
            
            # Render HTML template
            html_content = render_to_string('parent_dashboard/pdf_report_template.html', context)
            
            # Generate PDF
            result = io.BytesIO()
            pdf = pisa.pisaDocument(io.BytesIO(html_content.encode("UTF-8")), result)
            
            if not pdf.err:
                return result.getvalue()
            else:
                raise Exception("PDF generation error")
                
        except Exception as e:
            print(f"xhtml2pdf PDF generation failed: {e}")
            return self._generate_fallback_report(
                context['upload_session'], 
                context['assessment'], 
                context['prediction'], 
                context['recommendations']
            )
    
    def _generate_fallback_report(self, upload_session, assessment, prediction, recommendations):
        """Generate a simple text-based report when PDF libraries are not available."""
        
        report_content = f"""
EduSight Assessment Report
========================

Student Information:
- Assessment Date: {upload_session.created_at.strftime('%B %d, %Y')}
- Report Generated: {timezone.now().strftime('%B %d, %Y at %I:%M %p')}

Assessment Overview:
"""
        
        if assessment:
            report_content += f"""
- Academic Performance: {assessment.academic_score:.1f}/100
- Psychological Wellbeing: {assessment.psychological_score:.1f}/100
- Physical Health: {assessment.physical_score:.1f}/100
- Overall Score: {assessment.overall_score:.1f}/100
"""
        else:
            report_content += "- Assessment data not available\n"
        
        if prediction:
            report_content += f"""
Performance Predictions:
- Academic Performance (6-month): {prediction.predicted_academic:.1f}/100
- Learning Efficiency: {prediction.learning_efficiency:.1f}%
- Risk Level: {prediction.risk_level}
"""
        
        report_content += "\nPersonalized Recommendations:\n"
        
        if recommendations:
            for i, rec in enumerate(recommendations[:5], 1):
                report_content += f"""
{i}. {rec.category}
   {rec.recommendation}
   Expected Impact: {rec.expected_impact}
   Timeline: {rec.timeline}
"""
        else:
            report_content += "No specific recommendations available.\n"
        
        report_content += """
Important Disclaimer:
This assessment report is generated by EduSight's AI-powered analysis system 
and is intended for educational guidance purposes only. Please consult with 
qualified professionals for comprehensive evaluation.

Generated by: EduSight Analytics Platform
"""
        
        return report_content.encode('utf-8')
    
    def create_pdf_response(self, pdf_content, filename="assessment_report.pdf"):
        """Create HTTP response for PDF download."""
        
        if isinstance(pdf_content, str):
            # Text fallback
            response = HttpResponse(pdf_content, content_type='text/plain')
            response['Content-Disposition'] = f'attachment; filename="{filename.replace(".pdf", ".txt")}"'
        else:
            # PDF content
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response


# Global PDF generator instance
pdf_generator = PDFGenerator()


def generate_assessment_pdf(upload_session, assessment, prediction, recommendations):
    """Generate assessment PDF report."""
    return pdf_generator.generate_assessment_report(
        upload_session, assessment, prediction, recommendations
    )


def create_pdf_download_response(upload_session, assessment, prediction, recommendations):
    """Create PDF download response."""
    
    pdf_content = generate_assessment_pdf(upload_session, assessment, prediction, recommendations)
    
    filename = f"edusight_assessment_report_{upload_session.id}_{timezone.now().strftime('%Y%m%d')}.pdf"
    
    return pdf_generator.create_pdf_response(pdf_content, filename)
