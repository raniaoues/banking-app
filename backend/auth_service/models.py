from django.db import models
from django.contrib.auth.models import AbstractUser
import random

class User(AbstractUser):

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20, unique=True)
    rib = models.CharField(max_length=24, unique=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'telephone','username']

    def generate_rib(self):
        """Generate a unique RIB number"""
        while True:
            # Generate 22 random digits after "TN"
            rib_number = "TN" + "".join(str(random.randint(0, 9)) for _ in range(22))
            
            # Check if this RIB already exists
            if not User.objects.filter(rib=rib_number).exists():
                return rib_number

    def save(self, *args, **kwargs):
        if not self.rib:
            self.rib = self.generate_rib()
        
        # Generate username from email if not provided
        if not self.username and self.email:
            self.username = self.email.split('@')[0]
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.prenom} {self.nom})"