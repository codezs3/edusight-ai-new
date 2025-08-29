"""
Assessment Workflow Models for Different Pricing Plans
Handles Basic, Premium, and Enterprise assessment workflows
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import json
from decimal import Decimal

User = get_user_model()


class PricingPlan(models.Model):
    """Pricing plans for different assessment levels"""
    
    PLAN_TYPES = [
        ('basic', 'Basic Plan'),
        ('premium', 'Premium Plan'),
        ('enterprise', 'Enterprise Plan'),
    ]
    
    name = models.CharField(max_length=50)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    duration_months = models.IntegerField(default=12)
    
    # Features included
    academic_assessments = models.BooleanField(default=True)
    physical_assessments = models.BooleanField(default=False)
    psychological_assessments = models.BooleanField(default=False)
    career_mapping = models.BooleanField(default=False)
    ml_predictions = models.BooleanField(default=False)
    advanced_analytics = models.BooleanField(default=False)
    custom_reports = models.BooleanField(default=False)
    priority_support = models.BooleanField(default=False)
    
    # Limits
    max_students = models.IntegerField(default=1)
    max_assessments_per_month = models.IntegerField(default=5)
    max_reports_per_month = models.IntegerField(default=2)
    
    # Additional features
    features_list = models.JSONField(default=list)
    limitations = models.JSONField(default=list)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_plan_type_display()}"
    
    @classmethod
    def get_basic_plan(cls):
        """Get or create basic plan"""
        plan, created = cls.objects.get_or_create(
            plan_type='basic',
            defaults={
                'name': 'Basic Assessment',
                'price': Decimal('29.99'),
                'academic_assessments': True,
                'max_students': 1,
                'max_assessments_per_month': 5,
                'max_reports_per_month': 2,
                'features_list': [
                    'Academic Performance Assessment',
                    'Basic Progress Tracking',
                    'Standard Reports (PDF)',
                    'Email Support',
                    'Mobile Access'
                ],
                'limitations': [
                    'Limited to 1 student',
                    'Academic assessments only',
                    'Basic reporting',
                    'No ML predictions'
                ]
            }
        )
        return plan
    
    @classmethod
    def get_premium_plan(cls):
        """Get or create premium plan"""
        plan, created = cls.objects.get_or_create(
            plan_type='premium',
            defaults={
                'name': 'Premium Assessment',
                'price': Decimal('79.99'),
                'academic_assessments': True,
                'physical_assessments': True,
                'psychological_assessments': True,
                'career_mapping': True,
                'ml_predictions': True,
                'max_students': 3,
                'max_assessments_per_month': 15,
                'max_reports_per_month': 8,
                'features_list': [
                    'All Basic Plan Features',
                    'Physical Education Assessment',
                    'Psychological Assessment (SEL)',
                    'Career Mapping & Guidance',
                    'AI-Powered Predictions',
                    'Advanced Progress Analytics',
                    'Interactive Charts & Graphs',
                    'Priority Email Support',
                    'Up to 3 students'
                ],
                'limitations': [
                    'Limited to 3 students',
                    'Standard ML models',
                    'Pre-built reports only'
                ]
            }
        )
        return plan
    
    @classmethod
    def get_enterprise_plan(cls):
        """Get or create enterprise plan"""
        plan, created = cls.objects.get_or_create(
            plan_type='enterprise',
            defaults={
                'name': 'Enterprise Assessment',
                'price': Decimal('199.99'),
                'academic_assessments': True,
                'physical_assessments': True,
                'psychological_assessments': True,
                'career_mapping': True,
                'ml_predictions': True,
                'advanced_analytics': True,
                'custom_reports': True,
                'priority_support': True,
                'max_students': 10,
                'max_assessments_per_month': 50,
                'max_reports_per_month': 25,
                'features_list': [
                    'All Premium Plan Features',
                    'Advanced ML Models',
                    'Custom Report Builder',
                    'Bulk Assessment Processing',
                    'API Access',
                    'Advanced Analytics Dashboard',
                    'Custom Framework Integration',
                    'Dedicated Support Manager',
                    'Phone & Video Support',
                    'Up to 10 students',
                    'White-label Options'
                ],
                'limitations': [
                    'Custom pricing for 10+ students'
                ]
            }
        )
        return plan


class AssessmentWorkflow(models.Model):
    """Main workflow for managing assessment processes"""
    
    WORKFLOW_TYPES = [
        ('basic_academic', 'Basic Academic Assessment'),
        ('premium_comprehensive', 'Premium Comprehensive Assessment'),
        ('enterprise_advanced', 'Enterprise Advanced Assessment'),
    ]
    
    WORKFLOW_STATUS = [
        ('draft', 'Draft'),
        ('in_progress', 'In Progress'),
        ('review', 'Under Review'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=100)
    workflow_type = models.CharField(max_length=30, choices=WORKFLOW_TYPES)
    pricing_plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=WORKFLOW_STATUS, default='draft')
    current_step = models.IntegerField(default=1)
    total_steps = models.IntegerField(default=5)
    
    # Workflow configuration
    workflow_config = models.JSONField(default=dict)
    assessment_data = models.JSONField(default=dict)
    results = models.JSONField(default=dict)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.student.user.get_full_name()}"
    
    def start_workflow(self):
        """Start the assessment workflow"""
        self.status = 'in_progress'
        self.started_at = timezone.now()
        self.current_step = 1
        self.save()
    
    def complete_step(self, step_data):
        """Complete current step and move to next"""
        if self.current_step < self.total_steps:
            self.current_step += 1
        else:
            self.status = 'completed'
            self.completed_at = timezone.now()
        
        # Store step data
        step_key = f'step_{self.current_step - 1}'
        self.assessment_data[step_key] = step_data
        self.save()
    
    def get_progress_percentage(self):
        """Calculate workflow progress percentage"""
        return (self.current_step - 1) / self.total_steps * 100
    
    def get_allowed_assessments(self):
        """Get allowed assessment types based on pricing plan"""
        assessments = []
        if self.pricing_plan.academic_assessments:
            assessments.append('academic')
        if self.pricing_plan.physical_assessments:
            assessments.append('physical')
        if self.pricing_plan.psychological_assessments:
            assessments.append('psychological')
        return assessments


class WorkflowStep(models.Model):
    """Individual steps within an assessment workflow"""
    
    STEP_TYPES = [
        ('data_upload', 'Data Upload'),
        ('academic_assessment', 'Academic Assessment'),
        ('physical_assessment', 'Physical Assessment'),
        ('psychological_assessment', 'Psychological Assessment'),
        ('ml_analysis', 'ML Analysis'),
        ('review_results', 'Review Results'),
        ('generate_report', 'Generate Report'),
    ]
    
    STEP_STATUS = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('skipped', 'Skipped'),
    ]
    
    workflow = models.ForeignKey(AssessmentWorkflow, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    step_type = models.CharField(max_length=30, choices=STEP_TYPES)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    status = models.CharField(max_length=20, choices=STEP_STATUS, default='pending')
    is_required = models.BooleanField(default=True)
    estimated_duration = models.IntegerField(default=10)  # minutes
    
    # Step configuration
    form_config = models.JSONField(default=dict)
    validation_rules = models.JSONField(default=dict)
    step_data = models.JSONField(default=dict)
    
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['step_number']
        unique_together = ['workflow', 'step_number']
    
    def __str__(self):
        return f"Step {self.step_number}: {self.title}"
    
    def complete_step(self, data=None):
        """Mark step as completed"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        if data:
            self.step_data = data
        self.save()


