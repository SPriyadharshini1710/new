from django.urls import path
from .views import client_detail, client_list, project_detail, project_list, register_user, login_user, home,forgot_password,get_user_profile,logout_user,department_list,department_detail, role_detail, role_list

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('home/', home, name='home'),
    path("forgot-password/", forgot_password, name="forgot_password"),
    path('profile/', get_user_profile, name='profile'), 
    path('departments/', department_list, name='department-list'),
    path('departments/<int:pk>/', department_detail, name='department-detail'),
    path('roles/', role_list, name='role-list'),
    path('roles/<int:pk>/', role_detail, name='role-detail'),
    path('clients/', client_list, name='client-list'),
    path('clients/<int:pk>/', client_detail, name='client-detail'),
    path('projects/', project_list, name='project-list'),
    path('projects/<int:pk>/', project_detail, name='project-detail'),
]
