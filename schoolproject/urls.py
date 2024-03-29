"""schoolproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
import debug_toolbar
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from utils.pagination import response_for_404
# from jet.dashboard.dashboard_modules import google_analytics_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # path('jet/', include('jet.urls', 'jet')),
    # path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
    # path('',include('accounts.urls')),
    path('api/', include('academics.urls')),
    path('api/', include('accounts.urls')),
    path('', include('accounts.frontendUrls')),
    path('', include('academics.FrontendUrl')),
    path('__debug__/', include('debug_toolbar.urls')),

]
# handler404 = response_for_404


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


urlpatterns += staticfiles_urlpatterns()
