from datetime import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes   
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
User = get_user_model()

@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(email=email, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "User created successfully",
        "token": str(refresh.access_token)
    }, status=status.HTTP_201_CREATED)

# @csrf_exempt
# def register(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')

#         if CustomUser.objects.filter(email=email).exists():
#             return JsonResponse({"error": "Email already registered"}, status=400)

#         user = CustomUser.objects.create(email=email, password=make_password(password))
#         return JsonResponse({"message": "User registered successfully"}, status=201)

#     return JsonResponse({"error": "Invalid request"}, status=400)


# @api_view(['POST'])
# def login_user(request):
#     email = request.data.get('email')
#     password = request.data.get('password')

#     user = authenticate(request, username=email, password=password)

#     if user is None:
#         return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

#     refresh = RefreshToken.for_user(user)

#     return Response({
#         "message": "Login successful",
#         "token": str(refresh.access_token),
#         "user": {"email": user.email}
#     }, status=status.HTTP_200_OK)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    access = refresh.access_token  # Get access token from refresh

    return Response({
        "message": "Login successful",
        "access_token": str(access),
        "refresh_token": str(refresh),
        "user": {"email": user.email}
    }, status=status.HTTP_200_OK)




@api_view(['POST'])
# @permission_classes([IsAuthenticated])   
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Received refresh token: {refresh_token}")   

        try:
            token = RefreshToken(refresh_token)
            print(f"Token payload: {token.payload}")   
            
            token.blacklist()   
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(f"Token Error: {str(e)}")  
            return Response({"error": "Invalid or already logged out token"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Unexpected error: {str(e)}") 
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def home(request):
    if request.user.is_authenticated:
        return JsonResponse({"message": f"Welcome, {request.user.email}!"})
    return JsonResponse({"error": "Unauthorized"}, status=401)


@api_view(['POST'])
def forgot_password(request):
    print("Received data:", request.data)  # Debugging line

    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

    # Generate a 6-digit OTP
    otp = random.randint(100000, 999999)

    # Save OTP in database (assuming PasswordResetOTP model exists)
    PasswordResetOTP.objects.update_or_create(
        user=user, defaults={"otp": otp, "created_at": now()}
    )

    # Send OTP via email
    try:
        send_mail(
            subject="Your Password Reset OTP",
            message=f"Your OTP for password reset is: {otp}. It is valid for 10 minutes.",
            from_email="dharshinispriya1710@gmail.com",
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
 
@api_view(['GET'])   # Allow access without authentication
def get_user_profile(request):
    try:
        user_id = request.GET.get('id')  # Get user ID from query params
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        user = CustomUser.objects.get(id=user_id)  # Fetch user by ID

        return JsonResponse({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
        })

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
 
 
 
# ✅ GET (List) & POST (Create) Departments
@api_view(['GET', 'POST']) 
def department_list(request):
    if request.method == 'GET':
        departments = Department.objects.all()
        data = [
            {
                "id": dept.id,
                "name": dept.name,
                "description": dept.description,
                "department_code": dept.department_code,
                "phone_number": dept.phone_number,
                "email": dept.email,
                "location": dept.location,
                "num_employees": dept.num_employees,
                "remarks": dept.remarks,
                "is_active": dept.is_active,
                "status": dept.status,
                "created_at": dept.created_at,
                "updated_at": dept.updated_at, 
            }
            for dept in departments
        ]
        return Response(data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        name = request.data.get("name")
        description = request.data.get("description")
        department_code = request.data.get("department_code")
        phone_number = request.data.get("phone_number")
        email = request.data.get("email")
        location = request.data.get("location")
        num_employees = request.data.get("num_employees", 0)
        remarks = request.data.get("remarks")
        is_active = request.data.get("is_active", True) 

        if not name or not department_code:
            return Response({"error": "Name and Department Code are required"}, status=status.HTTP_400_BAD_REQUEST)

        department = Department.objects.create(
            name=name,
            description=description,
            department_code=department_code,
            phone_number=phone_number,
            email=email,
            location=location,
            num_employees=num_employees,
            remarks=remarks,
            is_active=is_active,
            status=0, 
        )

        return Response(
            {
                "id": department.id,
                "name": department.name,
                "description": department.description,
                "department_code": department.department_code,
                "phone_number": department.phone_number,
                "email": department.email,
                "location": department.location,
                "num_employees": department.num_employees,
                "remarks": department.remarks,
                "is_active": department.is_active,
                "status": department.status,
                "created_at": department.created_at,
                "updated_at": department.updated_at, 
            },
            status=status.HTTP_201_CREATED
        )

# ✅ GET (Retrieve), PUT (Update), DELETE (Remove) Single Department
@api_view(['GET', 'PUT', 'DELETE']) 
def department_detail(request, pk):
    try:
        department = Department.objects.get(pk=pk)
    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(
            {
                "id": department.id,
                "name": department.name,
                "description": department.description,
                "department_code": department.department_code,
                "phone_number": department.phone_number,
                "email": department.email,
                "location": department.location,
                "num_employees": department.num_employees,
                "remarks": department.remarks,
                "is_active": department.is_active,
                "status": department.status,
                "created_at": department.created_at,
                "updated_at": department.updated_at, 
            }
        )

    elif request.method == 'PUT':
        department.name = request.data.get("name", department.name)
        department.description = request.data.get("description", department.description)
        department.department_code = request.data.get("department_code", department.department_code)
        department.phone_number = request.data.get("phone_number", department.phone_number)
        department.email = request.data.get("email", department.email)
        department.location = request.data.get("location", department.location)
        department.num_employees = request.data.get("num_employees", department.num_employees)
        department.remarks = request.data.get("remarks", department.remarks)
        department.is_active = request.data.get("is_active", department.is_active) 
        department.save()

        return Response(
            {
                "id": department.id,
                "name": department.name,
                "description": department.description,
                "department_code": department.department_code,
                "phone_number": department.phone_number,
                "email": department.email,
                "location": department.location,
                "num_employees": department.num_employees,
                "remarks": department.remarks,
                "is_active": department.is_active,
                "status": department.status,
                "created_at": department.created_at,
                "updated_at": department.updated_at, 
            },
            status=status.HTTP_200_OK
        )

    elif request.method == 'DELETE':
        department.delete()
        return Response({"message": "Department deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

 
@api_view(['GET', 'POST'])
def role_list(request):
    if request.method == 'GET':
        roles = Role.objects.all()
        data = [
            {
                "id": role.id,
                "name": role.name,
                "department": role.department.id if role.department else None,
                "description": role.description,
                "status": role.status,
                "created_at": role.created_at,
                "updated_at": role.updated_at, 
            }
            for role in roles
        ]
        return Response(data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        name = request.data.get('name')
        department_id = request.data.get('department')
        description = request.data.get('description', '') 

        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        department = get_object_or_404(Department, id=department_id) if department_id else None 

        role = Role.objects.create(
            name=name,
            department=department,
            description=description,
            status=0, 
        )

        return Response(
            {
                "id": role.id,
                "name": role.name,
                "department": role.department.id if role.department else None,
                "description": role.description,
                "status": role.status,
                "created_at": role.created_at,
                "updated_at": role.updated_at, 
            },
            status=status.HTTP_201_CREATED
        )


@api_view(['GET', 'PUT', 'DELETE'])
def role_detail(request, pk):
    role = get_object_or_404(Role, pk=pk)

    if request.method == 'GET':
        data = {
            "id": role.id,
            "name": role.name,
            "department": role.department.id if role.department else None,
            "description": role.description,
            "status": role.status,
            "created_at": role.created_at,
            "updated_at": role.updated_at,
            "created_by": role.created_by.id if role.created_by else None,
            "updated_by": role.updated_by.id if role.updated_by else None,
        }
        return Response(data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        role.name = request.data.get('name', role.name)
        department_id = request.data.get('department')
        role.description = request.data.get('description', role.description) 

        if department_id:
            role.department = get_object_or_404(Department, id=department_id)
 

        role.updated_at = timezone.now()  # Auto-update timestamp
        role.save()

        return Response(
            {
                "id": role.id,
                "name": role.name,
                "department": role.department.id if role.department else None,
                "description": role.description, 
                "created_at": role.created_at,
                "updated_at": role.updated_at, 
            },
            status=status.HTTP_200_OK
        )

    elif request.method == 'DELETE':
        role.delete()
        return Response({"message": "Role deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
def client_list(request):
    if request.method == 'GET':
        clients = Client.objects.all()
        data = [
            {
                "id": client.id,
                "name": client.name,
                "email": client.email,
                "phone": client.phone,
                "address": client.address,
                "company_name": client.company_name,
                "website": client.website,
                "description": client.description,
                "tax_id": client.tax_id,
                "tax_registration_number": client.tax_registration_number,
                "tax_country": client.tax_country,
                "tax_documents": client.tax_documents.url if client.tax_documents else None,
                "bank_name": client.bank_name,
                "bank_account_number": client.bank_account_number,
                "payment_terms": client.payment_terms,
                "currency": client.currency,
                "photo": client.photo.url if client.photo else None,
                "id_proof": client.id_proof.url if client.id_proof else None,
                "status": client.status,
                "created_at": client.created_at,
                "updated_at": client.updated_at,
                "created_by": client.created_by.id if client.created_by else None,
                "updated_by": client.updated_by.id if client.updated_by else None,
            }
            for client in clients
        ]
        return Response(data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        data = request.data
        client = Client.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            company_name=data.get('company_name'),
            website=data.get('website'),
            description=data.get('description'),
            tax_id=data.get('tax_id'),
            tax_registration_number=data.get('tax_registration_number'),
            tax_country=data.get('tax_country'),
            bank_name=data.get('bank_name'),
            bank_account_number=data.get('bank_account_number'),
            payment_terms=data.get('payment_terms'),
            currency=data.get('currency'),
            status=data.get('status', 1),
            created_by=request.user if request.user.is_authenticated else None,
        )
        return Response({"id": client.id, "message": "Client created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def client_detail(request, pk):
    client = get_object_or_404(Client, pk=pk)
    
    if request.method == 'GET':
        data = {
            "id": client.id,
            "name": client.name,
            "email": client.email,
            "phone": client.phone,
            "address": client.address,
            "company_name": client.company_name,
            "website": client.website,
            "description": client.description,
            "tax_id": client.tax_id,
            "tax_registration_number": client.tax_registration_number,
            "tax_country": client.tax_country,
            "tax_documents": client.tax_documents.url if client.tax_documents else None,
            "bank_name": client.bank_name,
            "bank_account_number": client.bank_account_number,
            "payment_terms": client.payment_terms,
            "currency": client.currency,
            "photo": client.photo.url if client.photo else None,
            "id_proof": client.id_proof.url if client.id_proof else None,
            "status": client.status,
            "created_at": client.created_at,
            "updated_at": client.updated_at,
            "created_by": client.created_by.id if client.created_by else None,
            "updated_by": client.updated_by.id if client.updated_by else None,
        }
        return Response(data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        data = request.data
        client.name = data.get('name', client.name)
        client.email = data.get('email', client.email)
        client.phone = data.get('phone', client.phone)
        client.address = data.get('address', client.address)
        client.company_name = data.get('company_name', client.company_name)
        client.website = data.get('website', client.website)
        client.description = data.get('description', client.description)
        client.tax_id = data.get('tax_id', client.tax_id)
        client.tax_registration_number = data.get('tax_registration_number', client.tax_registration_number)
        client.tax_country = data.get('tax_country', client.tax_country)
        client.bank_name = data.get('bank_name', client.bank_name)
        client.bank_account_number = data.get('bank_account_number', client.bank_account_number)
        client.payment_terms = data.get('payment_terms', client.payment_terms)
        client.currency = data.get('currency', client.currency)
        client.status = data.get('status', client.status)
        client.updated_by = request.user if request.user.is_authenticated else None
        client.save()
        return Response({"message": "Client updated successfully"}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        client.delete()
        return Response({"message": "Client deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
 
@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        data = [
            {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "department": project.department.id if project.department else None,
                "role": project.role.id if project.role else None,
                "project_validity": project.project_validity,
                "project_start_date": project.project_start_date,
                "project_end_date": project.project_end_date,
                "estimated_completion_date": project.estimated_completion_date,
                "actual_completion_date": project.actual_completion_date,
                "reasons": project.reasons,
                "status": project.status,
                "priority": project.priority,
                "budget": str(project.budget),
                "progress": project.progress,
                "client": project.client.id if project.client else None,
                "team_members": list(project.team_members.values_list('id', flat=True)),
                "tags": project.tags,
                "project_status": project.project_status.id if project.project_status else None,
                "is_archived": project.is_archived,
                "project_code": project.project_code,
                "created_at": project.created_at,
                "updated_at": project.updated_at,
                "created_by": project.created_by.id if project.created_by else None,
                "updated_by": project.updated_by.id if project.updated_by else None,
            }
            for project in projects
        ]
        return Response(data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        data = request.data
        project = Project.objects.create(
            name=data.get('name'),
            description=data.get('description'),
            department_id=data.get('department'),
            role_id=data.get('role'),
            project_validity=data.get('project_validity'),
            project_start_date=data.get('project_start_date'),
            project_end_date=data.get('project_end_date'),
            estimated_completion_date=data.get('estimated_completion_date'),
            actual_completion_date=data.get('actual_completion_date'),
            reasons=data.get('reasons'),
            status=data.get('status'),
            priority=data.get('priority', 2),
            budget=data.get('budget'),
            progress=data.get('progress', 0),
            client_id=data.get('client'),
            tags=data.get('tags'),
            project_status_id=data.get('project_status'),
            is_archived=data.get('is_archived', False),
            project_code=data.get('project_code'),
            created_by=request.user if request.user.is_authenticated else None,
        )
        if 'team_members' in data:
            project.team_members.set(data.get('team_members'))
        return Response({"id": project.id, "message": "Project created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    
    if request.method == 'GET':
        data = {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "department": project.department.id if project.department else None,
            "role": project.role.id if project.role else None,
            "project_validity": project.project_validity,
            "project_start_date": project.project_start_date,
            "project_end_date": project.project_end_date,
            "estimated_completion_date": project.estimated_completion_date,
            "actual_completion_date": project.actual_completion_date,
            "reasons": project.reasons,
            "status": project.status,
            "priority": project.priority,
            "budget": str(project.budget),
            "progress": project.progress,
            "client": project.client.id if project.client else None,
            "team_members": list(project.team_members.values_list('id', flat=True)),
            "tags": project.tags,
            "project_status": project.project_status.id if project.project_status else None,
            "is_archived": project.is_archived,
            "project_code": project.project_code,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
            "created_by": project.created_by.id if project.created_by else None,
            "updated_by": project.updated_by.id if project.updated_by else None,
        }
        return Response(data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        data = request.data
        project.name = data.get('name', project.name)
        project.description = data.get('description', project.description)
        project.department_id = data.get('department', project.department_id)
        project.role_id = data.get('role', project.role_id)
        project.project_validity = data.get('project_validity', project.project_validity)
        project.project_start_date = data.get('project_start_date', project.project_start_date)
        project.project_end_date = data.get('project_end_date', project.project_end_date)
        project.estimated_completion_date = data.get('estimated_completion_date', project.estimated_completion_date)
        project.actual_completion_date = data.get('actual_completion_date', project.actual_completion_date)
        project.reasons = data.get('reasons', project.reasons)
        project.status = data.get('status', project.status)
        project.priority = data.get('priority', project.priority)
        project.budget = data.get('budget', project.budget)
        project.progress = data.get('progress', project.progress)
        project.client_id = data.get('client', project.client_id)
        project.tags = data.get('tags', project.tags)
        project.project_status_id = data.get('project_status', project.project_status_id)
        project.is_archived = data.get('is_archived', project.is_archived)
        project.project_code = data.get('project_code', project.project_code)
        project.updated_by = request.user if request.user.is_authenticated else None
        if 'team_members' in data:
            project.team_members.set(data.get('team_members'))
        project.save()
        return Response({"message": "Project updated successfully"}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response({"message": "Project deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


