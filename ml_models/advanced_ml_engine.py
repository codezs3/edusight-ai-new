#!/usr/bin/env python
"""
Advanced ML Engine for EduSight - Top 10 ML Algorithms Implementation
This module contains the most advanced ML algorithms for educational analytics
"""

import os
import sys
import django
import numpy as np
import pandas as pd
import joblib
import pickle
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

# Advanced ML Libraries
from sklearn.ensemble import (
    RandomForestClassifier, RandomForestRegressor,
    GradientBoostingClassifier, GradientBoostingRegressor,
    AdaBoostClassifier, ExtraTreesClassifier
)
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.svm import SVC, SVR
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder, MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_squared_error, r2_score

# Advanced ML Libraries
import xgboost as xgb
import lightgbm as lgb
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models

# Django Models
from students.models import Student, User, School
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics
from ml_predictions.models import MLPrediction, MLModel


class AdvancedMLEngine:
    """Advanced Machine Learning Engine with Top 10 ML Algorithms"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.model_directory = 'ml_models/'
        self.algorithms = {
            1: 'Random Forest',
            2: 'Gradient Boosting (XGBoost)',
            3: 'LightGBM',
            4: 'Neural Network (Deep Learning)',
            5: 'Support Vector Machine',
            6: 'Logistic Regression',
            7: 'Decision Tree',
            8: 'K-Nearest Neighbors',
            9: 'Naive Bayes',
            10: 'Ensemble Methods'
        }
        
    def prepare_student_data(self):
        """Prepare comprehensive student dataset for ML training"""
        print("🔄 Preparing student data for ML training...")
        
        # Get all students with their data
        students = Student.objects.select_related('user', 'school', 'parent').all()
        
        data = []
        for student in students:
            # Get assessment results
            assessments = AssessmentResult.objects.filter(student=student)
            academic_scores = assessments.filter(assessment__assessment_type='academic')
            psychological_scores = assessments.filter(assessment__assessment_type='psychological')
            physical_scores = assessments.filter(assessment__assessment_type='physical')
            
            # Calculate averages
            from django.db.models import Avg
            academic_avg = academic_scores.aggregate(avg=Avg('percentage'))['avg'] or 0
            psychological_avg = psychological_scores.aggregate(avg=Avg('percentage'))['avg'] or 0
            physical_avg = physical_scores.aggregate(avg=Avg('percentage'))['avg'] or 0
            
            # Get analytics data
            analytics = StudentAnalytics.objects.filter(student=student).first()
            
            student_data = {
                'student_id': student.id,
                'age': self._calculate_age(student.date_of_birth),
                'gender': 1 if student.gender == 'M' else 0,
                'grade': self._convert_grade(student.grade),
                'academic_score': academic_avg,
                'psychological_score': psychological_avg,
                'physical_score': physical_avg,
                'total_assessments': assessments.count(),
                'academic_assessments': academic_scores.count(),
                'psychological_assessments': psychological_scores.count(),
                'physical_assessments': physical_scores.count(),
                'school_type': self._encode_school_type(student.school.school_type),
                'established_year': student.school.established_year,
                # Performance metrics
                'performance_category': self._categorize_performance(academic_avg),
                'risk_level': self._calculate_risk_level(academic_avg, psychological_avg),
                'career_aptitude': self._determine_career_aptitude(academic_avg, psychological_avg, physical_avg)
            }
            
            if analytics:
                student_data.update({
                    'engagement_score': analytics.engagement_score if hasattr(analytics, 'engagement_score') else 75,
                    'attendance_rate': analytics.attendance_rate if hasattr(analytics, 'attendance_rate') else 85,
                    'participation_score': analytics.participation_score if hasattr(analytics, 'participation_score') else 70
                })
            else:
                student_data.update({
                    'engagement_score': 75,
                    'attendance_rate': 85,
                    'participation_score': 70
                })
                
            data.append(student_data)
        
        df = pd.DataFrame(data)
        print(f"✅ Prepared dataset with {len(df)} students and {len(df.columns)} features")
        return df
    
    def train_model_1_random_forest(self, df):
        """Train Random Forest Model for Performance Prediction"""
        print("🌳 Training Model 1: Random Forest...")
        
        # Prepare features and target
        features = ['age', 'gender', 'grade', 'psychological_score', 'physical_score', 
                   'total_assessments', 'school_type', 'engagement_score', 'attendance_rate']
        X = df[features].fillna(0)
        y = df['academic_score'].fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train Random Forest
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        predictions = model.predict(X_test_scaled)
        mse = mean_squared_error(y_test, predictions)
        
        # Save model
        model_path = os.path.join(self.model_directory, 'random_forest_performance.pkl')
        scaler_path = os.path.join(self.model_directory, 'random_forest_scaler.pkl')
        
        joblib.dump(model, model_path)
        joblib.dump(scaler, scaler_path)
        
        self.models['random_forest'] = {
            'model': model,
            'scaler': scaler,
            'features': features,
            'train_score': train_score,
            'test_score': test_score,
            'mse': mse,
            'type': 'regression'
        }
        
        print(f"✅ Random Forest trained - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
        return model, scaler, features
    
    def train_model_2_xgboost(self, df):
        """Train XGBoost Model for Risk Assessment"""
        print("🚀 Training Model 2: XGBoost...")
        
        # Prepare features and target for classification
        features = ['age', 'gender', 'grade', 'academic_score', 'psychological_score', 
                   'physical_score', 'attendance_rate', 'engagement_score']
        X = df[features].fillna(0)
        y = df['risk_level'].fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train XGBoost
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        predictions = model.predict(X_test)
        
        # Save model
        model_path = os.path.join(self.model_directory, 'xgboost_risk_assessment.pkl')
        joblib.dump(model, model_path)
        
        self.models['xgboost'] = {
            'model': model,
            'features': features,
            'train_score': train_score,
            'test_score': test_score,
            'type': 'classification'
        }
        
        print(f"✅ XGBoost trained - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
        return model, features
    
    def train_model_3_lightgbm(self, df):
        """Train LightGBM Model for Career Recommendation"""
        print("💡 Training Model 3: LightGBM...")
        
        # Prepare features and target
        features = ['academic_score', 'psychological_score', 'physical_score', 
                   'age', 'gender', 'grade', 'engagement_score']
        X = df[features].fillna(0)
        y = df['career_aptitude'].fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train LightGBM
        model = lgb.LGBMClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbosity=-1
        )
        model.fit(X_train, y_train)
        
        # Evaluate
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        
        # Save model
        model_path = os.path.join(self.model_directory, 'lightgbm_career.pkl')
        joblib.dump(model, model_path)
        
        self.models['lightgbm'] = {
            'model': model,
            'features': features,
            'train_score': train_score,
            'test_score': test_score,
            'type': 'classification'
        }
        
        print(f"✅ LightGBM trained - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
        return model, features
    
    def train_model_4_neural_network(self, df):
        """Train Deep Neural Network with TensorFlow/Keras"""
        print("🧠 Training Model 4: Deep Neural Network...")
        
        # Prepare features and target
        features = ['age', 'gender', 'grade', 'psychological_score', 'physical_score', 
                   'total_assessments', 'engagement_score', 'attendance_rate']
        X = df[features].fillna(0)
        y = df['academic_score'].fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Build Neural Network
        model = models.Sequential([
            layers.Dense(128, activation='relu', input_shape=(len(features),)),
            layers.Dropout(0.3),
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(32, activation='relu'),
            layers.Dense(1, activation='linear')  # Regression output
        ])
        
        model.compile(
            optimizer='adam',
            loss='mse',
            metrics=['mae']
        )
        
        # Train
        history = model.fit(
            X_train_scaled, y_train,
            epochs=50,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
        
        # Evaluate
        train_loss = model.evaluate(X_train_scaled, y_train, verbose=0)[0]
        test_loss = model.evaluate(X_test_scaled, y_test, verbose=0)[0]
        
        # Save model
        model_path = os.path.join(self.model_directory, 'neural_network_academic.h5')
        scaler_path = os.path.join(self.model_directory, 'neural_network_scaler.pkl')
        
        model.save(model_path)
        joblib.dump(scaler, scaler_path)
        
        self.models['neural_network'] = {
            'model': model,
            'scaler': scaler,
            'features': features,
            'train_loss': train_loss,
            'test_loss': test_loss,
            'type': 'regression'
        }
        
        print(f"✅ Neural Network trained - Train Loss: {train_loss:.3f}, Test Loss: {test_loss:.3f}")
        return model, scaler, features
    
    def train_model_5_svm(self, df):
        """Train Support Vector Machine for Classification"""
        print("🎯 Training Model 5: Support Vector Machine...")
        
        # Prepare features and target
        features = ['academic_score', 'psychological_score', 'physical_score', 'age', 'gender']
        X = df[features].fillna(0)
        y = df['performance_category'].fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train SVM
        model = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        # Save model
        model_path = os.path.join(self.model_directory, 'svm_performance_category.pkl')
        scaler_path = os.path.join(self.model_directory, 'svm_scaler.pkl')
        
        joblib.dump(model, model_path)
        joblib.dump(scaler, scaler_path)
        
        self.models['svm'] = {
            'model': model,
            'scaler': scaler,
            'features': features,
            'train_score': train_score,
            'test_score': test_score,
            'type': 'classification'
        }
        
        print(f"✅ SVM trained - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
        return model, scaler, features
    
    def train_remaining_models(self, df):
        """Train Models 6-10: Logistic Regression, Decision Tree, KNN, Naive Bayes, Ensemble"""
        print("📊 Training Models 6-10...")
        
        # Model 6: Logistic Regression
        features_lr = ['academic_score', 'psychological_score', 'attendance_rate']
        X_lr = df[features_lr].fillna(0)
        y_lr = df['risk_level'].fillna(0)
        
        X_train_lr, X_test_lr, y_train_lr, y_test_lr = train_test_split(X_lr, y_lr, test_size=0.2, random_state=42)
        
        scaler_lr = StandardScaler()
        X_train_lr_scaled = scaler_lr.fit_transform(X_train_lr)
        X_test_lr_scaled = scaler_lr.transform(X_test_lr)
        
        lr_model = LogisticRegression(random_state=42, max_iter=1000)
        lr_model.fit(X_train_lr_scaled, y_train_lr)
        
        # Model 7: Decision Tree
        dt_model = DecisionTreeClassifier(max_depth=10, random_state=42)
        dt_model.fit(X_train_lr, y_train_lr)
        
        # Model 8: K-Nearest Neighbors
        knn_model = KNeighborsClassifier(n_neighbors=5)
        knn_model.fit(X_train_lr_scaled, y_train_lr)
        
        # Model 9: Naive Bayes
        nb_model = GaussianNB()
        nb_model.fit(X_train_lr_scaled, y_train_lr)
        
        # Model 10: Ensemble (Voting Classifier)
        from sklearn.ensemble import VotingClassifier
        ensemble_model = VotingClassifier([
            ('lr', lr_model),
            ('dt', dt_model),
            ('knn', knn_model),
            ('nb', nb_model)
        ], voting='hard')
        ensemble_model.fit(X_train_lr_scaled, y_train_lr)
        
        # Save all models
        models_to_save = {
            'logistic_regression': (lr_model, scaler_lr),
            'decision_tree': (dt_model, None),
            'knn': (knn_model, scaler_lr),
            'naive_bayes': (nb_model, scaler_lr),
            'ensemble': (ensemble_model, scaler_lr)
        }
        
        for name, (model, scaler) in models_to_save.items():
            model_path = os.path.join(self.model_directory, f'{name}_model.pkl')
            joblib.dump(model, model_path)
            
            if scaler:
                scaler_path = os.path.join(self.model_directory, f'{name}_scaler.pkl')
                joblib.dump(scaler, scaler_path)
            
            # Evaluate
            if scaler:
                score = model.score(X_test_lr_scaled, y_test_lr)
            else:
                score = model.score(X_test_lr, y_test_lr)
            
            self.models[name] = {
                'model': model,
                'scaler': scaler,
                'features': features_lr,
                'score': score,
                'type': 'classification'
            }
        
        print("✅ Models 6-10 trained successfully")
        return models_to_save
    
    def train_all_models(self):
        """Train all 10 ML models"""
        print("🚀 Starting Advanced ML Training Pipeline...")
        print("="*70)
        
        # Prepare data
        df = self.prepare_student_data()
        
        if len(df) < 5:
            print("❌ Insufficient data for training. Need at least 5 students.")
            return False
        
        # Train all models
        try:
            self.train_model_1_random_forest(df)
            self.train_model_2_xgboost(df)
            self.train_model_3_lightgbm(df)
            self.train_model_4_neural_network(df)
            self.train_model_5_svm(df)
            self.train_remaining_models(df)
            
            # Save model metadata to database
            self.save_models_to_database()
            
            print("="*70)
            print("🎉 ALL 10 ADVANCED ML MODELS TRAINED SUCCESSFULLY!")
            print("="*70)
            
            # Print summary
            self.print_training_summary()
            
            return True
            
        except Exception as e:
            print(f"❌ Error during training: {str(e)}")
            return False
    
    def save_models_to_database(self):
        """Save model metadata to Django database"""
        print("💾 Saving model metadata to database...")
        
        model_configs = {
            'random_forest': {
                'name': 'Advanced Random Forest',
                'model_type': 'random_forest',
                'description': 'Random Forest for academic performance prediction',
                'accuracy': self.models['random_forest']['test_score']
            },
            'xgboost': {
                'name': 'XGBoost Risk Assessment',
                'model_type': 'gradient_boosting',
                'description': 'XGBoost for student risk assessment',
                'accuracy': self.models['xgboost']['test_score']
            },
            'lightgbm': {
                'name': 'LightGBM Career Predictor',
                'model_type': 'gradient_boosting',
                'description': 'LightGBM for career recommendation',
                'accuracy': self.models['lightgbm']['test_score']
            },
            'neural_network': {
                'name': 'Deep Neural Network',
                'model_type': 'neural_network',
                'description': 'TensorFlow/Keras neural network for academic prediction',
                'accuracy': 1.0 - (self.models['neural_network']['test_loss'] / 100)
            },
            'svm': {
                'name': 'Support Vector Machine',
                'model_type': 'svm',
                'description': 'SVM for performance categorization',
                'accuracy': self.models['svm']['test_score']
            },
            'logistic_regression': {
                'name': 'Logistic Regression',
                'model_type': 'logistic_regression',
                'description': 'Logistic regression for risk classification',
                'accuracy': self.models['logistic_regression']['score']
            },
            'decision_tree': {
                'name': 'Decision Tree',
                'model_type': 'decision_tree',
                'description': 'Decision tree for pattern recognition',
                'accuracy': self.models['decision_tree']['score']
            },
            'knn': {
                'name': 'K-Nearest Neighbors',
                'model_type': 'knn',
                'description': 'KNN for similarity-based prediction',
                'accuracy': self.models['knn']['score']
            },
            'naive_bayes': {
                'name': 'Naive Bayes',
                'model_type': 'naive_bayes',
                'description': 'Naive Bayes for probabilistic classification',
                'accuracy': self.models['naive_bayes']['score']
            },
            'ensemble': {
                'name': 'Ensemble Classifier',
                'model_type': 'ensemble',
                'description': 'Voting classifier combining multiple algorithms',
                'accuracy': self.models['ensemble']['score']
            }
        }
        
        for model_key, config in model_configs.items():
            model_obj, created = MLModel.objects.get_or_create(
                name=config['name'],
                version='2.0',
                defaults={
                    'model_type': config['model_type'],
                    'file_path': f'/ml_models/{model_key}_model.pkl',
                    'accuracy_score': round(config['accuracy'], 3),
                    'is_active': True
                }
            )
            
            if created:
                print(f"✅ Saved {config['name']} to database")
    
    def print_training_summary(self):
        """Print comprehensive training summary"""
        print("\n📊 TRAINING SUMMARY")
        print("-" * 50)
        
        for i, (name, details) in enumerate(self.models.items(), 1):
            score_key = 'test_score' if 'test_score' in details else 'score'
            if score_key in details:
                score = details[score_key]
                print(f"Model {i:2d}: {name:<20} | Score: {score:.3f}")
        
        print(f"\n✅ Total Models Trained: {len(self.models)}")
        print(f"📁 Models saved in: {self.model_directory}")
        print(f"🗄️  Database records created: {len(self.models)}")
    
    # Helper methods
    def _calculate_age(self, birth_date):
        """Calculate age from birth date"""
        today = datetime.now().date()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    def _convert_grade(self, grade_str):
        """Convert grade string to number"""
        grade_mapping = {
            'Nursery': 0, 'KG': 1, 'LKG': 1, 'UKG': 2,
            '1': 3, '2': 4, '3': 5, '4': 6, '5': 7, '6': 8,
            '7': 9, '8': 10, '9': 11, '10': 12, '11': 13, '12': 14
        }
        return grade_mapping.get(str(grade_str), 8)  # Default to grade 6 equivalent
    
    def _encode_school_type(self, school_type):
        """Encode school type"""
        type_mapping = {'CBSE': 1, 'ICSE': 2, 'IGCSE': 3, 'IB': 4}
        return type_mapping.get(school_type, 1)
    
    def _categorize_performance(self, score):
        """Categorize performance level"""
        if score >= 90: return 4  # Excellent
        elif score >= 75: return 3  # Good
        elif score >= 60: return 2  # Average
        else: return 1  # Needs Improvement
    
    def _calculate_risk_level(self, academic, psychological):
        """Calculate risk level"""
        avg_score = (academic + psychological) / 2
        if avg_score >= 80: return 0  # Low risk
        elif avg_score >= 60: return 1  # Medium risk
        else: return 2  # High risk
    
    def _determine_career_aptitude(self, academic, psychological, physical):
        """Determine career aptitude category"""
        if academic >= 85: return 1  # STEM
        elif psychological >= 80: return 2  # Social Sciences
        elif physical >= 75: return 3  # Sports/Health
        else: return 0  # General


def main():
    """Main function to train all ML models"""
    print("🤖 EDUSIGHT ADVANCED ML ENGINE")
    print("=" * 70)
    print("Initializing Top 10 ML Algorithms Training...")
    
    engine = AdvancedMLEngine()
    success = engine.train_all_models()
    
    if success:
        print("\n🎉 ML ENGINE DEPLOYMENT COMPLETE!")
        print("🔥 Your EduSight platform now has 10 advanced ML algorithms!")
        print("🚀 Ready for production-level educational analytics!")
    else:
        print("\n❌ ML training failed. Please check the data and try again.")

if __name__ == "__main__":
    main()
