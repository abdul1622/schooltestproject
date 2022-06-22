from dataclasses import fields
from click import style
from rest_framework import serializers
from django.shortcuts import get_list_or_404, redirect
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from .models import OTP, Profile
User = get_user_model()
usertype_choice={
    ('is_student','is_student'),
    ('is_staff','is_staff'),
    ('is_admin','is_admin'),
}
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['email','phone','register_number','date_of_birth','user_type']
class SignupSerializer(serializers.ModelSerializer):
    Signup=UserSerializer()
    class Meta:
        model=Profile
        fields=['Signup','first_name','last_name','full_name',"standard","section","address"]
    def create(self,validated_data):
        user=validated_data.pop('Signup')
        user= User.objects.create(**user)
        Profile.objects.create(user=user,**validated_data)
        return user
class SigninSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','phone']
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name','last_name','full_name',"standard","section","address"]
class UserDetailsSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['id','email','phone','register_number','date_of_birth','is_active','user_type','created_at','profile']
        read_only_fields = ['id','created_at','user_type']
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile
        instance.email = validated_data.get('email', instance.email)
        instance.register_number = validated_data.get('register_number', instance.register_number)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()

        profile.first_name = profile_data.get(
            'first_name',
            profile.first_name
        )
        profile.last_name = profile_data.get(
            'last_name',
            profile.last_name
        )
        profile.full_name = profile_data.get(
            'full_name',
            profile.full_name
        )
        profile.standard = profile_data.get(
            'standard',
            profile.standard
        )
        profile.section = profile_data.get(
            'section',
            profile.section
        )
        profile.address = profile_data.get(
            'address',
            profile.address
        )        
        profile.save()

        return instance
class OtpVerificationserializer(serializers.ModelSerializer):
    class Meta:
        model=OTP
        fields=['otp']
