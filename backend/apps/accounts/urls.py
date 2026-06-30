from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),

    # Profile
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('auth/upload-resume/', views.ResumeUploadView.as_view(), name='upload_resume'),

    # Admin
    path('auth/admin-stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    path('auth/admin-users/', views.AdminUsersView.as_view(), name='admin_users'),
    path('auth/admin-users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin_user_detail'),
]