class AssessmentForm(models.Model):
    """Dynamic forms for different assessment types and plans"""
    
    FORM_TYPES = [
        ('academic_basic', 'Basic Academic Form'),
        ('academic_premium', 'Premium Academic Form'),
        ('academic_enterprise', 'Enterprise Academic Form'),
        ('physical_premium', 'Premium Physical Form'),
        ('physical_enterprise', 'Enterprise Physical Form'),
        ('psychological_premium', 'Premium Psychological Form'),
        ('psychological_enterprise', 'Enterprise Psychological Form'),
        ('career_premium', 'Premium Career Form'),
        ('career_enterprise', 'Enterprise Career Form'),
    ]
    
    name = models.CharField(max_length=100)
    form_type = models.CharField(max_length=30, choices=FORM_TYPES)
    pricing_plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE)
    
    # Form structure
    form_schema = models.JSONField(default=dict)  # JSON schema for form fields
    validation_rules = models.JSONField(default=dict)
    scoring_configuration = models.JSONField(default=dict)
    
    # Metadata
    description = models.TextField(blank=True)
    estimated_time = models.IntegerField(default=15)  # minutes
    version = models.CharField(max_length=10, default='1.0')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_form_type_display()}"
    
    def get_form_fields(self):
        """Get form fields from schema"""
        return self.form_schema.get('fields', [])
    
    def validate_submission(self, data):
        """Validate form submission against rules"""
        errors = []
        rules = self.validation_rules
        
        for field_name, field_rules in rules.items():
            if field_name in data:
                value = data[field_name]
                
                # Required field validation
                if field_rules.get('required', False) and not value:
                    errors.append(f"{field_name} is required")
                
                # Range validation
                if 'min_value' in field_rules and value < field_rules['min_value']:
                    errors.append(f"{field_name} must be at least {field_rules['min_value']}")
                
                if 'max_value' in field_rules and value > field_rules['max_value']:
                    errors.append(f"{field_name} must be at most {field_rules['max_value']}")
        
        return errors
    
    def calculate_score(self, data):
        """Calculate assessment score based on configuration"""
        scoring = self.scoring_configuration
        total_score = 0
        max_score = 0
        
        for field_name, field_scoring in scoring.items():
            if field_name in data:
                value = data[field_name]
                weight = field_scoring.get('weight', 1)
                max_value = field_scoring.get('max_value', 100)
                
                field_score = (value / max_value) * 100 * weight
                total_score += field_score
                max_score += 100 * weight
        
        return (total_score / max_score * 100) if max_score > 0 else 0


