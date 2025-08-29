"""
Dynamic Django Forms for Assessment Workflows
Supports Basic, Premium, and Enterprise pricing plans
"""

from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from .workflow_models import AssessmentWorkflow, WorkflowStep, FormSubmission, PricingPlan
from students.models import Student
import json


class BaseAssessmentForm(forms.Form):
    """Base form class for all assessment types"""
    
    def __init__(self, *args, **kwargs):
        self.pricing_plan = kwargs.pop('pricing_plan', None)
        self.workflow = kwargs.pop('workflow', None)
        super().__init__(*args, **kwargs)
        
        # Add common CSS classes
        for field_name, field in self.fields.items():
            field.widget.attrs.update({
                'class': 'form-control assessment-field',
                'data-field-type': field.__class__.__name__.lower()
            })
    
    def add_likert_field(self, field_name, label, help_text=""):
        """Add a 5-point Likert scale field"""
        choices = [
            (1, 'Strongly Disagree'),
            (2, 'Disagree'),
            (3, 'Neutral'),
            (4, 'Agree'),
            (5, 'Strongly Agree'),
        ]
        self.fields[field_name] = forms.ChoiceField(
            label=label,
            choices=choices,
            widget=forms.RadioSelect(attrs={
                'class': 'likert-scale',
                'data-field-category': 'likert'
            }),
            help_text=help_text,
            required=True
        )
    
    def add_rating_field(self, field_name, label, min_val=1, max_val=10, help_text=""):
        """Add a numeric rating field"""
        self.fields[field_name] = forms.IntegerField(
            label=label,
            min_value=min_val,
            max_value=max_val,
            widget=forms.NumberInput(attrs={
                'class': 'form-control rating-input',
                'data-field-category': 'rating',
                'min': min_val,
                'max': max_val,
                'step': 1
            }),
            help_text=f"{help_text} (Scale: {min_val}-{max_val})",
            required=True
        )
    
    def add_percentage_field(self, field_name, label, help_text=""):
        """Add a percentage field (0-100)"""
        self.fields[field_name] = forms.DecimalField(
            label=label,
            min_value=0,
            max_value=100,
            decimal_places=1,
            widget=forms.NumberInput(attrs={
                'class': 'form-control percentage-input',
                'data-field-category': 'percentage',
                'min': 0,
                'max': 100,
                'step': 0.1,
                'placeholder': 'Enter percentage (0-100)'
            }),
            help_text=help_text,
            required=True
        )


