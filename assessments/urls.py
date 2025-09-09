"""
Assessment Framework URLs
"""

from django.urls import path
from . import assessment_views
from . import workflow_views
from . import psychometric_views
from . import guest_views
from . import career_mapping_views
from . import crud_views
from . import test_catalog_views

app_name = 'assessments'

urlpatterns = [
    # Assessment Dashboard
    path('', assessment_views.assessment_dashboard, name='dashboard'),
    
    # Assessment Type Routes
    path('academic/', assessment_views.academic_assessment_view, name='academic_assessment'),
    path('psychometric/', assessment_views.psychometric_assessment_view, name='psychometric_assessment'),
    path('physical/', assessment_views.physical_assessment_view, name='physical_assessment'),
    path('reports/', assessment_views.assessment_reports_view, name='assessment_reports'),
    
    # Framework Management
    path('academic-frameworks/', assessment_views.academic_framework_management, name='academic_frameworks'),
    path('pe-frameworks/', assessment_views.physical_framework_management, name='pe_frameworks'),
    path('psychological-frameworks/', assessment_views.psychological_framework_management, name='psychological_frameworks'),
    path('career-frameworks/', assessment_views.career_framework_management, name='career_frameworks'),
    
    # Comprehensive Assessment
    path('create/', assessment_views.comprehensive_assessment_view, name='create_assessment'),
    path('create/<int:student_id>/', assessment_views.comprehensive_assessment_view, name='create_student_assessment'),
    path('view/<int:assessment_id>/', assessment_views.view_assessment, name='view_assessment'),
    
    # Assessment Workflow URLs
    path('workflows/', workflow_views.workflow_dashboard, name='workflow_dashboard'),
    path('workflows/select/', workflow_views.select_workflow, name='select_workflow'),
    path('workflows/list/', workflow_views.workflow_list, name='workflow_list'),
    path('workflow/<int:workflow_id>/', workflow_views.workflow_detail, name='workflow_detail'),
    path('workflow/<int:workflow_id>/start/', workflow_views.start_workflow, name='start_workflow'),
    path('workflow/<int:workflow_id>/step/<int:step_number>/', workflow_views.workflow_step, name='workflow_step'),
    path('workflow/<int:workflow_id>/results/', workflow_views.workflow_results, name='workflow_results'),
    path('workflow/<int:workflow_id>/generate-report/', workflow_views.generate_report, name='generate_report'),
    path('workflow/<int:workflow_id>/report/<int:report_id>/download/', workflow_views.download_report, name='download_report'),
    
    # Psychometric Testing URLs
    path('psychometric/', psychometric_views.psychometric_dashboard, name='psychometric_dashboard'),
    path('psychometric/student/<int:student_id>/recommendations/', psychometric_views.student_recommendations, name='student_recommendations'),
    path('psychometric/recommendation/<int:recommendation_id>/respond/', psychometric_views.respond_to_recommendation, name='respond_to_recommendation'),
    path('psychometric/session/<int:session_id>/start/', psychometric_views.start_test_session, name='start_test_session'),
    path('psychometric/session/<int:session_id>/question/<int:question_number>/', psychometric_views.test_question, name='test_question'),
    path('psychometric/session/<int:session_id>/complete/', psychometric_views.complete_test_session, name='complete_test_session'),
    path('psychometric/session/<int:session_id>/results/', psychometric_views.test_results, name='test_results'),
    
    # Workflow API Endpoints
    path('api/workflow/<int:workflow_id>/progress/', workflow_views.api_workflow_progress, name='api_workflow_progress'),
    
    # Psychometric API Endpoints
    path('api/psychometric/trigger-recommendations/', psychometric_views.api_trigger_recommendations, name='api_trigger_recommendations'),
    path('api/psychometric/notifications/', psychometric_views.api_get_notifications, name='api_get_notifications'),
    
    # ML and API endpoints
    path('api/ml-prediction/', assessment_views.ml_prediction_api, name='ml_prediction_api'),
    
    # Guest Assessment URLs
    path('guest/', guest_views.guest_assessment_landing, name='guest_assessment_landing'),
    path('guest/form/', guest_views.guest_assessment_form, name='guest_assessment_form'),
    path('guest/upload/<str:session_id>/', guest_views.guest_assessment_upload, name='guest_assessment_upload'),
    path('guest/workflow/<str:session_id>/', guest_views.guest_assessment_workflow, name='guest_assessment_workflow'),
    path('guest/results/<str:session_id>/', guest_views.guest_assessment_results, name='guest_assessment_results'),
    path('guest/career-mapping/<str:session_id>/', guest_views.guest_career_mapping, name='guest_career_mapping'),
    path('guest/career-results/<str:session_id>/', guest_views.guest_career_results, name='guest_career_results'),
    path('guest/download/<str:session_id>/', guest_views.guest_download_report, name='guest_download_report'),
    path('guest/api/', guest_views.guest_assessment_api, name='guest_assessment_api'),
    
    # Career Mapping URLs
    path('career-mapping/', career_mapping_views.career_mapping_dashboard, name='career_mapping_dashboard'),
    path('career-mapping/form/<int:student_id>/', career_mapping_views.career_mapping_form, name='career_mapping_form'),
    path('career-mapping/results/<int:student_id>/', career_mapping_views.career_mapping_results, name='career_mapping_results'),
    path('career-mapping/visualization/<int:student_id>/', career_mapping_views.career_path_visualization, name='career_path_visualization'),
    path('career-mapping/skill-gaps/<int:student_id>/', career_mapping_views.skill_gap_analysis, name='skill_gap_analysis'),
    path('career-mapping/roadmap/<int:student_id>/<str:career_id>/', career_mapping_views.career_roadmap, name='career_roadmap'),
    path('career-mapping/ai-config/<int:student_id>/', career_mapping_views.ai_analysis_configuration, name='ai_analysis_configuration'),
    path('career-mapping/ai-results/<int:student_id>/', career_mapping_views.ai_analysis_results, name='ai_analysis_results'),
    
    # Career Mapping API URLs
    path('api/career-mapping/<int:student_id>/', career_mapping_views.career_mapping_api, name='career_mapping_api'),
    path('api/career-recommendations/<int:student_id>/', career_mapping_views.career_recommendations_api, name='career_recommendations_api'),
    path('api/skill-analysis/<int:student_id>/', career_mapping_views.skill_analysis_api, name='skill_analysis_api'),
    path('api/career-path/<int:student_id>/<str:career_id>/', career_mapping_views.career_path_api, name='career_path_api'),
    
    # ==================== CRUD OPERATIONS ====================
    
    # Subjects CRUD
    path('subjects/', crud_views.SubjectListView.as_view(), name='subject_list'),
    path('subjects/create/', crud_views.SubjectCreateView.as_view(), name='subject_create'),
    path('subjects/<int:pk>/edit/', crud_views.SubjectUpdateView.as_view(), name='subject_update'),
    path('subjects/<int:pk>/delete/', crud_views.SubjectDeleteView.as_view(), name='subject_delete'),
    
    # Calendar CRUD
    path('calendar/', crud_views.CalendarListView.as_view(), name='calendar_list'),
    path('calendar/create/', crud_views.CalendarCreateView.as_view(), name='calendar_create'),
    path('calendar/<int:pk>/edit/', crud_views.CalendarUpdateView.as_view(), name='calendar_update'),
    path('calendar/<int:pk>/delete/', crud_views.CalendarDeleteView.as_view(), name='calendar_delete'),
    
    # Exams CRUD
    path('exams/', crud_views.ExamListView.as_view(), name='exam_list'),
    path('exams/create/', crud_views.ExamCreateView.as_view(), name='exam_create'),
    path('exams/<int:pk>/edit/', crud_views.ExamUpdateView.as_view(), name='exam_update'),
    path('exams/<int:pk>/delete/', crud_views.ExamDeleteView.as_view(), name='exam_delete'),
    
    # Progress CRUD
    path('progress/', crud_views.ProgressListView.as_view(), name='progress_list'),
    path('progress/create/', crud_views.ProgressCreateView.as_view(), name='progress_create'),
    path('progress/<int:pk>/edit/', crud_views.ProgressUpdateView.as_view(), name='progress_update'),
    path('progress/<int:pk>/delete/', crud_views.ProgressDeleteView.as_view(), name='progress_delete'),
    
    # Curriculum CRUD
    path('curriculum/', crud_views.CurriculumListView.as_view(), name='curriculum_list'),
    path('curriculum/create/', crud_views.CurriculumCreateView.as_view(), name='curriculum_create'),
    path('curriculum/<int:pk>/edit/', crud_views.CurriculumUpdateView.as_view(), name='curriculum_update'),
    path('curriculum/<int:pk>/delete/', crud_views.CurriculumDeleteView.as_view(), name='curriculum_delete'),
    
    # Skills CRUD
    path('skills/', crud_views.SkillListView.as_view(), name='skill_list'),
    path('skills/create/', crud_views.SkillCreateView.as_view(), name='skill_create'),
    path('skills/<int:pk>/edit/', crud_views.SkillUpdateView.as_view(), name='skill_update'),
    path('skills/<int:pk>/delete/', crud_views.SkillDeleteView.as_view(), name='skill_delete'),
    
    # Templates CRUD
    path('templates/', crud_views.TemplateListView.as_view(), name='template_list'),
    path('templates/create/', crud_views.TemplateCreateView.as_view(), name='template_create'),
    path('templates/<int:pk>/edit/', crud_views.TemplateUpdateView.as_view(), name='template_update'),
    path('templates/<int:pk>/delete/', crud_views.TemplateDeleteView.as_view(), name='template_delete'),
    
    # Maintenance CRUD
    path('maintenance/', crud_views.MaintenanceListView.as_view(), name='maintenance_list'),
    path('maintenance/create/', crud_views.MaintenanceCreateView.as_view(), name='maintenance_create'),
    path('maintenance/<int:pk>/edit/', crud_views.MaintenanceUpdateView.as_view(), name='maintenance_update'),
    path('maintenance/<int:pk>/delete/', crud_views.MaintenanceDeleteView.as_view(), name='maintenance_delete'),
    
    # ==================== API ENDPOINTS ====================
    
    # CRUD API endpoints
    path('api/subjects/', crud_views.get_subjects_api, name='api_subjects'),
    path('api/students/', crud_views.get_students_api, name='api_students'),
    path('api/export/', crud_views.export_data_api, name='api_export'),
    path('api/dashboard-analytics/', crud_views.dashboard_analytics_api, name='api_dashboard_analytics'),
    
    # Test Catalog API endpoints
    path('api/test-catalog/', test_catalog_views.TestCatalogAPIView.as_view(), name='api_test_catalog'),
    path('api/test-catalog/<int:test_id>/', test_catalog_views.TestDetailAPIView.as_view(), name='api_test_detail'),
    path('api/test-catalog/stats/', test_catalog_views.TestStatsAPIView.as_view(), name='api_test_stats'),
    path('api/test-categories/', test_catalog_views.test_categories_api, name='api_test_categories'),
]