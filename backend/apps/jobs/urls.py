from django.urls import path
from . import views

urlpatterns = [
    # Specific routes FIRST (before pk routes)
    path('jobs/my-jobs/', views.MyJobsView.as_view(), name='my_jobs'),
    path('jobs/admin-jobs/', views.AdminJobsView.as_view(), name='admin_jobs'),

    # Generic routes AFTER
    path('jobs/', views.JobListCreateView.as_view(), name='job_list_create'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job_detail'),
]