class AcademicAssessmentForm(BaseAssessmentForm):
    """Academic assessment form - varies by pricing plan"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._setup_academic_fields()
    
    def _setup_academic_fields(self):
        """Setup fields based on pricing plan"""
        plan_type = self.pricing_plan.plan_type if self.pricing_plan else 'basic'
        
        # Basic academic fields (all plans)
        self._add_basic_academic_fields()
        
        # Premium and Enterprise additional fields
        if plan_type in ['premium', 'enterprise']:
            self._add_premium_academic_fields()
        
        # Enterprise exclusive fields
        if plan_type == 'enterprise':
            self._add_enterprise_academic_fields()
    
    def _add_basic_academic_fields(self):
        """Basic academic assessment fields"""
        
        # Core Subject Performance
        subjects = ['Mathematics', 'Science', 'English', 'Social Studies']
        for subject in subjects:
            self.add_percentage_field(
                f'{subject.lower().replace(" ", "_")}_performance',
                f'{subject} Performance',
                f'Current performance level in {subject}'
            )
        
        # Study Habits
        study_habits = [
            ('homework_completion', 'Completes homework on time'),
            ('class_participation', 'Actively participates in class'),
            ('note_taking', 'Takes organized notes'),
            ('time_management', 'Manages study time effectively'),
        ]
        
        for field_name, label in study_habits:
            self.add_likert_field(field_name, label)
        
        # Learning Preferences
        learning_styles = [
            ('visual', 'Visual Learning'),
            ('auditory', 'Auditory Learning'),
            ('kinesthetic', 'Hands-on Learning'),
            ('reading', 'Reading/Writing Learning'),
        ]
        
        for style, label in learning_styles:
            self.add_rating_field(
                f'learning_style_{style}',
                label,
                help_text=f'Rate preference for {label.lower()}'
            )
    
    def _add_premium_academic_fields(self):
        """Premium plan additional academic fields"""
        
        # Advanced Subject Areas
        advanced_subjects = ['Foreign Language', 'Arts', 'Technology', 'Critical Thinking']
        for subject in advanced_subjects:
            self.add_percentage_field(
                f'{subject.lower().replace(" ", "_")}_performance',
                f'{subject} Performance'
            )
        
        # Learning Difficulties Assessment
        difficulties = [
            ('reading_comprehension', 'Reading comprehension challenges'),
            ('mathematical_reasoning', 'Mathematical reasoning difficulties'),
            ('attention_focus', 'Attention and focus issues'),
            ('memory_retention', 'Memory retention problems'),
        ]
        
        for field_name, label in difficulties:
            self.add_likert_field(field_name, label)
        
        # Motivation and Engagement
        motivation_factors = [
            ('intrinsic_motivation', 'Self-motivated to learn'),
            ('goal_orientation', 'Sets and works toward academic goals'),
            ('challenge_seeking', 'Seeks challenging academic tasks'),
            ('persistence', 'Persists through difficult problems'),
        ]
        
        for field_name, label in motivation_factors:
            self.add_likert_field(field_name, label)
    
    def _add_enterprise_academic_fields(self):
        """Enterprise plan exclusive academic fields"""
        
        # Cognitive Skills Assessment
        cognitive_skills = [
            ('analytical_thinking', 'Analytical Thinking'),
            ('creative_problem_solving', 'Creative Problem Solving'),
            ('logical_reasoning', 'Logical Reasoning'),
            ('spatial_intelligence', 'Spatial Intelligence'),
        ]
        
        for skill, label in cognitive_skills:
            self.add_rating_field(f'cognitive_{skill}', label, max_val=10)
        
        # Advanced Learning Strategies
        strategies = [
            ('metacognitive_awareness', 'Aware of own learning process'),
            ('self_regulation', 'Self-regulates learning behavior'),
            ('transfer_learning', 'Applies knowledge to new situations'),
            ('collaborative_learning', 'Learns effectively in groups'),
        ]
        
        for field_name, label in strategies:
            self.add_likert_field(field_name, label)
        
        # Future Academic Planning
        planning_fields = [
            ('career_awareness', 'Has clear career goals'),
            ('higher_education_interest', 'Interested in higher education'),
            ('skill_development_focus', 'Focuses on developing specific skills'),
            ('leadership_potential', 'Shows leadership potential'),
        ]
        
        for field_name, label in planning_fields:
            self.add_likert_field(field_name, label)


class PhysicalEducationForm(BaseAssessmentForm):
    """Physical Education assessment form - Premium and Enterprise only"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.pricing_plan or not self.pricing_plan.physical_assessments:
            raise ValidationError("Physical assessments not available in current plan")
        self._setup_physical_fields()
    
    def _setup_physical_fields(self):
        """Setup physical education fields"""
        plan_type = self.pricing_plan.plan_type
        
        # Core physical fields (Premium and Enterprise)
        self._add_core_physical_fields()
        
        # Enterprise additional fields
        if plan_type == 'enterprise':
            self._add_enterprise_physical_fields()
    
    def _add_core_physical_fields(self):
        """Core physical education fields"""
        
        # Basic Fitness Metrics
        fitness_metrics = [
            ('cardiovascular_endurance', 'Cardiovascular Endurance'),
            ('muscular_strength', 'Muscular Strength'),
            ('flexibility', 'Flexibility'),
            ('coordination', 'Coordination'),
            ('balance', 'Balance'),
        ]
        
        for metric, label in fitness_metrics:
            self.add_rating_field(f'fitness_{metric}', label, max_val=10)
        
        # Sports and Activities
        activities = [
            ('team_sports', 'Team Sports Participation'),
            ('individual_sports', 'Individual Sports'),
            ('outdoor_activities', 'Outdoor Activities'),
            ('fitness_training', 'Fitness Training'),
        ]
        
        for activity, label in activities:
            self.add_likert_field(f'activity_{activity}', f'Enjoys {label}')
        
        # Physical Health Habits
        health_habits = [
            ('regular_exercise', 'Exercises regularly'),
            ('healthy_diet', 'Maintains healthy diet'),
            ('adequate_sleep', 'Gets adequate sleep'),
            ('stress_management', 'Manages stress through physical activity'),
        ]
        
        for habit, label in health_habits:
            self.add_likert_field(f'health_{habit}', label)
    
    def _add_enterprise_physical_fields(self):
        """Enterprise exclusive physical fields"""
        
        # Advanced Motor Skills
        motor_skills = [
            ('fine_motor_control', 'Fine Motor Control'),
            ('gross_motor_skills', 'Gross Motor Skills'),
            ('reaction_time', 'Reaction Time'),
            ('agility', 'Agility'),
        ]
        
        for skill, label in motor_skills:
            self.add_rating_field(f'motor_{skill}', label, max_val=10)
        
        # Sports Performance Analysis
        performance_areas = [
            ('technical_skills', 'Technical Skills in Sports'),
            ('tactical_understanding', 'Tactical Understanding'),
            ('mental_toughness', 'Mental Toughness'),
            ('teamwork_skills', 'Teamwork Skills'),
        ]
        
        for area, label in performance_areas:
            self.add_rating_field(f'sports_{area}', label, max_val=10)


