from django.urls import path
from .views import sign_in, register
from . import views
urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.sign_in, name='login'),  
    path('csrf/', views.csrf, name='csrf'),
]