from urllib import response
from.frontendurls import *
from.forms import*
from django.shortcuts import redirect, render
import random
import http.client
from django.http import HttpResponse
from requests import request
from rest_framework.response import Response
from django.contrib.auth import login,logout
from rest_framework.status import HTTP_200_OK,HTTP_404_NOT_FOUND,HTTP_400_BAD_REQUEST,HTTP_201_CREATED
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from.models import User,Profile,OTP
from django.contrib.auth.decorators import login_required
from .auth_backend import PasswordlessAuthBackend
import requests
def signupview(request):
    form=signup(data=request.POST)
    if request.method=='POST':
        if form.is_valid():
            form.save()
    return render(request,'accounts/signup.html')
def signin(request):
    form=Loginform()
    if request.method=='POST':
        if form.is_valid():
            email=form.cleaned_data['email']
            phone=form.cleaned_data['phone']
            if email and phone:
                user=User.objects.filter(email=email,phone=phone).exists()
                # user=PasswordlessAuthBackend.authenticate(self,email=email,phone=phone)
            if user:
                otp=random.randint(1111,9999)
                OTP.objects.create(email=email,phone=phone,otp=otp)
                conn = http.client.HTTPConnection("2factor.in")
                conn.request("GET", "https://2factor.in/API/R1/?module=SMS_OTP&apikey=77d6322c-e7b5-11ec-9c12-0200cd936042/&to="+phone+"&otpvalue="+str(otp)+"&templatename=Login")
                res = conn.getresponse()
                data = res.read()
                print(data.decode("utf-8"))
                return redirect('/otp')
            return HttpResponse(request,'no user')
    context={'form':form}
    return render(request,'accounts/login.html',context)
def otpverify(request):
    email=request.query_params.get('email',None)
    phone=request.query_params.get('phone',None)
    print(email)
    print(phone)
    cc = request.data.get('otp',None)
    print(cc)
    if email and phone:
        user=PasswordlessAuthBackend.authenticate(phone=phone,email=email)
        v=OTP.objects.filter(phone=phone)
        otp=v.last()
        if user and str(otp.otp)==cc:
            login(request,user)
            return Response({"status":'loggedin','data':user.email})
    return Response({"status":'recheck'})

def simple(request):
    return render(request,'accounts/login2.html')
def home(request):
    return render(request,'base.html')
def websignout(request):
    url='http://127.0.0.1:8000/logout/'
    response=requests.get(url,params=request.user)
    print(response)
    return redirect('/websimplelogin')
@login_required(login_url='/websimplelogin')
def profile(request):
    return render(request,'accounts/profile.html')

def editprofile(request):
    user = Profile.objects.get(user_id=request.user.id)
    form=ProfileEdit(instance=user)
    if request.method== 'POST':
        form=ProfileEdit(request.POST,instance=user,files=request.FILES)
        if form.is_valid():
            form.save()
            return redirect('profile')
    context={'form':form}
    return render(request,'accounts/editprofile.html',context)
        
