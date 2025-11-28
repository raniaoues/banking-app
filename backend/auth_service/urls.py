from django.urls import path
from .views import sign_in, register

urlpatterns = [
    path("register/", register),
    path("login/", sign_in),
]
