from django.contrib import admin
from.models import *
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(PasswordResetOTP)
admin.site.register(Department)
admin.site.register(Role)
admin.site.register(ProjectDurations)
admin.site.register(Project)
admin.site.register(Client)
admin.site.register(ProjectStatus)




