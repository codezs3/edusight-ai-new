"""
Django models for the dashboard app.
"""

from django.db import models
from django.utils import timezone
from students.models import User, School


class DashboardWidget(models.Model):
    """Dashboard widget model for customizable dashboard components."""
    
    WIDGET_TYPE_CHOICES = [
        ('stat_card', 'Statistics Card'),
        ('chart', 'Chart'),
        ('table', 'Data Table'),
        ('progress', 'Progress Bar'),
        ('alert', 'Alert/Notification'),
        ('quick_action', 'Quick Action'),
    ]
    
    CHART_TYPE_CHOICES = [
        ('line', 'Line Chart'),
        ('bar', 'Bar Chart'),
        ('pie', 'Pie Chart'),
        ('doughnut', 'Doughnut Chart'),
        ('radar', 'Radar Chart'),
        ('scatter', 'Scatter Plot'),
    ]
    
    name = models.CharField(max_length=100)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPE_CHOICES)
    chart_type = models.CharField(max_length=20, choices=CHART_TYPE_CHOICES, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # Widget configuration
    config = models.JSONField(default=dict)  # Widget-specific configuration
    data_source = models.CharField(max_length=100)  # Data source identifier
    refresh_interval = models.IntegerField(default=300)  # Refresh interval in seconds
    
    # Display settings
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    width = models.IntegerField(default=4)  # Grid width (1-12)
    height = models.IntegerField(default=3)  # Grid height
    is_visible = models.BooleanField(default=True)
    is_resizable = models.BooleanField(default=True)
    is_draggable = models.BooleanField(default=True)
    
    # Access control
    allowed_roles = models.JSONField(default=list)  # Roles that can see this widget
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='dashboard_widgets', blank=True, null=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_widgets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_widgets'
        ordering = ['position_y', 'position_x']
    
    def __str__(self):
        return f"{self.name} - {self.get_widget_type_display()}"


class UserDashboard(models.Model):
    """User dashboard model for personalized dashboard layouts."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dashboard')
    title = models.CharField(max_length=255, default='My Dashboard')
    description = models.TextField(blank=True, null=True)
    
    # Layout configuration
    layout_config = models.JSONField(default=dict)  # Dashboard layout configuration
    theme = models.CharField(max_length=50, default='default')
    sidebar_collapsed = models.BooleanField(default=False)
    
    # Widgets
    widgets = models.ManyToManyField(DashboardWidget, through='UserWidget', related_name='user_dashboards')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_dashboards'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"


class UserWidget(models.Model):
    """User widget model for managing user-specific widget configurations."""
    
    user_dashboard = models.ForeignKey(UserDashboard, on_delete=models.CASCADE, related_name='user_widgets')
    widget = models.ForeignKey(DashboardWidget, on_delete=models.CASCADE, related_name='user_widget_instances')
    
    # User-specific configuration
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    width = models.IntegerField(default=4)
    height = models.IntegerField(default=3)
    is_visible = models.BooleanField(default=True)
    custom_config = models.JSONField(default=dict)  # User-specific widget configuration
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_widgets'
        unique_together = ['user_dashboard', 'widget']
    
    def __str__(self):
        return f"{self.user_dashboard.user.get_full_name()} - {self.widget.name}"


class DashboardNotification(models.Model):
    """Dashboard notification model for system notifications."""
    
    NOTIFICATION_TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('alert', 'Alert'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default='info')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Target audience
    recipients = models.ManyToManyField(User, related_name='dashboard_notifications')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='dashboard_notifications', blank=True, null=True)
    
    # Notification settings
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    # Action data
    action_url = models.CharField(max_length=255, blank=True, null=True)
    action_text = models.CharField(max_length=100, blank=True, null=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_notifications')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'dashboard_notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_notification_type_display()}"


class DashboardActivity(models.Model):
    """Dashboard activity model for tracking user activities."""
    
    ACTIVITY_TYPE_CHOICES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('view_dashboard', 'View Dashboard'),
        ('view_student', 'View Student'),
        ('view_assessment', 'View Assessment'),
        ('generate_report', 'Generate Report'),
        ('export_data', 'Export Data'),
        ('update_settings', 'Update Settings'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboard_activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    description = models.TextField()
    
    # Activity details
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Related objects
    related_student = models.ForeignKey('students.Student', on_delete=models.CASCADE, blank=True, null=True)
    related_assessment = models.ForeignKey('assessments.Assessment', on_delete=models.CASCADE, blank=True, null=True)
    
    # Metadata
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'dashboard_activities'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_activity_type_display()} - {self.created_at}"


class DashboardSetting(models.Model):
    """Dashboard setting model for user preferences."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dashboard_settings')
    
    # Display settings
    theme = models.CharField(max_length=50, default='default')
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    
    # Dashboard preferences
    auto_refresh = models.BooleanField(default=True)
    refresh_interval = models.IntegerField(default=300)  # seconds
    show_notifications = models.BooleanField(default=True)
    show_quick_actions = models.BooleanField(default=True)
    
    # Chart preferences
    default_chart_type = models.CharField(max_length=20, default='line')
    chart_animations = models.BooleanField(default=True)
    chart_colors = models.JSONField(default=list)
    
    # Export preferences
    default_export_format = models.CharField(max_length=10, default='pdf')
    include_charts_in_exports = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_settings'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Dashboard Settings"
