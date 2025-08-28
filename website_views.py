"""
Website Views for EduSight B2C Platform
Handles all public-facing pages for the marketing website
"""

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from crm.models import Lead, LeadSource, FormSubmission, Appointment


def website_home(request):
    """Homepage with EPR Assessment focus and modern design"""
    context = {
        'page_title': 'EPR: Edusight Prism Rating System',
        'plans': {
            'basic': {'price': 499, 'name': 'Basic EPR'},
            'gold': {'price': 899, 'name': 'Gold EPR'},
            'platinum': {'price': 1499, 'name': 'Platinum EPR'},
            'corporate': {'price': 25000, 'name': 'Corporate EPR'}
        },
        'features_count': 6,
        'testimonials_count': 3,
    }
    return render(request, 'website/home.html', context)



def website_about(request):
    """About Us page"""
    context = {
        'page_title': 'About Us',
        'team_members': [
            {
                'name': 'Dr. Sarah Johnson',
                'role': 'Chief Educational Psychologist',
                'experience': '15+ years',
                'specialization': 'Child Psychology & DMIT'
            },
            {
                'name': 'Prof. Amit Sharma',
                'role': 'Head of Academic Analytics',
                'experience': '12+ years',
                'specialization': 'AI & Machine Learning'
            },
            {
                'name': 'Ms. Priya Patel',
                'role': 'Lead Career Counselor',
                'experience': '10+ years',
                'specialization': 'Career Guidance & Development'
            }
        ]
    }
    return render(request, 'website/about.html', context)


def dmit_info(request):
    """DMIT information and explanation page"""
    context = {
        'page_title': 'DMIT - Dermatoglyphics Multiple Intelligence Test',
        'dmit_price': 2999,
        'benefits': [
            'Discover innate talents and abilities',
            'Understand learning style preferences',
            'Identify career aptitude areas',
            'Enhance academic performance',
            'Improve parent-child understanding',
            'Make informed educational decisions'
        ],
        'analysis_areas': [
            'Multiple Intelligence Assessment',
            'Learning Style Analysis',
            'Personality Traits Evaluation',
            'Academic Potential Mapping',
            'Career Guidance Recommendations',
            'Optimal Learning Strategies'
        ]
    }
    return render(request, 'website/dmit_info.html', context)


def website_contact(request):
    """Contact Us page with form"""
    if request.method == 'POST':
        # Handle contact form submission
        try:
            name = request.POST.get('name', '')
            email = request.POST.get('email', '')
            phone = request.POST.get('phone', '')
            subject = request.POST.get('subject', '')
            message = request.POST.get('message', '')
            
            # Create form submission record
            form_data = {
                'name': name,
                'email': email,
                'phone': phone,
                'subject': subject,
                'message': message,
                'form_type': 'contact'
            }
            
            submission = FormSubmission.objects.create(
                form_type='contact',
                form_data=form_data,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer_url=request.META.get('HTTP_REFERER', '')
            )
            
            # Try to create or update lead
            if email or phone:
                source, _ = LeadSource.objects.get_or_create(
                    name='Website Contact Form',
                    defaults={'description': 'Contact form submissions from website'}
                )
                
                # Check if lead exists
                lead = None
                if email:
                    lead = Lead.objects.filter(email=email).first()
                if not lead and phone:
                    lead = Lead.objects.filter(phone=phone).first()
                
                if not lead:
                    # Create new lead
                    name_parts = name.split(' ', 1)
                    first_name = name_parts[0] if name_parts else 'Unknown'
                    last_name = name_parts[1] if len(name_parts) > 1 else ''
                    
                    lead = Lead.objects.create(
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        phone=phone,
                        source=source,
                        status='new',
                        initial_notes=f"Subject: {subject}\nMessage: {message}"
                    )
                
                # Link submission to lead
                submission.lead = lead
                submission.save()
            
            messages.success(request, 'Thank you for your message! We will get back to you soon.')
            return redirect('website_contact')
            
        except Exception as e:
            messages.error(request, 'Sorry, there was an error sending your message. Please try again.')
    
    context = {
        'page_title': 'Contact Us',
        'office_locations': [
            {
                'city': 'Mumbai',
                'address': '123 Education Hub, Andheri West, Mumbai - 400058',
                'phone': '+91 9876543210',
                'email': 'mumbai@edusight.com'
            },
            {
                'city': 'Delhi',
                'address': '456 Knowledge Centre, Connaught Place, New Delhi - 110001',
                'phone': '+91 9876543211',
                'email': 'delhi@edusight.com'
            },
            {
                'city': 'Bangalore',
                'address': '789 Tech Park, Electronic City, Bangalore - 560100',
                'phone': '+91 9876543212',
                'email': 'bangalore@edusight.com'
            }
        ]
    }
    return render(request, 'website/contact.html', context)


