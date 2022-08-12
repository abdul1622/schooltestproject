
from django.urls import path

from accounts.views import SignupView
from .frontendviews import *


urlpatterns=[
    path('',land,name='land'),
    path('home/',home,name='home'),
    path('signup/',SignupView,name='signup'),
    path('login/',simple,name='simple'),
    path('profile/',profile,name='profile'),
     path('students/',students,name='userdetails'),
     path('staffs/',staff,name='staff')
]