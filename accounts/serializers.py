from email.headerregistry import Address
from email.policy import default
from typing_extensions import Required
from rest_framework import serializers
from django.shortcuts import get_list_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail

from academics.forms import question_form
from .models import Profile
from django.conf import settings
from django.core.mail import send_mail


User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name','last_name','full_name',"profile_picture","standard",
                    "address"]


# class SignupSerializer(serializers.ModelSerializer):
#     profile = ProfileSerializer()

#     class Meta:
#         model = User
#         fields = ['id','email','phone','register_number','date_of_birth','is_active',
#                     'user_type','is_data_entry','profile']

#     def create(self, validated_data):
#         profile_data = validated_data.pop('profile')
#         user = User.objects.create(**validated_data)
#         profile = Profile.objects.create(user=user, **profile_data)
#         subject = 'Welcome to our school'
#         message = f'Hi {profile.full_name}, thank you for joining in our school'
#         email_from = settings.EMAIL_HOST_USER
#         recipient_list = [user.email,]
#         send_mail(subject,message,email_from,recipient_list)
#         return user
usertype_choice=(
(None,'-------'),
('is_student','is_student'),
('is_staff','is_staff'),
('is_admin','is_admin'),

)




class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=10)
    register_number = serializers.CharField(max_length=15)
    date_of_birth = serializers.DateField()
    user_type = serializers.ChoiceField(
    choices = usertype_choice,
    allow_blank=True,
    default=None
    )

    first_name = serializers.CharField(max_length=15)
    last_name = serializers.CharField(max_length=15)
    full_name =serializers.CharField(max_length=30)
    address = serializers.CharField(max_length=45)
    profile_picture = serializers.ImageField(required=False, max_length=None, allow_empty_file=True, use_url=True,default='user_profile/profile.png')
    standard = serializers.ListField(child=serializers.CharField( default= None),default=None)
    # section = serializers.CharField(max_length=2,allow_blank=True, default=None)
    is_data_entry=serializers.BooleanField()

    # def validate_standard(self, value):
    #     if not value:
    #         return None
    #     try:
    #         return int(value)
    #     except ValueError:
    #         raise serializers.ValidationError('You must supply an integer')


    def create(self, validated_data):
        userdetails = validated_data
        email = validated_data.pop("email")
        phone = validated_data.pop("phone")
        register_number = validated_data.pop("register_number")
        date_of_birth = validated_data.pop("date_of_birth")
        user_type = validated_data.pop("user_type")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")        
        full_name = validated_data.pop("full_name")
        profile_picture = validated_data.pop("profile_picture")
        standard = validated_data.pop('standard')
        print(standard)
        address = validated_data.pop("address")
        is_data_entry = validated_data.pop("is_data_entry")
        user =   User.objects.create(email =email,phone=phone,date_of_birth=date_of_birth,
        register_number=register_number,user_type = user_type,is_data_entry=is_data_entry)
        user.save()
        Profile.objects.create(user=user,first_name=first_name,last_name=last_name,
        standard=standard,address=address, full_name=full_name,
        profile_picture=profile_picture)
        # user_details = (email,phone,register_number,date_of_birth,user_type,first_name,last_name,full_name,profile_picture,standard,section,address,is_data_entry)
        subject = 'Welcome to our school'
        message = f'Hi {full_name}, thank you for joining in our school'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email,]
        send_mail(subject,message,email_from,recipient_list)
        return userdetails
    def validate(self,data):
        queryset=User.objects.all()
        if self.instance:
            id=self.instance.id
            queryset=queryset.exclude(id=id)
        if queryset.filter(email=data['email']).exists() :
              raise serializers.ValidationError({'error':'email already exists'})
        elif queryset.filter(phone=data['phone']).exists() :
             raise serializers.ValidationError({'error':'phone already exists'})
        elif queryset.filter(register_number=data['register_number']).exists() :
            raise serializers.ValidationError({'error':'register number already exists'})
        return data

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
        read_only_fields = ['id','created_at','user_type','is_data_entry']
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone',instance.phone)
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
        # profile.section = profile_data.get(
        #     'section',
        #     profile.section
        # )
        profile.address = profile_data.get(
            'address',
            profile.address
        )        
        profile.save()
        return instance
        
class OtpVerificationserializer(serializers.Serializer):
    otp=serializers.CharField(max_length=6)
    
