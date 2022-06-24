from django.urls import path
from.frontendviews import *
urlpatterns = [
    path('signup', signupview, name='signup'),
    path('weblogin', signin, name='login'),
    path('websimplelogin', simple, name='simplelogin'),
    path('websignout', websignout, name='websignout'),
    path('webprofile', profile, name='profile'),
    path('editprofile', editprofile, name='editprofile'),
    path('home',home,name='home')
]
