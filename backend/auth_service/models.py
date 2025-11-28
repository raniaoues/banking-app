from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # nom de compte

    def __str__(self):
        return self.email
