from rest_framework import serializers
from django.shortcuts import get_list_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from .models import Profile
from django.conf import settings
from django.core.mail import send_mail


User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name','last_name','full_name',"profile_picture","standard",
                    "section","address"]


class SignupSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id','email','phone','register_number','date_of_birth','is_active',
                    'user_type','is_data_entry','profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        profile = Profile.objects.create(user=user, **profile_data)
        subject = 'Welcome to our school'
        message = f'Hi {profile.full_name}, thank you for joining in our school'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email,]
        send_mail(subject,message,email_from,recipient_list)
        return user


class SigninSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','phone']

class UserDetailsSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['id','email','phone','register_number','date_of_birth','is_active',
                    'user_type','created_at','profile']
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

class OtpVerificationserializer(serializers.Serializer):
    otp=serializers.CharField(max_length=6)
    