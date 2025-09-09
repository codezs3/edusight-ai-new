"""
Test Catalog API views for serving comprehensive assessment data.
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Count, Avg, Min, Max
from django.utils.decorators import method_decorator
from django.views import View
import json

from .test_catalog_models import TestCatalog, TestCategory, TestReview


@method_decorator(csrf_exempt, name='dispatch')
class TestCatalogAPIView(View):
    """API view for test catalog operations."""
    
    def get(self, request):
        """Get filtered and paginated test catalog."""
        try:
            # Get query parameters
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            search = request.GET.get('search', '')
            category = request.GET.get('category', '')
            assessment_type = request.GET.get('type', '')
            difficulty = request.GET.get('difficulty', '')
            target_audience = request.GET.get('audience', '')
            curriculum = request.GET.get('curriculum', '')
            price_min = request.GET.get('price_min', '')
            price_max = request.GET.get('price_max', '')
            is_free = request.GET.get('is_free', '')
            is_featured = request.GET.get('is_featured', '')
            is_popular = request.GET.get('is_popular', '')
            sort_by = request.GET.get('sort_by', 'created_at')
            sort_order = request.GET.get('sort_order', 'desc')
            
            # Build query
            queryset = TestCatalog.objects.filter(is_active=True, is_published=True)
            
            # Apply filters
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search) |
                    Q(short_description__icontains=search) |
                    Q(tags__icontains=search)
                )
            
            if category:
                queryset = queryset.filter(category__name__icontains=category)
            
            if assessment_type:
                queryset = queryset.filter(assessment_type=assessment_type)
            
            if difficulty:
                queryset = queryset.filter(difficulty=difficulty)
            
            if target_audience:
                queryset = queryset.filter(target_audience=target_audience)
            
            if curriculum:
                queryset = queryset.filter(curriculum=curriculum)
            
            if price_min:
                queryset = queryset.filter(price_inr__gte=float(price_min))
            
            if price_max:
                queryset = queryset.filter(price_inr__lte=float(price_max))
            
            if is_free == 'true':
                queryset = queryset.filter(is_free=True)
            elif is_free == 'false':
                queryset = queryset.filter(is_free=False)
            
            if is_featured == 'true':
                queryset = queryset.filter(is_featured=True)
            
            if is_popular == 'true':
                queryset = queryset.filter(is_popular=True)
            
            # Apply sorting
            if sort_order == 'desc':
                sort_by = f'-{sort_by}'
            queryset = queryset.order_by(sort_by)
            
            # Pagination
            paginator = Paginator(queryset, page_size)
            page_obj = paginator.get_page(page)
            
            # Serialize data
            tests = []
            for test in page_obj:
                test_data = {
                    'id': test.id,
                    'title': test.title,
                    'slug': test.slug,
                    'description': test.description,
                    'short_description': test.short_description,
                    'category': {
                        'id': test.category.id,
                        'name': test.category.name,
                        'icon': test.category.icon,
                        'color': test.category.color,
                    },
                    'assessment_type': test.assessment_type,
                    'curriculum': test.curriculum,
                    'target_audience': test.target_audience,
                    'grade_levels': test.grade_levels,
                    'age_range': {
                        'min': test.age_range_min,
                        'max': test.age_range_max,
                    },
                    'difficulty': test.difficulty,
                    'difficulty_color': test.get_difficulty_color(),
                    'duration_minutes': test.duration_minutes,
                    'total_questions': test.total_questions,
                    'passing_score': float(test.passing_score),
                    'max_score': float(test.max_score),
                    'price_inr': float(test.price_inr),
                    'price_display': test.get_price_display(),
                    'is_free': test.is_free,
                    'is_premium': test.is_premium,
                    'is_featured': test.is_featured,
                    'is_popular': test.is_popular,
                    'is_new': test.is_new,
                    'ai_insights': test.ai_insights,
                    'success_rate': float(test.success_rate),
                    'average_score': float(test.average_score),
                    'completion_rate': float(test.completion_rate),
                    'instructions': test.instructions,
                    'prerequisites': test.prerequisites,
                    'learning_outcomes': test.learning_outcomes,
                    'tags': test.tags,
                    'icon_name': test.icon_name,
                    'cover_image_url': test.cover_image_url,
                    'total_attempts': test.total_attempts,
                    'total_completions': test.total_completions,
                    'average_rating': float(test.average_rating),
                    'total_ratings': test.total_ratings,
                    'rating_stars': test.get_rating_stars(),
                    'created_at': test.created_at.isoformat(),
                    'published_at': test.published_at.isoformat() if test.published_at else None,
                }
                tests.append(test_data)
            
            # Get filter options
            filter_options = self.get_filter_options()
            
            response_data = {
                'success': True,
                'data': {
                    'tests': tests,
                    'pagination': {
                        'current_page': page_obj.number,
                        'total_pages': paginator.num_pages,
                        'total_items': paginator.count,
                        'page_size': page_size,
                        'has_next': page_obj.has_next(),
                        'has_previous': page_obj.has_previous(),
                    },
                    'filter_options': filter_options,
                }
            }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def get_filter_options(self):
        """Get available filter options."""
        try:
            # Get unique values for filters
            categories = TestCategory.objects.filter(is_active=True).values('id', 'name', 'icon', 'color')
            assessment_types = TestCatalog.objects.values_list('assessment_type', flat=True).distinct()
            difficulties = TestCatalog.objects.values_list('difficulty', flat=True).distinct()
            target_audiences = TestCatalog.objects.values_list('target_audience', flat=True).distinct()
            curricula = TestCatalog.objects.values_list('curriculum', flat=True).distinct()
            
            # Get price range
            price_stats = TestCatalog.objects.aggregate(
                min_price=Min('price_inr'),
                max_price=Max('price_inr'),
                avg_price=Avg('price_inr')
            )
            
            return {
                'categories': list(categories),
                'assessment_types': list(assessment_types),
                'difficulties': list(difficulties),
                'target_audiences': list(target_audiences),
                'curricula': list(curricula),
                'price_range': {
                    'min': float(price_stats['min_price']) if price_stats['min_price'] else 0,
                    'max': float(price_stats['max_price']) if price_stats['max_price'] else 1000,
                    'avg': float(price_stats['avg_price']) if price_stats['avg_price'] else 99,
                }
            }
        except Exception as e:
            return {}


@method_decorator(csrf_exempt, name='dispatch')
class TestDetailAPIView(View):
    """API view for individual test details."""
    
    def get(self, request, test_id):
        """Get detailed information about a specific test."""
        try:
            test = TestCatalog.objects.get(id=test_id, is_active=True, is_published=True)
            
            # Get related reviews
            reviews = TestReview.objects.filter(test=test, is_verified=True).order_by('-created_at')[:10]
            
            # Serialize test data
            test_data = {
                'id': test.id,
                'title': test.title,
                'slug': test.slug,
                'description': test.description,
                'short_description': test.short_description,
                'category': {
                    'id': test.category.id,
                    'name': test.category.name,
                    'description': test.category.description,
                    'icon': test.category.icon,
                    'color': test.category.color,
                },
                'assessment_type': test.assessment_type,
                'curriculum': test.curriculum,
                'target_audience': test.target_audience,
                'grade_levels': test.grade_levels,
                'age_range': {
                    'min': test.age_range_min,
                    'max': test.age_range_max,
                },
                'difficulty': test.difficulty,
                'difficulty_color': test.get_difficulty_color(),
                'duration_minutes': test.duration_minutes,
                'total_questions': test.total_questions,
                'passing_score': float(test.passing_score),
                'max_score': float(test.max_score),
                'price_inr': float(test.price_inr),
                'price_display': test.get_price_display(),
                'is_free': test.is_free,
                'is_premium': test.is_premium,
                'is_featured': test.is_featured,
                'is_popular': test.is_popular,
                'is_new': test.is_new,
                'ai_insights': test.ai_insights,
                'success_rate': float(test.success_rate),
                'average_score': float(test.average_score),
                'completion_rate': float(test.completion_rate),
                'instructions': test.instructions,
                'prerequisites': test.prerequisites,
                'learning_outcomes': test.learning_outcomes,
                'tags': test.tags,
                'icon_name': test.icon_name,
                'cover_image_url': test.cover_image_url,
                'total_attempts': test.total_attempts,
                'total_completions': test.total_completions,
                'average_rating': float(test.average_rating),
                'total_ratings': test.total_ratings,
                'rating_stars': test.get_rating_stars(),
                'created_at': test.created_at.isoformat(),
                'published_at': test.published_at.isoformat() if test.published_at else None,
                'reviews': [
                    {
                        'id': review.id,
                        'user_name': review.user.get_full_name() or review.user.username,
                        'rating': review.rating,
                        'title': review.title,
                        'comment': review.comment,
                        'is_helpful': review.is_helpful,
                        'created_at': review.created_at.isoformat(),
                    }
                    for review in reviews
                ],
            }
            
            return JsonResponse({
                'success': True,
                'data': test_data
            })
            
        except TestCatalog.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Test not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class TestStatsAPIView(View):
    """API view for test catalog statistics."""
    
    def get(self, request):
        """Get overall statistics for the test catalog."""
        try:
            # Get basic counts
            total_tests = TestCatalog.objects.filter(is_active=True, is_published=True).count()
            total_categories = TestCategory.objects.filter(is_active=True).count()
            
            # Get counts by type
            tests_by_type = TestCatalog.objects.filter(is_active=True, is_published=True).values('assessment_type').annotate(count=Count('id'))
            
            # Get counts by category
            tests_by_category = TestCatalog.objects.filter(is_active=True, is_published=True).values('category__name').annotate(count=Count('id'))
            
            # Get price statistics
            price_stats = TestCatalog.objects.filter(is_active=True, is_published=True).aggregate(
                min_price=Min('price_inr'),
                max_price=Max('price_inr'),
                avg_price=Avg('price_inr'),
                free_tests=Count('id', filter=Q(is_free=True)),
                premium_tests=Count('id', filter=Q(is_free=False))
            )
            
            # Get difficulty distribution
            difficulty_stats = TestCatalog.objects.filter(is_active=True, is_published=True).values('difficulty').annotate(count=Count('id'))
            
            # Get target audience distribution
            audience_stats = TestCatalog.objects.filter(is_active=True, is_published=True).values('target_audience').annotate(count=Count('id'))
            
            stats_data = {
                'total_tests': total_tests,
                'total_categories': total_categories,
                'tests_by_type': list(tests_by_type),
                'tests_by_category': list(tests_by_category),
                'price_statistics': {
                    'min_price': float(price_stats['min_price']) if price_stats['min_price'] else 0,
                    'max_price': float(price_stats['max_price']) if price_stats['max_price'] else 1000,
                    'avg_price': float(price_stats['avg_price']) if price_stats['avg_price'] else 99,
                    'free_tests': price_stats['free_tests'],
                    'premium_tests': price_stats['premium_tests'],
                },
                'difficulty_distribution': list(difficulty_stats),
                'audience_distribution': list(audience_stats),
            }
            
            return JsonResponse({
                'success': True,
                'data': stats_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@require_http_methods(["GET"])
def test_categories_api(request):
    """API endpoint for test categories."""
    try:
        categories = TestCategory.objects.filter(is_active=True).order_by('sort_order', 'name')
        
        categories_data = []
        for category in categories:
            # Get test count for this category
            test_count = TestCatalog.objects.filter(category=category, is_active=True, is_published=True).count()
            
            category_data = {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'icon': category.icon,
                'color': category.color,
                'test_count': test_count,
                'parent_category': category.parent_category.id if category.parent_category else None,
            }
            categories_data.append(category_data)
        
        return JsonResponse({
            'success': True,
            'data': categories_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
