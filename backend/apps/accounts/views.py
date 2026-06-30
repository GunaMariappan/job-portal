from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, CandidateProfile, RecruiterProfile
from .serializers import (
    RegisterSerializer, UserSerializer,
    CandidateProfileSerializer, RecruiterProfileSerializer,
    AdminUserSerializer
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Registration successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)

        if not user:
            return Response(
                {'detail': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not user.is_active:
            return Response(
                {'detail': 'Account is deactivated'},
                status=status.HTTP_403_FORBIDDEN
            )

        tokens = get_tokens_for_user(user)
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'candidate':
            profile, _ = CandidateProfile.objects.get_or_create(user=user)
            return Response(CandidateProfileSerializer(profile).data)
        elif user.role == 'recruiter':
            profile, _ = RecruiterProfile.objects.get_or_create(user=user)
            return Response(RecruiterProfileSerializer(profile).data)
        return Response({'detail': 'No profile found'}, status=404)

    def put(self, request):
        user = request.user
        if user.role == 'candidate':
            profile, _ = CandidateProfile.objects.get_or_create(user=user)
            serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
        elif user.role == 'recruiter':
            profile, _ = RecruiterProfile.objects.get_or_create(user=user)
            serializer = RecruiterProfileSerializer(profile, data=request.data, partial=True)
        else:
            return Response({'detail': 'Not allowed'}, status=403)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'candidate':
            return Response({'detail': 'Only candidates can upload resume'}, status=403)

        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({'detail': 'No file provided'}, status=400)

        if not resume_file.name.endswith('.pdf'):
            return Response({'detail': 'Only PDF files allowed'}, status=400)

        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)
        profile.resume = resume_file
        profile.save()
        return Response({'message': 'Resume uploaded successfully'})


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        return Response({
            'total_users': User.objects.count(),
            'total_candidates': User.objects.filter(role='candidate').count(),
            'total_recruiters': User.objects.filter(role='recruiter').count(),
            'total_jobs': 0,
            'total_applications': 0,
        })


class AdminUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        users = User.objects.all().order_by('-date_joined')
        return Response(AdminUserSerializer(users, many=True).data)


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        try:
            user = User.objects.get(pk=pk)
            serializer = AdminUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Admin only'}, status=403)
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'User deleted'}, status=204)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)