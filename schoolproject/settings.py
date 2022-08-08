"""
Django settings for schoolproject project.

Generated by 'django-admin startproject' using Django 3.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os
from re import template
from dotenv import load_dotenv, find_dotenv
import dj_database_url
# import cloudinary
# import cloudinary_storage
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# updated settings
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-wv3=h63m#ic9sq_w*gq^q-zr8cy1v++4iux5z+!#rc2o!!xdtt'
load_dotenv(find_dotenv())

SECRET_KEY = os.environ['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = ['*','https://schooltestproject.herokuapp.com','http://schooltestproject.herokuapp.com','schooltestproject.herokuapp.com']


ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'cloudinary',
    # 'cloudinary_storage',
    'accounts',
    'academics',
    'corsheaders'
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True


ROOT_URLCONF = 'schoolproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            'templates'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'schoolproject.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'dfscanbrn4mhff',
        'USER': 'xyycorvkjwigci',
        'PASSWORD': '78e866985669c53760f79ed09e90aa5174c0969773265c8702c7170c5459467c',
        'HOST': 'ec2-34-203-182-65.compute-1.amazonaws.com',
        'PORT': '5432',
    }
}


db_from_env = dj_database_url.config(conn_max_age=600)
DATABASES['default'].update(db_from_env)


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated",
                                   'rest_framework.permissions.AllowAny'],

}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'accounts.User'
AUTHENTICATION_BACKENDS = (
    # ... your other backends
    'accounts.auth_backend.PasswordlessAuthBackend',
)

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Calcutta'

USE_I18N = True

USE_L10N = True

USE_TZ = True
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
#location where django collect all static files

STATIC_ROOT = 'staticfiles'

STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')

STATICFILES_DIR = {
    os.path.join(BASE_DIR , "public/static")
}

# CLOUDINARY_STORAGE = {
#     'CLOUD_NAME': 'your_cloud_name',
#     'API_KEY': 'your_api_key',
#     'API_SECRET': 'your_api_secret'
# }


MEDIA_ROOT = os.path.join(BASE_DIR,'media')
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'


EMAIL_BACKEND = os.environ['EMAIL_BACKEND']
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_USE_TLS = os.environ['EMAIL_USE_TLS']
EMAIL_PORT = os.environ['EMAIL_PORT']
EMAIL_HOST_USER = os.environ['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_HOST_PASSWORD']
