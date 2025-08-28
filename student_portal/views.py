"""
Customer dashboard views for data upload, analysis, and report management
Complete workflow from payment to report generation
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils import timezone
from django.db import transaction
import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Import models
from epr_system.data_models import (
    StudentDataProfile, DataUpload, AcademicDataEntry, 
    PsychologicalDataEntry, PhysicalDataEntry, DataValidationIssue,
    YearwiseDataSummary
)
from epr_system.file_processors import FileProcessor, DataValidator
from epr_system.algorithms import EPRScoringAlgorithms
from students.models import User

@login_required
def customer_dashboard(request):
    """Main customer dashboard after payment"""
    
    # Get or create student data profile
    profile, created = StudentDataProfile.objects.get_or_create(
        student=request.user,
        defaults={
            'payment_status': 'completed',  # Assume payment completed to reach here
            'plan_type': request.session.get('selected_plan', 'basic'),
            'current_academic_year': f"{datetime.now().year}-{datetime.now().year + 1}"
        }
    )
    
    # Check access validity
    if not profile.payment_status == 'completed':
        messages.error(request, 'Please complete your payment to access the dashboard.')
        return redirect('pricing_plans')
    
    # Get data completion status
    completion_percentage = profile.get_completion_percentage()
    
    # Get recent uploads
    recent_uploads = DataUpload.objects.filter(student=request.user).order_by('-created_at')[:5]
    
    # Get validation issues
    pending_issues = DataValidationIssue.objects.filter(
        student=request.user, 
        status='open'
    ).order_by('severity', '-created_at')[:10]
    
    # Get year-wise summaries
    yearly_summaries = YearwiseDataSummary.objects.filter(student=request.user).order_by('-academic_year')[:3]
    
    # Get latest EPR score
    latest_epr = None
    if yearly_summaries:
        latest_epr = yearly_summaries[0].annual_epr_score
    
    # Get next steps based on completion
    next_steps = get_next_steps(profile, completion_percentage)
    
    context = {
        'profile': profile,
        'completion_percentage': completion_percentage,
        'recent_uploads': recent_uploads,
        'pending_issues': pending_issues,
        'yearly_summaries': yearly_summaries,
        'latest_epr': latest_epr,
        'next_steps': next_steps,
        'academic_years': profile.academic_years,
        'plan_features': get_plan_features(profile.plan_type),
    }
    
    return render(request, 'student_portal/dashboard.html', context)

@login_required
def data_upload(request):
    """Step 1: Data capture and uploading"""
    
    if request.method == 'POST':
        return handle_file_upload(request)
    
    profile = get_object_or_404(StudentDataProfile, student=request.user)
    
    # Get upload history
    uploads = DataUpload.objects.filter(student=request.user).order_by('-created_at')
    
    # Get upload statistics
    upload_stats = {
        'total_uploads': uploads.count(),
        'pending_processing': uploads.filter(processing_status='pending').count(),
        'processing': uploads.filter(processing_status='processing').count(),
        'completed': uploads.filter(processing_status='completed').count(),
        'failed': uploads.filter(processing_status='failed').count(),
        'needs_review': uploads.filter(processing_status='needs_review').count(),
    }
    
    context = {
        'profile': profile,
        'uploads': uploads[:20],  # Show last 20 uploads
        'upload_stats': upload_stats,
        'supported_formats': [
            {'type': 'CSV', 'description': 'Comma-separated values (academic scores, test results)'},
            {'type': 'Excel', 'description': 'Spreadsheet files (.xlsx, .xls)'},
            {'type': 'PDF', 'description': 'Report cards, medical reports, certificates'},
            {'type': 'Word', 'description': 'Assessment reports (.docx)'},
            {'type': 'Images', 'description': 'Photos of documents (.jpg, .png, .gif)'},
        ]
    }
    
    return render(request, 'student_portal/data_upload.html', context)

@login_required
def data_validation(request):
    """Step 2: Data preparation and validation"""
    
    profile = get_object_or_404(StudentDataProfile, student=request.user)
    
    if request.method == 'POST':
        return handle_validation_action(request)
    
    # Get all validation issues
    issues = DataValidationIssue.objects.filter(student=request.user).order_by('severity', '-created_at')
    
    # Group issues by category
    issues_by_category = {
        'critical': issues.filter(severity='critical'),
        'high': issues.filter(severity='high'),
        'medium': issues.filter(severity='medium'),
        'low': issues.filter(severity='low'),
    }
    
    # Get data entries that need review
    academic_entries = AcademicDataEntry.objects.filter(student=request.user).order_by('-created_at')[:10]
    psychological_entries = PsychologicalDataEntry.objects.filter(student=request.user).order_by('-created_at')[:10]
    physical_entries = PhysicalDataEntry.objects.filter(student=request.user).order_by('-created_at')[:10]
    
    context = {
        'profile': profile,
        'issues_by_category': issues_by_category,
        'total_issues': issues.count(),
        'academic_entries': academic_entries,
        'psychological_entries': psychological_entries,
        'physical_entries': physical_entries,
    }
    
    return render(request, 'student_portal/data_validation.html', context)

@login_required
def data_analysis(request):
    """Step 3: Data analysis and insights"""
    
    profile = get_object_or_404(StudentDataProfile, student=request.user)
    
    # Initialize analytics engine
    from .analytics_engine import AnalyticsEngine
    analytics = AnalyticsEngine(request.user)
    
    # Get comprehensive analysis
    analysis_results = analytics.generate_comprehensive_analysis()
    
    # Get trends and patterns
    trends = analytics.get_trends_analysis()
    
    # Get performance patterns
    patterns = analytics.identify_performance_patterns()
    
    context = {
        'profile': profile,
        'analysis_results': analysis_results,
        'trends': trends,
        'patterns': patterns,
        'can_proceed': analysis_results.get('data_sufficient', False),
    }
    
    return render(request, 'student_portal/data_analysis.html', context)

# Helper functions

def handle_file_upload(request):
    """Handle file upload and processing"""
    try:
        uploaded_file = request.FILES.get('file')
        upload_type = request.POST.get('upload_type', 'other')
        academic_year = request.POST.get('academic_year', '')
        description = request.POST.get('description', '')
        
        if not uploaded_file:
            return JsonResponse({'success': False, 'error': 'No file uploaded'})
        
        # Validate file
        max_size = 10 * 1024 * 1024  # 10MB
        if uploaded_file.size > max_size:
            return JsonResponse({'success': False, 'error': 'File size too large (max 10MB)'})
        
        # Determine file type
        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        file_type_mapping = {
            '.csv': 'csv',
            '.xlsx': 'excel', '.xls': 'excel',
            '.pdf': 'pdf',
            '.docx': 'doc', '.doc': 'doc',
            '.jpg': 'image', '.jpeg': 'image', '.png': 'image', '.gif': 'image', '.bmp': 'image'
        }
        
        file_type = file_type_mapping.get(file_extension, 'other')
        
        # Create upload record
        upload = DataUpload.objects.create(
            student=request.user,
            file=uploaded_file,
            original_filename=uploaded_file.name,
            file_size=uploaded_file.size,
            file_type=file_type,
            upload_type=upload_type,
            academic_year=academic_year,
            description=description,
            processing_status='pending'
        )
        
        # Process file asynchronously (or immediately for demo)
        process_uploaded_file(upload)
        
        return JsonResponse({
            'success': True,
            'upload_id': upload.id,
            'message': 'File uploaded successfully and processing started'
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

def process_uploaded_file(upload: DataUpload):
    """Process uploaded file and extract data"""
    try:
        upload.processing_status = 'processing'
        upload.save()
        
        # Initialize file processor
        processor = FileProcessor(upload.file.path, upload.file_type)
        
        # Process file
        result = processor.process()
        
        if result['success']:
            upload.extracted_data = result.get('extracted_data', {})
            upload.confidence_score = result.get('confidence_score', 0.0)
            upload.processing_status = 'completed'
            
            # Create data entries based on extracted data
            create_data_entries_from_upload(upload, result)
            
        else:
            upload.processing_status = 'failed'
            upload.processing_notes = result.get('error', 'Processing failed')
        
        upload.processed_at = timezone.now()
        upload.save()
        
    except Exception as e:
        upload.processing_status = 'failed'
        upload.processing_notes = f"Processing error: {str(e)}"
        upload.processed_at = timezone.now()
        upload.save()

def create_data_entries_from_upload(upload: DataUpload, result: Dict[str, Any]):
    """Create data entries from processed upload"""
    try:
        extracted_data = result.get('extracted_data', {})
        data_type = result.get('data_type', 'unknown')
        
        profile = upload.student.data_profile
        
        if data_type == 'academic' and isinstance(extracted_data, list):
            for record in extracted_data:
                create_academic_entry(upload, record, profile)
        
        elif data_type == 'psychological' and isinstance(extracted_data, list):
            for record in extracted_data:
                create_psychological_entry(upload, record, profile)
        
        elif data_type == 'physical' and isinstance(extracted_data, list):
            for record in extracted_data:
                create_physical_entry(upload, record, profile)
        
        # Update profile completion status
        update_profile_completion(profile)
        
    except Exception as e:
        upload.processing_notes += f" Data entry creation failed: {str(e)}"
        upload.save()

def create_academic_entry(upload: DataUpload, record: Dict[str, Any], profile: StudentDataProfile):
    """Create academic data entry from extracted record"""
    try:
        entry = AcademicDataEntry.objects.create(
            student=upload.student,
            data_profile=profile,
            academic_year=record.get('academic_year', upload.academic_year or profile.current_academic_year),
            class_grade=record.get('class_grade', ''),
            subject=record.get('subject', 'general'),
            assessment_type=record.get('assessment_type', 'other'),
            marks_obtained=record.get('marks_obtained', 0),
            total_marks=record.get('total_marks', 100),
            percentage=record.get('percentage'),
            grade=record.get('grade', ''),
            attendance_percentage=record.get('attendance'),
            data_source='upload',
            source_file=upload
        )
        
        # Add to academic years if not present
        if entry.academic_year:
            profile.add_academic_year(entry.academic_year)
        
    except Exception as e:
        # Create validation issue
        DataValidationIssue.objects.create(
            student=upload.student,
            issue_type='format_error',
            severity='medium',
            status='open',
            data_category='academic',
            field_name='academic_entry',
            description=f"Failed to create academic entry from upload: {str(e)}",
        )

def create_psychological_entry(upload: DataUpload, record: Dict[str, Any], profile: StudentDataProfile):
    """Create psychological data entry from extracted record"""
    try:
        entry = PsychologicalDataEntry.objects.create(
            student=upload.student,
            data_profile=profile,
            assessment_date=record.get('assessment_date', timezone.now().date()),
            academic_year=record.get('academic_year', upload.academic_year or profile.current_academic_year),
            assessment_category=record.get('assessment_category', 'other'),
            assessment_name=record.get('assessment_name', 'Uploaded Assessment'),
            custom_scores=record,
            data_source='upload',
            source_file=upload
        )
        
        if entry.academic_year:
            profile.add_academic_year(entry.academic_year)
        
    except Exception as e:
        DataValidationIssue.objects.create(
            student=upload.student,
            issue_type='format_error',
            severity='medium',
            status='open',
            data_category='psychological',
            field_name='psychological_entry',
            description=f"Failed to create psychological entry from upload: {str(e)}",
        )

def create_physical_entry(upload: DataUpload, record: Dict[str, Any], profile: StudentDataProfile):
    """Create physical data entry from extracted record"""
    try:
        entry = PhysicalDataEntry.objects.create(
            student=upload.student,
            data_profile=profile,
            measurement_date=record.get('measurement_date', timezone.now().date()),
            academic_year=record.get('academic_year', upload.academic_year or profile.current_academic_year),
            measurement_type=record.get('measurement_type', 'other'),
            height_cm=record.get('height_cm'),
            weight_kg=record.get('weight_kg'),
            bmi=record.get('bmi'),
            data_source='upload',
            source_file=upload
        )
        
        if entry.academic_year:
            profile.add_academic_year(entry.academic_year)
        
    except Exception as e:
        DataValidationIssue.objects.create(
            student=upload.student,
            issue_type='format_error',
            severity='medium',
            status='open',
            data_category='physical',
            field_name='physical_entry',
            description=f"Failed to create physical entry from upload: {str(e)}",
        )

def update_profile_completion(profile: StudentDataProfile):
    """Update profile data completion status"""
    profile.academic_data_complete = AcademicDataEntry.objects.filter(student=profile.student).exists()
    profile.psychological_data_complete = PsychologicalDataEntry.objects.filter(student=profile.student).exists()
    profile.physical_data_complete = PhysicalDataEntry.objects.filter(student=profile.student).exists()
    profile.save()

def get_next_steps(profile: StudentDataProfile, completion_percentage: float) -> List[Dict[str, Any]]:
    """Get next steps based on current progress"""
    steps = []
    
    if completion_percentage < 30:
        steps.append({
            'title': 'Upload Your Data',
            'description': 'Start by uploading your academic records, report cards, or assessment results',
            'url': 'data_upload',
            'priority': 'high'
        })
    
    if not profile.academic_data_complete:
        steps.append({
            'title': 'Add Academic Data',
            'description': 'Upload report cards, test scores, and academic performance data',
            'url': 'data_upload',
            'priority': 'high'
        })
    
    validation_issues = DataValidationIssue.objects.filter(student=profile.student, status='open').count()
    if validation_issues > 0:
        steps.append({
            'title': f'Resolve {validation_issues} Data Issues',
            'description': 'Review and fix data validation issues for accurate analysis',
            'url': 'data_validation',
            'priority': 'medium'
        })
    
    if completion_percentage >= 50:
        steps.append({
            'title': 'View Analysis',
            'description': 'Explore comprehensive analysis of your data and performance trends',
            'url': 'data_analysis',
            'priority': 'medium'
        })
    
    if completion_percentage >= 70:
        steps.append({
            'title': 'Generate EPR Report',
            'description': 'Create your professional EPR assessment report',
            'url': 'report_generation',
            'priority': 'low'
        })
    
    return steps

def get_plan_features(plan_type: str) -> Dict[str, Any]:
    """Get features available for the plan type"""
    features = {
        'basic': {
            'max_uploads': 10,
            'data_retention_months': 12,
            'reports_per_month': 2,
            'advanced_analytics': False,
            'prediction_analysis': False,
            'benchmark_comparison': True,
        },
        'gold': {
            'max_uploads': 25,
            'data_retention_months': 24,
            'reports_per_month': 5,
            'advanced_analytics': True,
            'prediction_analysis': True,
            'benchmark_comparison': True,
        },
        'platinum': {
            'max_uploads': 100,
            'data_retention_months': 60,
            'reports_per_month': 20,
            'advanced_analytics': True,
            'prediction_analysis': True,
            'benchmark_comparison': True,
            'career_mapping': True,
        },
        'corporate': {
            'max_uploads': 1000,
            'data_retention_months': 120,
            'reports_per_month': 100,
            'advanced_analytics': True,
            'prediction_analysis': True,
            'benchmark_comparison': True,
            'career_mapping': True,
            'bulk_processing': True,
        }
    }
    
    return features.get(plan_type, features['basic'])

def handle_validation_action(request):
    """Handle validation issue resolution"""
    try:
        action = request.POST.get('action')
        issue_id = request.POST.get('issue_id')
        
        if action == 'resolve':
            issue = get_object_or_404(DataValidationIssue, id=issue_id, student=request.user)
            issue.status = 'resolved'
            issue.resolved_at = timezone.now()
            issue.save()
            
            return JsonResponse({'success': True, 'message': 'Issue resolved successfully'})
        
        elif action == 'dismiss':
            issue = get_object_or_404(DataValidationIssue, id=issue_id, student=request.user)
            issue.status = 'dismissed'
            issue.resolved_at = timezone.now()
            issue.save()
            
            return JsonResponse({'success': True, 'message': 'Issue dismissed'})
        
        return JsonResponse({'success': False, 'error': 'Invalid action'})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def get_completion_status(request):
    """API endpoint to get current completion status"""
    try:
        profile = get_object_or_404(StudentDataProfile, student=request.user)
        completion_percentage = profile.get_completion_percentage()
        
        return JsonResponse({
            'success': True,
            'completion_percentage': completion_percentage,
            'academic_complete': profile.academic_data_complete,
            'psychological_complete': profile.psychological_data_complete,
            'physical_complete': profile.physical_data_complete
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def get_analytics_data(request):
    """API endpoint to get analytics data for charts"""
    try:
        from .analytics_engine import AnalyticsEngine
        analytics = AnalyticsEngine(request.user)
        
        chart_type = request.GET.get('type', 'comprehensive')
        timeframe = request.GET.get('timeframe', '6_months')
        
        if chart_type == 'academic_trends':
            data = analytics.create_visualization_data('academic_trends')
        elif chart_type == 'epr_forecast':
            data = analytics.create_visualization_data('epr_forecast')
        elif chart_type == 'growth_patterns':
            data = analytics.create_visualization_data('growth_patterns')
        else:
            analysis = analytics.generate_comprehensive_analysis()
            data = {'analysis': analysis}
        
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def get_predictions_data(request):
    """API endpoint to get prediction data"""
    try:
        from .prediction_engine import PredictionEngine
        predictions = PredictionEngine(request.user)
        
        prediction_type = request.GET.get('type', 'academic')
        timeframe = request.GET.get('timeframe', '6_months')
        
        if prediction_type == 'academic':
            data = predictions.generate_academic_predictions(timeframe)
        elif prediction_type == 'epr':
            data = predictions.generate_epr_forecast(timeframe)
        elif prediction_type == 'career':
            data = predictions.generate_career_aptitude_predictions()
        else:
            data = predictions.analyze_growth_patterns()
        
        return JsonResponse({'success': True, 'data': data})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
def report_management(request):
    """Report management page"""
    profile = get_object_or_404(StudentDataProfile, student=request.user)
    
    # Get available reports (would be stored in database)
    reports = []  # Placeholder for generated reports
    
    context = {
        'profile': profile,
        'reports': reports,
        'can_generate': profile.get_completion_percentage() >= 50
    }
    
    return render(request, 'student_portal/reports.html', context)

@login_required
def generate_report(request):
    """Generate new report"""
    if request.method == 'POST':
        try:
            from .report_generator import EPRReportGenerator
            
            report_type = request.POST.get('report_type', 'comprehensive')
            generator = EPRReportGenerator(request.user, report_type)
            
            if report_type == 'quick':
                result = generator.generate_quick_report()
            else:
                result = generator.generate_comprehensive_report()
            
            if result['success']:
                return JsonResponse({
                    'success': True,
                    'filename': result['filename'],
                    'message': 'Report generated successfully',
                    'download_url': f"/student-portal/reports/download/{result['filename']}/"
                })
            else:
                return JsonResponse({'success': False, 'error': 'Report generation failed'})
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

@login_required
def download_report(request, report_id):
    """Download generated report"""
    try:
        # In production, this would validate report ownership and serve the file
        import os
        from django.http import FileResponse
        from django.conf import settings
        
        # Placeholder implementation
        report_path = os.path.join(settings.MEDIA_ROOT, 'temp_reports', report_id)
        
        if os.path.exists(report_path):
            response = FileResponse(
                open(report_path, 'rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="{report_id}"'
            return response
        else:
            raise Http404("Report not found")
            
    except Exception as e:
        raise Http404("Report not available")

@login_required
def edit_data_entry(request, entry_type, entry_id):
    """Edit data entry"""
    if request.method == 'POST':
        try:
            from .incremental_processor import IncrementalProcessor
            
            # Get corrections from form data
            corrections = {}
            for key, value in request.POST.items():
                if key.startswith('field_'):
                    field_name = key.replace('field_', '')
                    corrections[field_name] = value
            
            # Process corrections
            processor = IncrementalProcessor(request.user)
            result = processor.handle_data_correction(entry_type, entry_id, corrections)
            
            if result['success']:
                messages.success(request, 'Data updated successfully')
            else:
                messages.error(request, f'Error updating data: {result.get("error", "Unknown error")}')
                
        except Exception as e:
            messages.error(request, f'Error updating data: {str(e)}')
    
    return redirect('student_portal:dashboard')

@login_required
def delete_data_entry(request, entry_type, entry_id):
    """Delete data entry"""
    if request.method == 'POST':
        try:
            entry = get_entry_by_type_and_id(entry_type, entry_id, request.user)
            if entry:
                entry.delete()
                
                # Trigger recalculation
                from .incremental_processor import IncrementalProcessor
                processor = IncrementalProcessor(request.user)
                processor.recalculate_all_metrics()
                
                messages.success(request, 'Data entry deleted successfully')
            else:
                messages.error(request, 'Data entry not found')
                
        except Exception as e:
            messages.error(request, f'Error deleting data: {str(e)}')
    
    return redirect('student_portal:dashboard')

@login_required
def detailed_insights(request):
    """Detailed insights page"""
    from .analytics_engine import AnalyticsEngine
    
    analytics = AnalyticsEngine(request.user)
    analysis = analytics.generate_comprehensive_analysis()
    trends = analytics.get_trends_analysis()
    patterns = analytics.identify_performance_patterns()
    
    context = {
        'analysis': analysis,
        'trends': trends,
        'patterns': patterns
    }
    
    return render(request, 'student_portal/insights.html', context)

@login_required
def benchmark_comparison(request):
    """Benchmark comparison page"""
    from .analytics_engine import BenchmarkingService
    
    benchmarking = BenchmarkingService()
    student_data = benchmarking.get_student_data(request.user)
    comparisons = benchmarking.compare_with_benchmarks(student_data, request.user)
    percentiles = benchmarking.get_percentile_rankings(student_data)
    
    context = {
        'student_data': student_data,
        'comparisons': comparisons,
        'percentiles': percentiles
    }
    
    return render(request, 'student_portal/benchmarks.html', context)

@login_required
def prediction_dashboard(request):
    """Prediction dashboard page"""
    from .prediction_engine import PredictionEngine
    
    predictions = PredictionEngine(request.user)
    academic_predictions = predictions.generate_academic_predictions()
    epr_forecast = predictions.generate_epr_forecast()
    growth_patterns = predictions.analyze_growth_patterns()
    career_aptitude = predictions.generate_career_aptitude_predictions()
    
    context = {
        'academic_predictions': academic_predictions,
        'epr_forecast': epr_forecast,
        'growth_patterns': growth_patterns,
        'career_aptitude': career_aptitude
    }
    
    return render(request, 'student_portal/predictions.html', context)

@login_required
def profile_settings(request):
    """Profile settings page"""
    profile = get_object_or_404(StudentDataProfile, student=request.user)
    
    if request.method == 'POST':
        # Handle settings updates
        pass
    
    context = {
        'profile': profile
    }
    
    return render(request, 'student_portal/settings.html', context)

@login_required
def notification_center(request):
    """Notification center"""
    # Get notifications for the user
    notifications = []  # Placeholder
    
    context = {
        'notifications': notifications
    }
    
    return render(request, 'student_portal/notifications.html', context)

@login_required
def help_center(request):
    """Help center page"""
    return render(request, 'student_portal/help.html')

@login_required
def interactive_tutorial(request):
    """Interactive tutorial page"""
    return render(request, 'student_portal/tutorial.html')

# Helper functions

def get_entry_by_type_and_id(entry_type: str, entry_id: int, student: User):
    """Get entry by type and ID"""
    if entry_type == 'academic':
        return AcademicDataEntry.objects.filter(id=entry_id, student=student).first()
    elif entry_type == 'psychological':
        return PsychologicalDataEntry.objects.filter(id=entry_id, student=student).first()
    elif entry_type == 'physical':
        return PhysicalDataEntry.objects.filter(id=entry_id, student=student).first()
    else:
        return None