class PsychologicalAssessmentForm(BaseAssessmentForm):
    """Psychological assessment form - Premium and Enterprise only"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.pricing_plan or not self.pricing_plan.psychological_assessments:
            raise ValidationError("Psychological assessments not available in current plan")
        self._setup_psychological_fields()
    
    def _setup_psychological_fields(self):
        """Setup psychological assessment fields"""
        plan_type = self.pricing_plan.plan_type
        
        # Core psychological fields
        self._add_core_psychological_fields()
        
        # Enterprise additional fields
        if plan_type == 'enterprise':
            self._add_enterprise_psychological_fields()
    
    def _add_core_psychological_fields(self):
        """Core psychological assessment fields"""
        
        # Social-Emotional Learning (SEL)
        sel_components = [
            ('self_awareness', 'Understands own emotions'),
            ('self_management', 'Manages emotions effectively'),
            ('social_awareness', 'Recognizes others\' emotions'),
            ('relationship_skills', 'Builds positive relationships'),
            ('responsible_decision_making', 'Makes responsible decisions'),
        ]
        
        for component, label in sel_components:
            self.add_likert_field(f'sel_{component}', label)
        
        # Behavioral Patterns
        behaviors = [
            ('attention_span', 'Maintains attention for appropriate periods'),
            ('impulse_control', 'Controls impulses effectively'),
            ('emotional_regulation', 'Regulates emotions appropriately'),
            ('social_interaction', 'Interacts well with peers'),
        ]
        
        for behavior, label in behaviors:
            self.add_likert_field(f'behavior_{behavior}', label)
        
        # Stress and Coping
        coping_mechanisms = [
            ('stress_recognition', 'Recognizes stress signals'),
            ('coping_strategies', 'Uses healthy coping strategies'),
            ('resilience', 'Bounces back from setbacks'),
            ('help_seeking', 'Seeks help when needed'),
        ]
        
        for mechanism, label in coping_mechanisms:
            self.add_likert_field(f'coping_{mechanism}', label)
    
    def _add_enterprise_psychological_fields(self):
        """Enterprise exclusive psychological fields"""
        
        # Advanced Psychological Traits
        traits = [
            ('emotional_intelligence', 'Emotional Intelligence'),
            ('empathy', 'Empathy'),
            ('leadership_qualities', 'Leadership Qualities'),
            ('creativity', 'Creativity'),
            ('adaptability', 'Adaptability'),
        ]
        
        for trait, label in traits:
            self.add_rating_field(f'trait_{trait}', label, max_val=10)
        
        # Personality Factors (Big Five simplified)
        personality_factors = [
            ('openness', 'Open to new experiences'),
            ('conscientiousness', 'Organized and responsible'),
            ('extraversion', 'Outgoing and social'),
            ('agreeableness', 'Cooperative and trusting'),
            ('emotional_stability', 'Emotionally stable'),
        ]
        
        for factor, label in personality_factors:
            self.add_likert_field(f'personality_{factor}', label)


class CareerMappingForm(BaseAssessmentForm):
    """Career mapping form - Premium and Enterprise only"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.pricing_plan or not self.pricing_plan.career_mapping:
            raise ValidationError("Career mapping not available in current plan")
        self._setup_career_fields()
    
    def _setup_career_fields(self):
        """Setup career mapping fields"""
        plan_type = self.pricing_plan.plan_type
        
        # Core career fields
        self._add_core_career_fields()
        
        # Enterprise additional fields
        if plan_type == 'enterprise':
            self._add_enterprise_career_fields()
    
    def _add_core_career_fields(self):
        """Core career mapping fields"""
        
        # Interest Areas (RIASEC Model)
        riasec_interests = [
            ('realistic', 'Hands-on, practical activities'),
            ('investigative', 'Research and analytical work'),
            ('artistic', 'Creative and artistic expression'),
            ('social', 'Helping and working with people'),
            ('enterprising', 'Leadership and business'),
            ('conventional', 'Organized, detail-oriented work'),
        ]
        
        for interest, label in riasec_interests:
            self.add_rating_field(f'interest_{interest}', f'Interest in: {label}', max_val=10)
        
        # Skills Assessment
        key_skills = [
            ('communication', 'Communication Skills'),
            ('problem_solving', 'Problem Solving'),
            ('teamwork', 'Teamwork'),
            ('leadership', 'Leadership'),
            ('technology', 'Technology Skills'),
        ]
        
        for skill, label in key_skills:
            self.add_rating_field(f'skill_{skill}', label, max_val=10)
        
        # Career Values
        values = [
            ('work_life_balance', 'Work-life balance is important'),
            ('financial_security', 'Financial security is a priority'),
            ('helping_others', 'Helping others is meaningful'),
            ('creativity', 'Creative expression is valued'),
            ('stability', 'Job stability is important'),
        ]
        
        for value, label in values:
            self.add_likert_field(f'value_{value}', label)
    
    def _add_enterprise_career_fields(self):
        """Enterprise exclusive career fields"""
        
        # Advanced Career Readiness
        readiness_factors = [
            ('goal_setting', 'Sets clear career goals'),
            ('networking', 'Builds professional relationships'),
            ('skill_development', 'Actively develops skills'),
            ('industry_awareness', 'Understands industry trends'),
        ]
        
        for factor, label in readiness_factors:
            self.add_likert_field(f'readiness_{factor}', label)
        
        # Future Planning
        planning_aspects = [
            ('education_planning', 'Plans for further education'),
            ('skill_gaps_awareness', 'Aware of skill gaps'),
            ('mentor_seeking', 'Seeks mentorship opportunities'),
            ('experience_seeking', 'Seeks relevant experience'),
        ]
        
        for aspect, label in planning_aspects:
            self.add_likert_field(f'planning_{aspect}', label)


