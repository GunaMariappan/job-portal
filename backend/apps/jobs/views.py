from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer, JobCreateSerializer


class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'recruiter'


class IsRecruiterOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'recruiter'


# List all active jobs + Create job
class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobSerializer

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company_name__icontains=search) |
                Q(description__icontains=search) |
                Q(skills_required__icontains=search)
            )

        # Filters
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        experience = self.request.query_params.get('experience_level')
        if experience:
            queryset = queryset.filter(experience_level=experience)

        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != 'recruiter':
            raise permissions.PermissionDenied('Only recruiters can post jobs')
        serializer.save(recruiter=self.request.user)


# Retrieve, Update, Delete single job
class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.all()

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.recruiter != request.user and request.user.role != 'admin':
            return Response({'detail': 'Not authorized'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.recruiter != request.user and request.user.role != 'admin':
            return Response({'detail': 'Not authorized'}, status=403)
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


# Recruiter — My Jobs
class MyJobsView(generics.ListAPIView):
    permission_classes = [IsRecruiter]
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)


# Admin — All Jobs
class AdminJobsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobSerializer

    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied('Admin only')
        return Job.objects.all().order_by('-created_at')