def pricing_plans(request):
    """EPR Assessment pricing plans page"""
    context = {
        'page_title': 'EPR Assessment Plans & Pricing',
        'plans': {
            'basic': {
                'name': 'Basic',
                'price': 499,
                'features': [
                    'Academic performance analysis',
                    'Basic learning style assessment',
                    'Subject-wise strengths report',
                    'Performance recommendations',
                    'Digital PDF report'
                ]
            },
            'gold': {
                'name': 'Gold',
                'price': 899,
                'popular': True,
                'features': [
                    'Everything in Basic',
                    'Psychological wellbeing analysis',
                    'Career guidance insights',
                    'AI-powered recommendations',
                    'Progress tracking',
                    'Email support'
                ]
            },
            'platinum': {
                'name': 'Platinum',
                'price': 1499,
                'premium': True,
                'features': [
                    'Everything in Gold',
                    'Advanced ML analytics',
                    'Personalized study plans',
                    'Expert consultation call',
                    'Priority support',
                    'Monthly progress reports'
                ]
            },
            'corporate': {
                'name': 'Corporate',
                'price': 25000,
                'yearly': True,
                'students': 50,
                'features': [
                    'Platinum access for 50 students',
                    'Bulk analytics dashboard',
                    'Teacher training sessions',
                    'Custom reporting',
                    'Dedicated support',
                    'Annual reviews'
                ]
            }
        }
    }
    return render(request, 'website/pricing.html', context)


def book_assessment(request):
    """Assessment booking page"""
    if request.method == 'POST':
        try:
            # Get form data
            first_name = request.POST.get('first_name', '')
            last_name = request.POST.get('last_name', '')
            email = request.POST.get('email', '')
            phone = request.POST.get('phone', '')
            child_name = request.POST.get('child_name', '')
            child_age = request.POST.get('child_age', '')
            child_grade = request.POST.get('child_grade', '')
            preferred_date = request.POST.get('preferred_date', '')
            preferred_time = request.POST.get('preferred_time', '')
            address = request.POST.get('address', '')
            city = request.POST.get('city', '')
            state = request.POST.get('state', '')
            pincode = request.POST.get('pincode', '')
            special_instructions = request.POST.get('special_instructions', '')
            
            # Create or get lead
            source, _ = LeadSource.objects.get_or_create(
                name='DMIT Booking Form',
                defaults={'description': 'DMIT appointment bookings from website'}
            )
            
            # Check if lead exists
            lead = None
            if email:
                lead = Lead.objects.filter(email=email).first()
            if not lead and phone:
                lead = Lead.objects.filter(phone=phone).first()
            
            if not lead:
                # Create new lead
                lead = Lead.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone=phone,
                    child_name=child_name,
                    child_age=int(child_age) if child_age else None,
                    child_grade=child_grade,
                    city=city,
                    state=state,
                    source=source,
                    status='appointment_scheduled',
                    interested_in_dmit=True,
                    initial_notes=f"DMIT appointment request. Special instructions: {special_instructions}"
                )
            
            # Create appointment
            appointment = Appointment.objects.create(
                lead=lead,
                appointment_type='dmit',
                status='scheduled',
                location_type='home',
                scheduled_date=timezone.datetime.strptime(
                    f"{preferred_date} {preferred_time}", 
                    "%Y-%m-%d %H:%M"
                ),
                address=address,
                city=city,
                state=state,
                pincode=pincode,
                price=2999.00,
                discount=0.00,
                final_price=2999.00,
                special_instructions=special_instructions
            )
            
            # Create form submission record
            form_data = {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'child_name': child_name,
                'child_age': child_age,
                'child_grade': child_grade,
                'preferred_date': preferred_date,
                'preferred_time': preferred_time,
                'address': address,
                'city': city,
                'state': state,
                'pincode': pincode,
                'special_instructions': special_instructions,
                'form_type': 'dmit_booking'
            }
            
            FormSubmission.objects.create(
                form_type='dmit_inquiry',
                form_data=form_data,
                lead=lead,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer_url=request.META.get('HTTP_REFERER', '')
            )
            
            messages.success(request, 
                f'Thank you! Your DMIT appointment has been scheduled. '
                f'Appointment ID: {appointment.appointment_id}. '
                f'Our team will contact you soon to confirm the details.'
            )
            return redirect('book_appointment')
            
        except Exception as e:
            messages.error(request, 'Sorry, there was an error booking your appointment. Please try again.')
    
    context = {
        'page_title': 'Book DMIT Appointment',
        'dmit_price': 2999,
        'available_time_slots': [
            '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
        ]
    }
    return render(request, 'website/book_appointment.html', context)


