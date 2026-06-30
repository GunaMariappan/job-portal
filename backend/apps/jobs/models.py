from django.db import models
from apps.accounts.models import User


class Job(models.Model):
    CATEGORY_CHOICES = (
        ('Technology', 'Technology'),
        ('Healthcare', 'Healthcare'),
        ('Finance', 'Finance'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Engineering', 'Engineering'),
        ('Education', 'Education'),
        ('Startup', 'Startup'),
        ('Other', 'Other'),
    )

    JOB_TYPE_CHOICES = (
        ('Full-Time', 'Full-Time'),
        ('Part-Time', 'Part-Time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
        ('Freelance', 'Freelance'),
        ('Remote', 'Remote'),
    )

    EXPERIENCE_CHOICES = (
        ('Fresher', 'Fresher'),
        ('Junior', 'Junior'),
        ('Mid', 'Mid'),
        ('Senior', 'Senior'),
        ('Lead', 'Lead'),
        ('Manager', 'Manager'),
    )

    recruiter = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='posted_jobs',
        limit_choices_to={'role': 'recruiter'}
    )
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Technology')
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='Full-Time')
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_CHOICES, default='Junior')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    vacancies = models.PositiveIntegerField(default=1)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    skills_required = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company_name}"

    @property
    def application_count(self):
        return self.applications.count()