class FormSubmission(models.Model):
    """Individual form submissions within workflows"""
    
    workflow = models.ForeignKey(AssessmentWorkflow, on_delete=models.CASCADE)
    form = models.ForeignKey(AssessmentForm, on_delete=models.CASCADE)
    step = models.ForeignKey(WorkflowStep, on_delete=models.CASCADE, null=True)
    
    # Submission data
    submission_data = models.JSONField(default=dict)
    calculated_scores = models.JSONField(default=dict)
    validation_errors = models.JSONField(default=list)
    
    # Status
    is_valid = models.BooleanField(default=False)
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.form.name} - {self.workflow.student.user.get_full_name()}"
    
    def validate_and_score(self):
        """Validate submission and calculate scores"""
        self.validation_errors = self.form.validate_submission(self.submission_data)
        self.is_valid = len(self.validation_errors) == 0
        
        if self.is_valid:
            self.calculated_scores = {
                'overall_score': self.form.calculate_score(self.submission_data),
                'detailed_scores': self._calculate_detailed_scores()
            }
        
        self.save()
        return self.is_valid
    
    def _calculate_detailed_scores(self):
        """Calculate detailed scores by category"""
        detailed = {}
        scoring = self.form.scoring_configuration
        
        # Group scores by category
        categories = {}
        for field_name, field_scoring in scoring.items():
            category = field_scoring.get('category', 'general')
            if category not in categories:
                categories[category] = {'total': 0, 'max': 0, 'count': 0}
            
            if field_name in self.submission_data:
                value = self.submission_data[field_name]
                weight = field_scoring.get('weight', 1)
                max_value = field_scoring.get('max_value', 100)
                
                field_score = (value / max_value) * 100 * weight
                categories[category]['total'] += field_score
                categories[category]['max'] += 100 * weight
                categories[category]['count'] += 1
        
        # Calculate category averages
        for category, data in categories.items():
            if data['max'] > 0:
                detailed[category] = data['total'] / data['max'] * 100
        
        return detailed
    
    def submit(self):
        """Submit the form"""
        if self.is_valid:
            self.is_submitted = True
            self.submitted_at = timezone.now()
            self.save()
            
            # Complete the associated workflow step
            if self.step:
                self.step.complete_step(self.submission_data)
            
            return True
        return False


