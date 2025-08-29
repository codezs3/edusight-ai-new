"""
Enhanced views for the students app with comprehensive CRUD operations.
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count, Sum
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import Student, School, Parent, Teacher, Counselor, Attendance, UserAnalytics
from .forms import StudentForm, UserForm, ParentForm, SchoolForm

User = get_user_model()


@login_required
def student_list(request):
    """List all students with filtering and pagination."""
    students = Student.objects.select_related('user', 'school', 'parent__user').all()
    
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        students = students.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(roll_number__icontains=search_query) |
            Q(user__email__icontains=search_query) |
            Q(grade__icontains=search_query) |
            Q(section__icontains=search_query)
        )
    
    # Filter by grade
    grade_filter = request.GET.get('grade', '')
    if grade_filter:
        students = students.filter(grade=grade_filter)
    
    # Filter by school
    school_filter = request.GET.get('school', '')
    if school_filter:
        students = students.filter(school_id=school_filter)
    
    # Filter by active status
    status_filter = request.GET.get('status', '')
    if status_filter:
        is_active = status_filter == 'active'
        students = students.filter(is_active=is_active)
    
    # Sorting
    sort_by = request.GET.get('sort', 'grade')
    if sort_by in ['grade', 'section', 'roll_number', 'user__first_name', 'user__last_name', 'admission_date']:
        students = students.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(students, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get filter options for dropdowns
    grades = Student.objects.values_list('grade', flat=True).distinct().order_by('grade')
    schools = School.objects.filter(is_active=True).order_by('name')
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'grade_filter': grade_filter,
        'school_filter': school_filter,
        'status_filter': status_filter,
        'sort_by': sort_by,
        'grades': grades,
        'schools': schools,
        'total_students': students.count(),
    }
    
    return render(request, 'students/student_list.html', context)


@login_required
def student_detail(request, pk):
    """Display detailed student information."""
    student = get_object_or_404(Student, pk=pk)
    
    # Get performance data
    academic_perf = student.get_academic_performance()
    psychological_wellbeing = student.get_psychological_wellbeing()
    physical_health = student.get_physical_health_metrics()
    career_readiness = student.get_career_readiness_score()
    attendance_rate = student.get_attendance_rate()
    
    # Get recent attendance records
    recent_attendance = student.attendance_records.all()[:10]
    
    # Get ML predictions
    ml_predictions = student.get_ml_predictions()[:5]
    
    # Get risk factors and recommendations
    risk_factors = student.get_risk_factors()
    recommendations = student.get_recommendations()
    
    # Get performance trends (last 90 days)
    academic_trend = list(student.get_performance_trend('academic', 90))
    psychological_trend = list(student.get_performance_trend('psychological', 90))
    physical_trend = list(student.get_performance_trend('physical', 90))
    
    context = {
        'student': student,
        'academic_perf': academic_perf,
        'psychological_wellbeing': psychological_wellbeing,
        'physical_health': physical_health,
        'career_readiness': career_readiness,
        'attendance_rate': attendance_rate,
        'recent_attendance': recent_attendance,
        'ml_predictions': ml_predictions,
        'risk_factors': risk_factors,
        'recommendations': recommendations,
        'academic_trend': academic_trend,
        'psychological_trend': psychological_trend,
        'physical_trend': physical_trend,
    }
    
    return render(request, 'students/student_detail.html', context)


@login_required
def student_create(request):
    """Create a new student."""
    if request.method == 'POST':
        user_form = UserForm(request.POST, request.FILES)
        student_form = StudentForm(request.POST)
        
        if user_form.is_valid() and student_form.is_valid():
            try:
                # Create user first
                user = user_form.save(commit=False)
                user.role = 'student'
                user.save()
                
                # Create student profile
                student = student_form.save(commit=False)
                student.user = user
                student.save()
                
                # Log the creation
                UserAnalytics.objects.create(
                    user=request.user,
                    activity_type='student_created',
                    metadata={'student_id': student.id, 'student_name': student.user.get_full_name()}
                )
                
                messages.success(request, f'Student {student.user.get_full_name()} created successfully!')
                return redirect('students:student_detail', pk=student.pk)
                
            except ValidationError as e:
                messages.error(request, f'Error creating student: {e}')
            except Exception as e:
                messages.error(request, f'Unexpected error: {e}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        user_form = UserForm()
        student_form = StudentForm()
    
    schools = School.objects.filter(is_active=True).order_by('name')
    parents = Parent.objects.select_related('user').filter(is_active=True).order_by('user__first_name')
    
    context = {
        'user_form': user_form,
        'student_form': student_form,
        'schools': schools,
        'parents': parents,
        'form_action': 'Create',
    }
    
    return render(request, 'students/student_form.html', context)


@login_required
def student_edit(request, pk):
    """Edit existing student."""
    student = get_object_or_404(Student, pk=pk)
    
    if request.method == 'POST':
        user_form = UserForm(request.POST, request.FILES, instance=student.user)
        student_form = StudentForm(request.POST, instance=student)
        
        if user_form.is_valid() and student_form.is_valid():
            try:
                user_form.save()
                student_form.save()
                
                # Log the update
                UserAnalytics.objects.create(
                    user=request.user,
                    activity_type='student_updated',
                    metadata={'student_id': student.id, 'student_name': student.user.get_full_name()}
                )
                
                messages.success(request, f'Student {student.user.get_full_name()} updated successfully!')
                return redirect('students:student_detail', pk=student.pk)
                
            except ValidationError as e:
                messages.error(request, f'Error updating student: {e}')
            except Exception as e:
                messages.error(request, f'Unexpected error: {e}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        user_form = UserForm(instance=student.user)
        student_form = StudentForm(instance=student)
    
    schools = School.objects.filter(is_active=True).order_by('name')
    parents = Parent.objects.select_related('user').filter(is_active=True).order_by('user__first_name')
    
    context = {
        'user_form': user_form,
        'student_form': student_form,
        'schools': schools,
        'parents': parents,
        'student': student,
        'form_action': 'Edit',
    }
    
    return render(request, 'students/student_form.html', context)


@login_required
def student_delete(request, pk):
    """Delete student (soft delete by setting is_active=False)."""
    student = get_object_or_404(Student, pk=pk)
    
    if request.method == 'POST':
        try:
            # Soft delete - set as inactive instead of actual deletion
            student.is_active = False
            student.user.is_active = False
            student.save()
            student.user.save()
            
            # Log the deletion
            UserAnalytics.objects.create(
                user=request.user,
                activity_type='student_deleted',
                metadata={'student_id': student.id, 'student_name': student.user.get_full_name()}
            )
            
            messages.success(request, f'Student {student.user.get_full_name()} has been deactivated successfully!')
            return redirect('students:student_list')
            
        except Exception as e:
            messages.error(request, f'Error deactivating student: {e}')
            return redirect('students:student_detail', pk=pk)
    
    context = {
        'student': student,
        'object_type': 'Student',
    }
    
    return render(request, 'students/confirm_delete.html', context)


@login_required
def student_analytics(request, pk):
    """Display comprehensive student analytics."""
    student = get_object_or_404(Student, pk=pk)
    
    # Get analytics data for different periods
    periods = [30, 90, 180, 365]
    analytics_data = {}
    
    for period in periods:
        analytics_data[f'days_{period}'] = {
            'academic': student.get_academic_performance(period=period),
            'psychological': student.get_psychological_wellbeing(period=period),
            'physical': student.get_physical_health_metrics(period=period),
            'attendance': student.get_attendance_rate(period=period),
        }
    
    # Get performance trends
    trends = {
        'academic': list(student.get_performance_trend('academic', 180)),
        'psychological': list(student.get_performance_trend('psychological', 180)),
        'physical': list(student.get_performance_trend('physical', 180)),
    }
    
    # Get subject-wise performance
    from assessments.models import Assessment
    subject_performance = Assessment.objects.filter(
        student=student,
        assessment_type='academic'
    ).values('subject').annotate(
        avg_score=Avg('score'),
        count=Count('id'),
        latest_score=models.Max('score')
    ).order_by('-avg_score')
    
    context = {
        'student': student,
        'analytics_data': analytics_data,
        'trends': trends,
        'subject_performance': subject_performance,
        'risk_factors': student.get_risk_factors(),
        'recommendations': student.get_recommendations(),
    }
    
    return render(request, 'students/student_analytics.html', context)


@login_required
@csrf_exempt
def student_api(request):
    """API endpoint for student operations."""
    if request.method == 'GET':
        # Get students list for AJAX requests
        students = Student.objects.select_related('user', 'school').filter(is_active=True)
        
        search = request.GET.get('search', '')
        if search:
            students = students.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(roll_number__icontains=search)
            )
        
        student_data = [{
            'id': student.id,
            'name': student.user.get_full_name(),
            'roll_number': student.roll_number,
            'grade': student.grade,
            'section': student.section,
            'school': student.school.name,
            'email': student.user.email,
        } for student in students[:10]]
        
        return JsonResponse({'students': student_data})
    
    elif request.method == 'POST':
        # Bulk operations
        try:
            data = json.loads(request.body)
            action = data.get('action')
            student_ids = data.get('student_ids', [])
            
            if action == 'bulk_activate':
                Student.objects.filter(id__in=student_ids).update(is_active=True)
                User.objects.filter(student_profile__id__in=student_ids).update(is_active=True)
                return JsonResponse({'status': 'success', 'message': f'{len(student_ids)} students activated'})
            
            elif action == 'bulk_deactivate':
                Student.objects.filter(id__in=student_ids).update(is_active=False)
                User.objects.filter(student_profile__id__in=student_ids).update(is_active=False)
                return JsonResponse({'status': 'success', 'message': f'{len(student_ids)} students deactivated'})
            
            elif action == 'bulk_export':
                # Export student data
                students = Student.objects.filter(id__in=student_ids).select_related('user', 'school', 'parent__user')
                export_data = []
                
                for student in students:
                    export_data.append({
                        'name': student.user.get_full_name(),
                        'email': student.user.email,
                        'roll_number': student.roll_number,
                        'grade': student.grade,
                        'section': student.section,
                        'school': student.school.name,
                        'parent': student.parent.user.get_full_name() if student.parent else '',
                        'admission_date': student.admission_date.strftime('%Y-%m-%d'),
                        'is_active': student.is_active,
                    })
                
                return JsonResponse({'status': 'success', 'data': export_data})
            
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid action'})
                
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'})


@login_required
def attendance_view(request):
    """Attendance management view."""
    # Get date range
    date_from = request.GET.get('date_from', (timezone.now().date() - timedelta(days=30)).strftime('%Y-%m-%d'))
    date_to = request.GET.get('date_to', timezone.now().date().strftime('%Y-%m-%d'))
    
    # Get grade filter
    grade_filter = request.GET.get('grade', '')
    
    # Get attendance records
    attendance_records = Attendance.objects.select_related('student__user').filter(
        date__range=[date_from, date_to]
    )
    
    if grade_filter:
        attendance_records = attendance_records.filter(student__grade=grade_filter)
    
    # Calculate attendance statistics
    total_records = attendance_records.count()
    present_records = attendance_records.filter(status='present').count()
    absent_records = attendance_records.filter(status='absent').count()
    late_records = attendance_records.filter(status='late').count()
    
    attendance_rate = (present_records / total_records * 100) if total_records > 0 else 0
    
    # Get attendance by date
    attendance_by_date = attendance_records.values('date').annotate(
        total=Count('id'),
        present=Count('id', filter=Q(status='present')),
        absent=Count('id', filter=Q(status='absent')),
        late=Count('id', filter=Q(status='late'))
    ).order_by('date')
    
    # Get students with low attendance
    low_attendance_students = []
    for student in Student.objects.filter(is_active=True):
        rate = student.get_attendance_rate(period=30)
        if rate < 75:  # Below 75% attendance
            low_attendance_students.append({
                'student': student,
                'rate': rate
            })
    
    grades = Student.objects.values_list('grade', flat=True).distinct().order_by('grade')
    
    context = {
        'attendance_records': attendance_records[:50],  # Limit for performance
        'date_from': date_from,
        'date_to': date_to,
        'grade_filter': grade_filter,
        'grades': grades,
        'total_records': total_records,
        'present_records': present_records,
        'absent_records': absent_records,
        'late_records': late_records,
        'attendance_rate': round(attendance_rate, 2),
        'attendance_by_date': list(attendance_by_date),
        'low_attendance_students': low_attendance_students[:10],
    }
    
    return render(request, 'students/attendance.html', context)


@login_required
def school_list(request):
    """List all schools with CRUD operations."""
    schools = School.objects.all()
    
    search_query = request.GET.get('search', '')
    if search_query:
        schools = schools.filter(
            Q(name__icontains=search_query) |
            Q(address__icontains=search_query) |
            Q(school_type__icontains=search_query)
        )
    
    # Filter by active status
    status_filter = request.GET.get('status', '')
    if status_filter:
        is_active = status_filter == 'active'
        schools = schools.filter(is_active=is_active)
    
    # Add student and teacher counts
    schools = schools.annotate(
        student_count=Count('students', filter=Q(students__is_active=True)),
        teacher_count=Count('teachers', filter=Q(teachers__is_active=True))
    )
    
    # Pagination
    paginator = Paginator(schools, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'status_filter': status_filter,
        'total_schools': schools.count(),
    }
    
    return render(request, 'students/school_list.html', context)


@login_required
def school_create(request):
    """Create a new school."""
    if request.method == 'POST':
        form = SchoolForm(request.POST)
        if form.is_valid():
            try:
                school = form.save()
                
                # Log the creation
                UserAnalytics.objects.create(
                    user=request.user,
                    activity_type='school_created',
                    metadata={'school_id': school.id, 'school_name': school.name}
                )
                
                messages.success(request, f'School {school.name} created successfully!')
                return redirect('students:school_list')
                
            except ValidationError as e:
                messages.error(request, f'Error creating school: {e}')
            except Exception as e:
                messages.error(request, f'Unexpected error: {e}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = SchoolForm()
    
    context = {
        'form': form,
        'form_action': 'Create',
    }
    
    return render(request, 'students/school_form.html', context)


@login_required
def school_edit(request, pk):
    """Edit existing school."""
    school = get_object_or_404(School, pk=pk)
    
    if request.method == 'POST':
        form = SchoolForm(request.POST, instance=school)
        if form.is_valid():
            try:
                form.save()
                
                # Log the update
                UserAnalytics.objects.create(
                    user=request.user,
                    activity_type='school_updated',
                    metadata={'school_id': school.id, 'school_name': school.name}
                )
                
                messages.success(request, f'School {school.name} updated successfully!')
                return redirect('students:school_list')
                
            except ValidationError as e:
                messages.error(request, f'Error updating school: {e}')
            except Exception as e:
                messages.error(request, f'Unexpected error: {e}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = SchoolForm(instance=school)
    
    context = {
        'form': form,
        'school': school,
        'form_action': 'Edit',
    }
    
    return render(request, 'students/school_form.html', context)


@login_required
def school_delete(request, pk):
    """Delete school (soft delete)."""
    school = get_object_or_404(School, pk=pk)
    
    if request.method == 'POST':
        try:
            # Check if school has active students
            active_students = school.students.filter(is_active=True).count()
            if active_students > 0:
                messages.error(request, f'Cannot delete school. It has {active_students} active students.')
                return redirect('students:school_list')
            
            # Soft delete
            school.is_active = False
            school.save()
            
            # Log the deletion
            UserAnalytics.objects.create(
                user=request.user,
                activity_type='school_deleted',
                metadata={'school_id': school.id, 'school_name': school.name}
            )
            
            messages.success(request, f'School {school.name} has been deactivated successfully!')
            return redirect('students:school_list')
            
        except Exception as e:
            messages.error(request, f'Error deactivating school: {e}')
            return redirect('students:school_list')
    
    context = {
        'school': school,
        'object_type': 'School',
        'active_students': school.students.filter(is_active=True).count(),
    }
    
    return render(request, 'students/confirm_delete.html', context)


@login_required
def parent_list(request):
    """List all parents with CRUD operations."""
    parents = Parent.objects.select_related('user').all()
    
    search_query = request.GET.get('search', '')
    if search_query:
        parents = parents.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(user__email__icontains=search_query) |
            Q(occupation__icontains=search_query)
        )
    
    # Filter by active status
    status_filter = request.GET.get('status', '')
    if status_filter:
        is_active = status_filter == 'active'
        parents = parents.filter(is_active=is_active)
    
    # Add children count
    parents = parents.annotate(
        children_count=Count('children', filter=Q(children__is_active=True))
    )
    
    # Pagination
    paginator = Paginator(parents, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'status_filter': status_filter,
        'total_parents': parents.count(),
    }
    
    return render(request, 'students/parent_list.html', context)


@login_required
def parent_create(request):
    """Create a new parent."""
    if request.method == 'POST':
        user_form = UserForm(request.POST, request.FILES)
        parent_form = ParentForm(request.POST)
        
        if user_form.is_valid() and parent_form.is_valid():
            try:
                # Create user first
                user = user_form.save(commit=False)
                user.role = 'parent'
                user.save()
                
                # Create parent profile
                parent = parent_form.save(commit=False)
                parent.user = user
                parent.save()
                
                # Log the creation
                UserAnalytics.objects.create(
                    user=request.user,
                    activity_type='parent_created',
                    metadata={'parent_id': parent.id, 'parent_name': parent.user.get_full_name()}
                )
                
                messages.success(request, f'Parent {parent.user.get_full_name()} created successfully!')
                return redirect('students:parent_list')
                
            except ValidationError as e:
                messages.error(request, f'Error creating parent: {e}')
            except Exception as e:
                messages.error(request, f'Unexpected error: {e}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        user_form = UserForm()
        parent_form = ParentForm()
    
    context = {
        'user_form': user_form,
        'parent_form': parent_form,
        'form_action': 'Create',
    }
    
    return render(request, 'students/parent_form.html', context)


# Additional views for Teachers, Counselors, and Analytics can be added similarly...