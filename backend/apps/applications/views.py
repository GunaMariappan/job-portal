from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Application, SavedJob, JobReport
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusSerializer,
    SavedJobSerializer,
    JobReportSerializer,
)


class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'candidate'


class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'recruiter'


class ApplicationCreateView(generics.CreateAPIView):
    permission_classes = [IsCandidate]
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyApplicationsView(generics.ListAPIView):
    permission_classes = [IsCandidate]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.filter(
            candidate=self.request.user
        ).select_related('job', 'candidate')


class JobApplicationsView(generics.ListAPIView):
    permission_classes = [IsRecruiter]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(
            job__id=job_id,
            job__recruiter=self.request.user
        ).select_related('job', 'candidate', 'candidate__candidate_profile')


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsRecruiter]
    serializer_class = ApplicationStatusSerializer

    def get_queryset(self):
        return Application.objects.filter(
            job__recruiter=self.request.user
        )

    def patch(self, request, *args, **kwargs):
        application = self.get_object()
        serializer = ApplicationStatusSerializer(
            application, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class RecruiterStatsView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request):
        from apps.jobs.models import Job
        jobs = Job.objects.filter(recruiter=request.user)
        applications = Application.objects.filter(job__recruiter=request.user)
        return Response({
            'total_jobs': jobs.count(),
            'total_applications': applications.count(),
            'pending': applications.filter(status='pending').count(),
            'reviewing': applications.filter(status='reviewing').count(),
            'accepted': applications.filter(status='accepted').count(),
            'rejected': applications.filter(status='rejected').count(),
        })


class SavedJobListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsCandidate]
    serializer_class = SavedJobSerializer

    def get_queryset(self):
        return SavedJob.objects.filter(
            candidate=self.request.user
        ).select_related('job')


class SavedJobDeleteView(APIView):
    permission_classes = [IsCandidate]

    def delete(self, request, job_id):
        try:
            saved = SavedJob.objects.get(
                candidate=request.user,
                job__id=job_id
            )
            saved.delete()
            return Response({'message': 'Job removed from saved'}, status=204)
        except SavedJob.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)


class AdminApplicationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied('Admin only')
        return Application.objects.all().select_related(
            'job', 'candidate', 'candidate__candidate_profile'
        )


# ✅ New — Report Job Views

# Candidate — Report a job
class JobReportCreateView(generics.CreateAPIView):
    permission_classes = [IsCandidate]
    serializer_class = JobReportSerializer


# Admin — View all reports
class AdminReportsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobReportSerializer

    def get_queryset(self):
        if self.request.user.role != 'admin':
            raise permissions.PermissionDenied('Admin only')
        status_filter = self.request.query_params.get('status')
        queryset = JobReport.objects.all().select_related('job', 'candidate')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


# Admin — Update report status + Delete reported job
class AdminReportDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        try:
            report = JobReport.objects.get(pk=pk)
            report.status = request.data.get('status', report.status)
            report.save()
            return Response(JobReportSerializer(report).data)
        except JobReport.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        try:
            report = JobReport.objects.get(pk=pk)
            # Delete the reported job too
            report.job.delete()
            report.delete()
            return Response({'message': 'Job and report deleted!'}, status=204)
        except JobReport.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)