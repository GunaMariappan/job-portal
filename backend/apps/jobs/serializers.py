from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    application_count = serializers.IntegerField(read_only=True)
    recruiter_name = serializers.CharField(source='recruiter.full_name', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'recruiter', 'recruiter_name', 'title', 'company_name',
            'location', 'category', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'vacancies', 'description',
            'requirements', 'skills_required', 'is_active',
            'application_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at']


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'company_name', 'location', 'category',
            'job_type', 'experience_level', 'salary_min', 'salary_max',
            'vacancies', 'description', 'requirements',
            'skills_required', 'is_active'
        ]

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)