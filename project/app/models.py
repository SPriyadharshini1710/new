from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = None  # Remove username field

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Remove username requirement

    objects = CustomUserManager()  # Use custom user manager

    def __str__(self):
        return self.email

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.created_at >= now() - timedelta(minutes=10)  # OTP valid for 10 minutes

class Department(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    department_code = models.IntegerField(null=True,blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True) 
    num_employees = models.IntegerField(default=0,null=True,blank=True) 
    remarks = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True) 
    description = models.TextField(null=True,blank=True)
    status= models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_department",null=True,blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_department",null=True,blank=True)

    def __str__(self):
        return self.name

class Role(models.Model):
    name = models.CharField(max_length=255)
    # role_code = models.CharField(max_length=50, blank=True, null=True)  # Unique Role Code
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="roles", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    # permissions = models.TextField(blank=True, null=True)  # Stores JSON or CSV permissions
    # hierarchy_level = models.IntegerField(default=0,blank=True, null=True)  # Defines role hierarchy
    # salary_range = models.CharField(max_length=100, blank=True, null=True)  # Expected salary range
    # reporting_to = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subordinates")  # Reporting Manager
    status = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)  # Fixed auto_now_add issue
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_role", null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_role", null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

class ProjectDurations(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    status= models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_package_duration",null=True,blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_package_duration",null=True,blank=True)

class Client(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    # Tax Details
    tax_id = models.CharField(max_length=100, null=True, blank=True)  # Unique Taxpayer ID
    tax_registration_number = models.CharField(max_length=100, null=True, blank=True)  # Business Tax Reg. Number
    tax_country = models.CharField(max_length=100, null=True, blank=True)  # Country of tax registration
    tax_documents = models.FileField(upload_to='client_tax_documents/', null=True, blank=True)  # Tax Certificates

    # Financial Details
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    bank_account_number = models.CharField(max_length=50, null=True, blank=True)
    payment_terms = models.CharField(max_length=100, null=True, blank=True, help_text="e.g., Net 30, Net 60")
    currency = models.CharField(max_length=10, null=True, blank=True, help_text="e.g., USD, EUR")

    # Identity Proof & Photos
    photo = models.ImageField(upload_to='client_photos/', null=True, blank=True)
    id_proof = models.FileField(upload_to='client_id_proofs/', null=True, blank=True)

    status = models.IntegerField(default=1, help_text="1: Active, 0: Inactive")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_client", null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_client", null=True, blank=True)

    def __str__(self):
        return self.name

class ProjectStatus(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    status = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True,blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_project_status", null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_project_status", null=True, blank=True)

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name="project_department")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True, related_name="project_role")
    project_validity = models.IntegerField(null=True, blank=True)
    project_durations = models.ForeignKey(ProjectDurations, on_delete=models.CASCADE, null=True, blank=True, related_name="project_durations")
    project_start_date = models.DateField(null=True, blank=True)
    project_end_date = models.DateField(null=True, blank=True)
    estimated_completion_date = models.DateField(null=True, blank=True)
    actual_completion_date = models.DateField(null=True, blank=True)
    reasons = models.TextField(blank=True, null=True)
    status = models.IntegerField(null=True, blank=True)
    priority = models.IntegerField(choices=[(1, "Low"), (2, "Medium"), (3, "High"), (4, "Critical")], default=2)
    budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    progress = models.FloatField(default=0, help_text="Project completion in percentage")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True)
    team_members = models.ManyToManyField(CustomUser, related_name="assigned_projects")
    # attachments = models.ManyToManyField(ProjectAttachment, blank=True, related_name="project_attachments")
    tags = models.CharField(max_length=255, null=True, blank=True, help_text="Comma-separated tags")
    project_status = models.ForeignKey(ProjectStatus, on_delete=models.CASCADE, blank=True, null=True)
    is_archived = models.BooleanField(default=False)
    project_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="created_by_project", null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="updated_by_project", null=True, blank=True)

    def __str__(self):
        return self.name

