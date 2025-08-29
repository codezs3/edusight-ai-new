from django.urls import path
from . import views

app_name = 'ml_predictions'

urlpatterns = [
    # ML Dashboard
    path('', views.ml_dashboard, name='dashboard'),
    path('predictions/', views.predictions_list, name='predictions_list'),
    path('models/', views.ml_models_list, name='models_list'),
    
    # Student predictions
    path('student/<int:student_id>/', views.student_predictions, name='student_predictions'),
    path('student/<int:student_id>/career/', views.career_recommendations, name='career_recommendations'),
    path('student/<int:student_id>/academic/', views.academic_predictions, name='academic_predictions'),
    path('student/<int:student_id>/wellbeing/', views.wellbeing_predictions, name='wellbeing_predictions'),
    
    # Batch predictions
    path('batch/', views.batch_predictions, name='batch_predictions'),
    path('batch/run/', views.run_batch_predictions, name='run_batch_predictions'),
    
    # Model management
    path('models/train/', views.train_models, name='train_models'),
    path('models/<int:model_id>/details/', views.model_details, name='model_details'),
    
    # API endpoints
    path('api/predict/', views.predict_api, name='predict_api'),
    path('api/models/', views.models_api, name='models_api'),
    path('api/student/<int:student_id>/predictions/', views.student_predictions_api, name='student_predictions_api'),
]