# Framework Pages
def framework_cbse(request):
    """CBSE Framework information"""
    context = {
        'page_title': 'CBSE Framework Support',
        'framework_name': 'CBSE',
        'full_name': 'Central Board of Secondary Education',
        'description': 'Comprehensive support for CBSE curriculum with specialized assessments and analytics.',
        'features': [
            'CBSE-aligned academic assessments',
            'Grade-wise learning analytics',
            'Subject-specific performance tracking',
            'Board exam preparation insights',
            'Career guidance based on CBSE stream choices'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


def framework_icse(request):
    """ICSE Framework information"""
    context = {
        'page_title': 'ICSE Framework Support',
        'framework_name': 'ICSE',
        'full_name': 'Indian Certificate of Secondary Education',
        'description': 'Specialized support for ICSE curriculum with detailed analytical insights.',
        'features': [
            'ICSE-specific academic assessments',
            'Comprehensive subject analysis',
            'Skills-based evaluation metrics',
            'Board preparation strategies',
            'Stream selection guidance'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


def framework_igcse(request):
    """IGCSE Framework information"""
    context = {
        'page_title': 'IGCSE Framework Support',
        'framework_name': 'IGCSE',
        'full_name': 'International General Certificate of Secondary Education',
        'description': 'International curriculum support with global educational standards.',
        'features': [
            'IGCSE-aligned international assessments',
            'Global competency tracking',
            'International university preparation',
            'Cross-cultural learning insights',
            'Global career pathway guidance'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


def framework_ib(request):
    """IB Framework information"""
    context = {
        'page_title': 'IB Framework Support',
        'framework_name': 'IB',
        'full_name': 'International Baccalaureate',
        'description': 'Premium support for IB programme with holistic educational approach.',
        'features': [
            'IB-specific assessment methodologies',
            'Theory of Knowledge (TOK) analytics',
            'Extended Essay guidance insights',
            'CAS (Creativity, Activity, Service) tracking',
            'International university preparation'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


def framework_psychological(request):
    """Psychological Framework information"""
    context = {
        'page_title': 'Psychological Assessment Framework',
        'framework_name': 'Psychological',
        'full_name': 'Comprehensive Psychological Assessment',
        'description': 'Scientific psychological evaluation and mental health insights for students.',
        'features': [
            'Cognitive ability assessment',
            'Emotional intelligence evaluation',
            'Social skills analysis',
            'Learning style identification',
            'Behavioral pattern insights',
            'Stress and anxiety monitoring'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


def framework_physical(request):
    """Physical Education Framework information"""
    context = {
        'page_title': 'Physical Education Framework',
        'framework_name': 'Physical Education',
        'full_name': 'Comprehensive Physical Development Assessment',
        'description': 'Complete physical fitness and motor skills development tracking.',
        'features': [
            'Physical fitness assessment',
            'Motor skills development tracking',
            'Sports aptitude analysis',
            'Health and nutrition insights',
            'Physical activity recommendations',
            'Sports career guidance'
        ]
    }
    return render(request, 'website/framework_detail.html', context)


@csrf_exempt
def ajax_contact_form(request):
    """Handle AJAX contact form submissions"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Create form submission
            submission = FormSubmission.objects.create(
                form_type=data.get('form_type', 'contact'),
                form_data=data,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer_url=request.META.get('HTTP_REFERER', '')
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Thank you for your inquiry! We will contact you soon.',
                'submission_id': str(submission.submission_id)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'Sorry, there was an error. Please try again.'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
