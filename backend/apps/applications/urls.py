from django.urls import path
from . import views

urlpatterns = [
    # Specific routes FIRST
    path('applications/my-applications/', views.MyApplicationsView.as_view(), name='my_applications'),
    path('applications/recruiter-stats/', views.RecruiterStatsView.as_view(), name='recruiter_stats'),
    path('applications/saved-jobs/', views.SavedJobListCreateView.as_view(), name='saved_jobs'),
    path('applications/saved-jobs/<int:job_id>/', views.SavedJobDeleteView.as_view(), name='saved_job_delete'),
    path('applications/job-applications/<int:job_id>/', views.JobApplicationsView.as_view(), name='job_applications'),
    path('applications/admin-applications/', views.AdminApplicationsView.as_view(), name='admin_applications'),

    # ✅ New Report URLs
    path('applications/report-job/', views.JobReportCreateView.as_view(), name='report_job'),
    path('applications/admin-reports/', views.AdminReportsView.as_view(), name='admin_reports'),
    path('applications/admin-reports/<int:pk>/', views.AdminReportDetailView.as_view(), name='admin_report_detail'),

    # Generic routes AFTER
    path('applications/', views.ApplicationCreateView.as_view(), name='apply'),
    path('applications/<int:pk>/', views.ApplicationStatusUpdateView.as_view(), name='application_status'),
]