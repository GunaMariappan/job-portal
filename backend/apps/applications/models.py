from django.db import models
from apps.accounts.models import User
from apps.jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    candidate = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='applications',
        limit_choices_to={'role': 'candidate'}
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE,
        related_name='applications'
    )
    cover_letter = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['candidate', 'job']

    def __str__(self):
        return f"{self.candidate.full_name} → {self.job.title}"


class SavedJob(models.Model):
    candidate = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='saved_jobs',
        limit_choices_to={'role': 'candidate'}
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE,
        related_name='saved_by'
    )
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-saved_at']
        unique_together = ['candidate', 'job']

    def __str__(self):
        return f"{self.candidate.full_name} saved {self.job.title}"


# ✅ New — Job Report Model
class JobReport(models.Model):
    REASON_CHOICES = (
        ('fake_job', 'Fake Job'),
        ('inappropriate', 'Inappropriate Content'),
        ('spam', 'Spam'),
        ('wrong_salary', 'Wrong Salary Info'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    )

    candidate = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='job_reports',
        limit_choices_to={'role': 'candidate'}
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE,
        related_name='reports'
    )
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reported_at']
        unique_together = ['candidate', 'job']

    def __str__(self):
        return f"{self.candidate.full_name} reported {self.job.title}"