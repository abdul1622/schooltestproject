from urllib import response
from . forms import *
from re import sub
from django.contrib.auth import login,logout
from django.shortcuts import render,redirect
from .models import *
from django.contrib.auth.decorators import login_required
from django.utils.decorators import decorator_from_middleware
def user(request,email,phone):
    user= User.objects.get(email=email,phone=phone)
    if user:
        login(request,user)
def land(request):
    return render(request,'accounts/content.html')
def home(request):
    return render(request,'base.html')
def signup(request): 
    form=signup_form(data=request.POST)    
    return render(request,'accounts/signup.html',{'form':form})  

def simple(request):      
    form=login_form()
    return render(request,'accounts/login.html',{'form':form})

def profile(request): 
    if request.user != 'AnonymousUser':
        print(request.user,'hi')
        return render(request,'accounts/profile.html')
    return redirect('/login/')

def students(request):
    if request.user !=	'AnonymousUser':
        if request.user.user_type=='is_admin' or request.user.user_type=='is_staff':
            return render(request,'accounts/students.html')
        return render(request,'404.html')
    return redirect('/login/')

def staff(request):
    if request.user !=	'AnonymousUser':
        if request.user.user_type=='is_admin':
            return render(request,'accounts/staffs.html')
        return render(request,'404.html')
    return redirect('/login/')

def index(request):
    return render(request,'index.html')
    
def logoutview(request):
    logout(request)
    return render(request,'accounts/logout.html')