from django import forms
from django.contrib.auth.models import User
from api.models import StudentModel,CollegeModel,PdfModel

class studentForm(forms.ModelForm):
    password  = forms.CharField(widget=forms.PasswordInput())

    class Meta():
        model = User
        fields = ('username','password','email')

class studentExtraForm(forms.ModelForm):
    class Meta():
        model = StudentModel
        fields = ('percentile','address','pincode',)


class collegeForm(forms.ModelForm):
    class Meta():
        model = CollegeModel
        fields = '__all__'
    
    

class PdfForm(forms.ModelForm):
    class Meta():
        model = PdfModel
        fields = '__all__'
