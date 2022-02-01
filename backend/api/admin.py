from django.contrib import admin
from api.models import StudentModel,CollegeModel,PdfModel

# Register your models here.
admin.site.register(StudentModel)
admin.site.register(CollegeModel)
admin.site.register(PdfModel)

