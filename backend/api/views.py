from django.shortcuts import render
from django.views.generic import TemplateView, CreateView, ListView, DetailView
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse_lazy, reverse
from api.forms import PdfForm,studentExtraForm,studentForm,collegeForm
from api.models import StudentModel,CollegeModel,PdfModel
from django.contrib.auth.decorators import login_required
from pathlib import Path



# Create your views here.
# import pgeocode
# nomi = pgeocode.Nominatim('in')
# print(nomi.query_postal_code("401303").latitude)

import fitz

# idx == 11 for name
# idx == 105[2] for percentile

# print(text[11])
# print(text[105][15:])

# print(text)


class LandingView(TemplateView):
    template_name = "landing.html"


class IndexView(TemplateView):
    template_name = "index.html"

def join_in(request):
    
    return render(request, "join.html")


def signup(request):
    upload_form = PdfForm()

    # print("signup")
    registered = False

    userval = ""
    fullnameval = ""
    percentileval = ""


    # print(request.FILES)

    if 'pdf' in request.FILES and request.method == 'POST':
        print("Uploaded")

        pdfnew = PdfModel()
        pdfnew.pdf = request.FILES['pdf']
        pdfnew.save()

        BASE_DIR = Path(__file__).resolve().parent.parent
        file_path = str(BASE_DIR)+str(pdfnew.pdf.url)

        print(file_path)

        doc = fitz.Document(file_path) 
        page = doc[0]
        print(page.get_text())

        text = page.get_text().split('\n')
        userval = text[11]
        fullnameval = text[11]
        percentileval =  (text[105][15:])        
        upload_form = PdfForm()
        student_form=studentForm()
        student_extra_form = studentExtraForm()

        # print(text[11])
        # print(text[105][15:])

    elif request.method == 'POST':
        student_form = studentForm(data=request.POST)
        student_extra_form = studentExtraForm(data=request.POST)

        
        if student_form.is_valid() and student_extra_form.is_valid():
            user = student_form.save()
            user.set_password(user.password)
            user.save()
            extra = student_extra_form.save(commit=False)
            extra.user = user
            extra.save()
            registered = True

        else:
            print(student_form.errors)

    else:
        upload_form = PdfForm()
        student_form=studentForm()
        student_extra_form = studentExtraForm()
        

    return render(request,'signup.html',{'student_form':student_form,'student_extra_form':student_extra_form,'registered':registered,'upload_form':upload_form,
    'userval':userval,'fullnameval':fullnameval,'percentileval':percentileval})

def updateCollegeDistance(myPin):
    print("Updating")
    for clg in CollegeModel.objects.all():
        clg.updateDistance(myPin)


def user_login(request):

    if request.method == 'POST':

        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                updateCollegeDistance(user.user_profile.pincode)
                return HttpResponseRedirect(reverse_lazy('landing'))
            else:
                return HttpResponseRedirect("ACCOUNT NOT ACTIVE")

        else:
            print("Someone Tried to login and failed")
            return HttpResponse("invalid login details supplied!")
    else:
        return render(request, 'login.html')


class CollegeListView(ListView):
    model = CollegeModel
    context_object_name = 'colleges'
    template_name = 'college_list.html'

    # def get_queryset(self):
    #     order = self.request.GET.get('orderby', '-beds')
    #     return Hospital.objects.order_by(order)

    def get_context_data(self, **kwargs):
        context = super(CollegeListView, self).get_context_data(**kwargs)

        d1 = self.request.GET.get('clb',0)
        d1 = int(d1)
        d2 = self.request.GET.get('cub', 100)
        d2 = int(d2)
        d3 = self.request.GET.get('dist', 1000)
        d3 = int(d3)

        context['clb'] = d1
        context['cub'] = d2
        context['dist'] = d3

        return context


@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse_lazy('landing'))


def dataextract(request):
    name = request.FILES['file']
    doc = fitz.Document(name) 
    page = doc[0]
    print(page.get_text())


class CollegeDetailView(DetailView):
    model = CollegeModel
    template_name = 'college_detail.html'
    context_object_name = 'curr_college'

    # def get_context_data(self, **kwargs):
    #     # hosp_id = self.kwargs.get('pk')
    #     # hospital_curr = get_object_or_404(Hospital,pk=hosp_id)
    #     # print(hospital_curr.beds)
    #     print(self.request.user)
    #     context = super(HospitalDetailView, self).get_context_data(**kwargs)
    #     context['form'] = RequestForm
    #     return context

def collegeTourView(request):
    return render(request, 'tour.html')

class ChatbotView(TemplateView):
    template_name = "chatbot.html"