class AssessmentReport(models.Model):
    """Generated reports for completed assessments"""
    
    REPORT_TYPES = [
        ('basic', 'Basic Report'),
        ('comprehensive', 'Comprehensive Report'),
        ('detailed', 'Detailed Report'),
        ('custom', 'Custom Report'),
    ]
    
    REPORT_STATUS = [
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    workflow = models.ForeignKey(AssessmentWorkflow, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    
    # Report content
    report_data = models.JSONField(default=dict)
    summary = models.TextField(blank=True)
    recommendations = models.JSONField(default=list)
    
    # File handling
    pdf_file = models.FileField(upload_to='assessment_reports/', null=True, blank=True)
    file_size = models.IntegerField(default=0)
    
    status = models.CharField(max_length=20, choices=REPORT_STATUS, default='generating')
    generated_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.workflow.student.user.get_full_name()}"
    
    def generate_report(self):
        """Generate the assessment report"""
        try:
            self.status = 'generating'
            self.save()
            
            # Collect all assessment data
            report_data = self._compile_report_data()
            
            # Generate PDF using enhanced PDF service
            from parent_dashboard.pdf_service import EnhancedPDFService
            pdf_service = EnhancedPDFService()
            
            pdf_buffer = pdf_service.generate_comprehensive_report(
                report_data,
                include_ml_insights=self.workflow.pricing_plan.ml_predictions,
                include_benchmarks=True
            )
            
            # Save PDF file
            filename = f"assessment_report_{self.workflow.id}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            self.pdf_file.save(filename, pdf_buffer, save=False)
            self.file_size = pdf_buffer.getbuffer().nbytes
            
            self.status = 'completed'
            self.generated_at = timezone.now()
            self.save()
            
            return True
            
        except Exception as e:
            self.status = 'failed'
            self.save()
            return False
    
    def _compile_report_data(self):
        """Compile comprehensive report data"""
        workflow = self.workflow
        student = workflow.student
        
        # Basic student information
        report_data = {
            'student_info': {
                'name': student.user.get_full_name(),
                'grade': student.grade,
                'age': self._calculate_age(student.date_of_birth) if student.date_of_birth else None,
                'assessment_date': workflow.completed_at.strftime('%B %d, %Y') if workflow.completed_at else 'In Progress'
            },
            'workflow_info': {
                'type': workflow.get_workflow_type_display(),
                'plan': workflow.pricing_plan.name,
                'duration': self._calculate_duration(workflow.started_at, workflow.completed_at)
            }
        }
        
        # Compile assessment results
        submissions = FormSubmission.objects.filter(workflow=workflow, is_submitted=True)
        
        assessment_results = {}
        for submission in submissions:
            form_type = submission.form.form_type
            if 'academic' in form_type:
                assessment_results['academic'] = submission.calculated_scores
            elif 'physical' in form_type:
                assessment_results['physical'] = submission.calculated_scores
            elif 'psychological' in form_type:
                assessment_results['psychological'] = submission.calculated_scores
            elif 'career' in form_type:
                assessment_results['career'] = submission.calculated_scores
        
        report_data['assessment_results'] = assessment_results
        
        # Add ML insights if available
        if workflow.pricing_plan.ml_predictions and workflow.results.get('ml_insights'):
            report_data['ml_insights'] = workflow.results['ml_insights']
        
        return report_data
    
    def _calculate_age(self, birth_date):
        """Calculate age from birth date"""
        today = timezone.now().date()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    def _calculate_duration(self, start_time, end_time):
        """Calculate assessment duration"""
        if start_time and end_time:
            duration = end_time - start_time
            return f"{duration.days} days, {duration.seconds // 3600} hours"
        return "Not completed"
