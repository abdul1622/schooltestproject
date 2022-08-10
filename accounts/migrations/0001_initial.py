# Generated by Django 3.2 on 2022-08-09 05:12

import accounts.models
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('register_number', models.CharField(max_length=15, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.CharField(default=1234567890, max_length=10, unique=True, validators=[django.core.validators.MinLengthValidator(10)])),
                ('date_of_birth', models.DateField(blank=True, default=django.utils.timezone.now, null=True)),
                ('user_type', models.CharField(blank=True, choices=[('is_student', 'is_student'), ('is_staff', 'is_staff'), ('is_admin', 'is_admin')], default=None, max_length=20, null=True)),
                ('is_data_entry', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OTP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(default=1234567890, max_length=10, validators=[django.core.validators.MinLengthValidator(10)])),
                ('otp', models.CharField(max_length=6)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=15)),
                ('last_name', models.CharField(max_length=15)),
                ('full_name', models.CharField(blank=True, max_length=30, null=True)),
                ('profile_picture', models.ImageField(blank=True, default='user_profile/profile.png', null=True, upload_to=accounts.models.Profile.upload_design_to)),
                ('standard', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MaxValueValidator(12)])),
                ('section', models.CharField(blank=True, max_length=2, null=True)),
                ('address', models.CharField(blank=True, max_length=45, null=True)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
