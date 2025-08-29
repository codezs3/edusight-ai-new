"""
Management command to set up pricing plans for assessment workflows
"""

from django.core.management.base import BaseCommand
from assessments.workflow_models import PricingPlan


class Command(BaseCommand):
    help = 'Set up default pricing plans for assessment workflows'
    
    def handle(self, *args, **options):
        self.stdout.write('Setting up pricing plans...')
        
        # Create Basic Plan
        basic_plan = PricingPlan.get_basic_plan()
        self.stdout.write(
            self.style.SUCCESS(f'✓ Created/Updated: {basic_plan.name}')
        )
        
        # Create Premium Plan
        premium_plan = PricingPlan.get_premium_plan()
        self.stdout.write(
            self.style.SUCCESS(f'✓ Created/Updated: {premium_plan.name}')
        )
        
        # Create Enterprise Plan
        enterprise_plan = PricingPlan.get_enterprise_plan()
        self.stdout.write(
            self.style.SUCCESS(f'✓ Created/Updated: {enterprise_plan.name}')
        )
        
        self.stdout.write(
            self.style.SUCCESS('\n🎉 All pricing plans have been set up successfully!')
        )
        
        # Display summary
        self.stdout.write('\nPricing Plan Summary:')
        self.stdout.write('=' * 50)
        
        for plan in PricingPlan.objects.filter(is_active=True):
            self.stdout.write(f'\n📋 {plan.name} ({plan.get_plan_type_display()})')
            self.stdout.write(f'   💰 Price: ${plan.price} per {plan.duration_months} months')
            self.stdout.write(f'   👥 Max Students: {plan.max_students}')
            self.stdout.write(f'   📊 Max Assessments/Month: {plan.max_assessments_per_month}')
            self.stdout.write(f'   📄 Max Reports/Month: {plan.max_reports_per_month}')
            
            features = []
            if plan.academic_assessments:
                features.append('Academic')
            if plan.physical_assessments:
                features.append('Physical')
            if plan.psychological_assessments:
                features.append('Psychological')
            if plan.career_mapping:
                features.append('Career')
            if plan.ml_predictions:
                features.append('AI/ML')
            if plan.advanced_analytics:
                features.append('Advanced Analytics')
            
            self.stdout.write(f'   ✨ Features: {", ".join(features)}')
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write('Next steps:')
        self.stdout.write('1. Run migrations: python manage.py migrate')
        self.stdout.write('2. Create demo workflows: python manage.py create_demo_workflows')
        self.stdout.write('3. Access workflow dashboard: /assessments/workflows/')
