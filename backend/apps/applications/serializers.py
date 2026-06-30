from rest_framework import serializers
from .models import Application, SavedJob, JobReport
from apps.jobs.serializers import JobSerializer
from apps.accounts.models import CandidateProfile


class CandidateProfileNestedSerializer(serializers.ModelSerializer):
    class Meta:
        from apps.accounts.models import CandidateProfile
        model = CandidateProfile
        fields = ['phone', 'location', 'skills', 'experience_years', 'education', 'resume']


class CandidateDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    email = serializers.CharField()
    profile = serializers.SerializerMethodField()

    def get_profile(self, obj):
        try:
            profile = obj.candidate_profile
            return CandidateProfileNestedSerializer(profile).data
        except Exception:
            return {}


class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    candidate_details = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'candidate', 'job', 'cover_letter',
            'status', 'applied_at', 'updated_at',
            'job_details', 'candidate_details'
        ]
        read_only_fields = ['id', 'candidate', 'status', 'applied_at', 'updated_at']

    def get_candidate_details(self, obj):
        return CandidateDetailSerializer(obj.candidate).data

    def validate_job(self, value):
        request = self.context['request']
        if Application.objects.filter(candidate=request.user, job=value).exists():
            raise serializers.ValidationError('You have already applied for this job')
        return value

    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'status']


class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'candidate', 'job', 'job_details', 'saved_at']
        read_only_fields = ['id', 'candidate', 'saved_at']

    def validate_job(self, value):
        request = self.context['request']
        if SavedJob.objects.filter(candidate=request.user, job=value).exists():
            raise serializers.ValidationError('Job already saved')
        return value

    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)


# ✅ New — JobReport Serializer
class JobReportSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)

    class Meta:
        model = JobReport
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email',
            'job', 'job_details', 'reason', 'description',
            'status', 'reported_at', 'updated_at'
        ]
        read_only_fields = ['id', 'candidate', 'status', 'reported_at', 'updated_at']

    def validate_job(self, value):
        request = self.context['request']
        if JobReport.objects.filter(candidate=request.user, job=value).exists():
            raise serializers.ValidationError('You have already reported this job')
        return value

    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)