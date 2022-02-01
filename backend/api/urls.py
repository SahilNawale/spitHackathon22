from django.urls import path
from api import views

urlpatterns = [
    path('',views.LandingView.as_view(),name='landing'),
    path('',views.IndexView.as_view(),name='index'),
    path('signup/',views.signup,name="create_user"),
    path('login/',views.user_login,name='login'),
    path('collegelist/',views.CollegeListView.as_view(),name="all_college"),
    path('logout/',views.user_logout,name="logout"),
    path('dataExtract/',views.dataextract,name="data_extra"),
    path('collegeTour/',views.collegeTourView,name="tour_college"),
    path('college/<int:pk>',views.CollegeDetailView.as_view(),name="detail_college"),
    path('chatbot/',views.ChatbotView.as_view(),name="chatbot_help"),
    # path('',views.LandingView.as_view(),name='landing'),

]