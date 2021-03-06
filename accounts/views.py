from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import login,logout,authenticate
from rest_framework.views import APIView
from rest_framework.generics import (
        CreateAPIView,
        RetrieveUpdateDestroyAPIView,
        RetrieveUpdateAPIView,
        ListAPIView
)
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,HTTP_201_CREATED
)
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from yaml import serialize
from.models import User,Profile,OTP
from.serializers import (
        SigninSerializer, 
        SignupSerializer,
        ProfileSerializer,
        UserDetailsSerializer,
        OtpVerificationserializer
)
from django.db.models import Q
from .permission import IsAdminUser,IsStaffUser
from .auth_backend import PasswordlessAuthBackend
from random import randint
from http import client
from django.contrib.auth import get_user_model
# Create your views here.

User = get_user_model()

class SignupView(CreateAPIView):
    serializer_class=SignupSerializer

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "Registered succesfull",'data':serializer.data},status=HTTP_201_CREATED)
        return Response({"status": "failure", "data": serializer.errors})


class LogoutView(APIView):
    premission_classes = [IsAuthenticated]
    def get(self, request):
        if self.request.user:
            logout(request)
            return Response(status=HTTP_200_OK)
        return Response({'status':'your are not logged in'})


class SimpleLoginView(APIView):
    serializer_class=SigninSerializer
    def post(self,request):
        email=request.data.get('email')
        phone=request.data.get('phone')
        if email and phone:
            try:
                user=PasswordlessAuthBackend.authenticate(request,email=email,phone=phone)
            except:
                return Response({"status": "User doesn't exits"}, status=HTTP_400_BAD_REQUEST)
            if user:
                token, created = Token.objects.get_or_create(user=user)
                login(request,user)
                serializer = UserDetailsSerializer(user)
                return Response({"status": "success",'data':serializer.data}, status=HTTP_200_OK)
        return Response({"status": "failed"}, status=HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    serializer_class=SigninSerializer
    def post(self,request):
        email=request.data.get('email')
        phone=request.data.get('phone')
        if email and phone:
            try:
                user=PasswordlessAuthBackend.authenticate(request,email=email,phone=phone)
            except:
                return Response({"status": "User doesn't exits"}, status=HTTP_400_BAD_REQUEST)
            if user:
                otp= randint(1111,9999)
                OTP.objects.create(email=email,phone=phone,otp=otp)
                conn = client.HTTPConnection("2factor.in")
                conn.request("GET", "https://2factor.in/API/R1/?module=SMS_OTP&apikey=77d6322c-e7b5-11ec-9c12-0200cd936042/&to="+
                phone+"&otpvalue="+str(otp)+"&templatename=Login")
                return Response({"status":"otp generated successfully"})
        return Response({"status": "failed"}, status=HTTP_400_BAD_REQUEST)


class LoginVerifyView(APIView):

    serializer_class= OtpVerificationserializer
    def post(self,request):
        phone = self.request.query_params.get('phone',None)
        email = self.request.query_params.get('email',None)
        otp = request.data.get('otp',None)
        otp2=OTP.objects.filter(phone=phone)
        cc=(otp2.last()).otp
        if otp == str(cc):
            user = User.objects.get(phone=phone,email=email)
            login(request,user)
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserDetailsSerializer(user)
            return Response({"status":'success','data':serializer.data})
        return Response({"status":'failed'})


class StudentProfileView(RetrieveUpdateAPIView):
    serializer_class=ProfileSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self,request,pk):
        if self.request.user.user_type == 'is_student' and self.request.user.id == pk:
            queryset=get_object_or_404(Profile,pk=pk)
        else:
            return Response({"status": "you don't have a permissions"}, status=HTTP_400_BAD_REQUEST)
        serializer = ProfileSerializer(queryset)
        return Response(serializer.data)

    def update(self, request,pk):
        profile = Profile.objects.get(pk=pk)
        serializer = ProfileSerializer(profile,data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class UserDetailsView(ListAPIView):

    serializer_class=UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'is_student':
            queryset = User.objects.get(id = user.id)
        elif user.user_type == 'is_staff':
            queryset = User.objects.filter(user_type = 'is_student')
        elif user.user_type == 'is_admin':
            queryset = User.objects.all()
        return queryset

    def list(self, request):
        user = self.request.user
        queryset = self.get_queryset()
        if user.user_type == 'is_student':
            serializer = UserDetailsSerializer(queryset)
        else:
            serializer = UserDetailsSerializer(queryset,many=True)
        return Response(serializer.data)


class UserDetailsEditView(RetrieveUpdateDestroyAPIView):

    serializer_class=UserDetailsSerializer
    permission_classes = [IsAuthenticated]
    queryset=User.objects.all()

    def retrieve(self,request,pk):
        try:
            requestuser = self.request.user
            if requestuser.id == pk:
                user = User.objects.get(pk=pk)
            else:
                if requestuser.user_type == 'is_admin':
                    user = User.objects.get(Q(user_type='is_staff,pk=pk') | Q(user_type = 'is_student',pk=pk)|Q(is_data_entry=True,pk=pk))
                elif requestuser.user_type == 'is_staff':
                    user = User.objects.get(user_type = 'is_student',pk=pk)
            serializer = UserDetailsSerializer(user)
            return Response(serializer.data)
        except:
            return Response({"status": "User doesn't exits or you don't have a permissions"}, status=HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    serializer_class=UserDetailsSerializer
    permission_classes = [IsAuthenticated]
    queryset=User.objects.all()

    def get(self,request):
        user = self.request.user 
        serializer = UserDetailsSerializer(user)
        return Response({"status" : "success","data" :serializer.data})

