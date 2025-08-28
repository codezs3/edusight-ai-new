"""
Database routers for Edusight Django project.
Handles routing to different databases for analytics and ML cache operations.
"""

class AnalyticsRouter:
    """
    A router to control all database operations on models for the
    analytics application.
    """
    route_app_labels = {'data_analytics'}

    def db_for_read(self, model, **hints):
        """
        Attempts to read analytics models go to analytics database.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'analytics'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write analytics models go to analytics database.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'analytics'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the analytics app is involved.
        """
        if obj1._meta.app_label in self.route_app_labels or \
           obj2._meta.app_label in self.route_app_labels:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the analytics app's models get created on the right database.
        """
        if app_label in self.route_app_labels:
            return db == 'analytics'
        return None


class MLCacheRouter:
    """
    A router to control all database operations on models for the
    ML cache application.
    """
    route_app_labels = {'ml_predictions'}

    def db_for_read(self, model, **hints):
        """
        Attempts to read ML cache models go to ml_cache database.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'ml_cache'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write ML cache models go to ml_cache database.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'ml_cache'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the ML cache app is involved.
        """
        if obj1._meta.app_label in self.route_app_labels or \
           obj2._meta.app_label in self.route_app_labels:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the ML cache app's models get created on the right database.
        """
        if app_label in self.route_app_labels:
            return db == 'ml_cache'
        return None
