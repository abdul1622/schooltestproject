
from django import forms
from django.forms import ModelForm
from.models import *
usertype_choice = {
    ('is_student', 'is_student'),
    ('is_staff', 'is_staff'),
    ('is_admin', 'is_admin'),
    ('-------', '--------')
}


class signup(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Email"}))
    register_number = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Register Number"}))
    date_of_birth = forms.DateField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Date of Birth"}))
    user_type = forms.ChoiceField(choices=usertype_choice)
    phone = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Phone"}))
    first_name = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "First Name"}))
    last_name = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Last Name"}))
    full_name = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Fullname"}))
    address = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Address"}))
    standard = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Standard"}))
    section = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Section"}))
    profilepic=forms.FileField(required=False)
    data_entry_user = forms.BooleanField(required=False)
  
class Loginform(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Email"}))
    phone = forms.CharField(widget=forms.TextInput(
        attrs={"class": "form-control", "placeholder": "Phone"}))
class ProfileEdit(ModelForm):
    class Meta:
        model=Profile
        fields=['first_name','last_name','full_name','standard','section','address','profile_picture']