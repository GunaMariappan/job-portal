from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, CandidateProfile, RecruiterProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'password2', 'role']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        if data.get('role') == 'admin':
            raise serializers.ValidationError({'role': 'Cannot register as admin'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        # Auto create profile based on role
        if user.role == 'candidate':
            CandidateProfile.objects.create(user=user)
        elif user.role == 'recruiter':
            RecruiterProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        if not user.is_active:
            raise serializers.ValidationError('Account is deactivated')
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'email', 'role', 'date_joined']


class CandidateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    resume = serializers.FileField(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'full_name', 'email', 'phone', 'location',
            'bio', 'skills', 'experience_years', 'education',
            'resume', 'linkedin_url', 'portfolio_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RecruiterProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = [
            'id', 'full_name', 'email', 'phone', 'company_name',
            'company_website', 'company_description', 'location',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'is_active', 'date_joined']