class WorkflowSelectionForm(forms.Form):
    """Form to select workflow type and pricing plan"""
    
    student = forms.ModelChoiceField(
        queryset=Student.objects.none(),
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Select Student'
    )
    
    pricing_plan = forms.ModelChoiceField(
        queryset=PricingPlan.objects.filter(is_active=True),
        widget=forms.RadioSelect,
        label='Choose Assessment Plan',
        help_text='Select the plan that best fits your needs'
    )
    
    assessment_types = forms.MultipleChoiceField(
        choices=[],
        widget=forms.CheckboxSelectMultiple,
        label='Assessment Types',
        required=False
    )
    
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        if user:
            # Filter students based on user (parent)
            self.fields['student'].queryset = Student.objects.filter(parent=user)
        
        # Set up assessment types based on available plans
        self._setup_assessment_choices()
    
    def _setup_assessment_choices(self):
        """Setup available assessment type choices"""
        choices = [
            ('academic', 'Academic Assessment'),
            ('physical', 'Physical Education Assessment'),
            ('psychological', 'Psychological Assessment'),
            ('career', 'Career Mapping'),
        ]
        self.fields['assessment_types'].choices = choices
    
    def clean(self):
        cleaned_data = super().clean()
        pricing_plan = cleaned_data.get('pricing_plan')
        assessment_types = cleaned_data.get('assessment_types', [])
        
        if pricing_plan and assessment_types:
            # Validate assessment types against pricing plan
            errors = []
            
            if 'physical' in assessment_types and not pricing_plan.physical_assessments:
                errors.append('Physical assessments not available in selected plan')
            
            if 'psychological' in assessment_types and not pricing_plan.psychological_assessments:
                errors.append('Psychological assessments not available in selected plan')
            
            if 'career' in assessment_types and not pricing_plan.career_mapping:
                errors.append('Career mapping not available in selected plan')
            
            if errors:
                raise ValidationError(errors)
        
        return cleaned_data


class StepNavigationForm(forms.Form):
    """Form for workflow step navigation"""
    
    current_step = forms.IntegerField(widget=forms.HiddenInput())
    action = forms.ChoiceField(
        choices=[
            ('next', 'Next Step'),
            ('previous', 'Previous Step'),
            ('save_draft', 'Save Draft'),
            ('submit', 'Submit Assessment'),
        ],
        widget=forms.HiddenInput()
    )
    
    step_data = forms.CharField(
        widget=forms.HiddenInput(),
        required=False
    )
    
    def clean_step_data(self):
        """Parse step data JSON"""
        step_data = self.cleaned_data.get('step_data', '{}')
        try:
            return json.loads(step_data)
        except json.JSONDecodeError:
            return {}


# Form factory for dynamic form creation
class AssessmentFormFactory:
    """Factory class to create appropriate assessment forms"""
    
    @staticmethod
    def create_form(assessment_type, pricing_plan, workflow=None, data=None):
        """Create form based on assessment type and pricing plan"""
        
        form_mapping = {
            'academic': AcademicAssessmentForm,
            'physical': PhysicalEducationForm,
            'psychological': PsychologicalAssessmentForm,
            'career': CareerMappingForm,
        }
        
        form_class = form_mapping.get(assessment_type)
        if not form_class:
            raise ValueError(f"Unknown assessment type: {assessment_type}")
        
        return form_class(
            data=data,
            pricing_plan=pricing_plan,
            workflow=workflow
        )
    
    @staticmethod
    def get_form_schema(assessment_type, pricing_plan):
        """Get form schema for API usage"""
        form = AssessmentFormFactory.create_form(assessment_type, pricing_plan)
        
        schema = {
            'fields': [],
            'validation_rules': {},
            'scoring_config': {}
        }
        
        for field_name, field in form.fields.items():
            field_info = {
                'name': field_name,
                'label': field.label,
                'type': field.__class__.__name__,
                'required': field.required,
                'help_text': getattr(field, 'help_text', ''),
            }
            
            # Add field-specific properties
            if hasattr(field, 'choices'):
                field_info['choices'] = list(field.choices)
            
            if hasattr(field, 'min_value'):
                field_info['min_value'] = field.min_value
            
            if hasattr(field, 'max_value'):
                field_info['max_value'] = field.max_value
            
            schema['fields'].append(field_info)
        
        return schema
