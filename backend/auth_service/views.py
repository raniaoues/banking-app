from django.shortcuts import render
import json
import re
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User


# ✅ INSCRIPTION (création du compte)
@require_POST
@ensure_csrf_cookie
def register(request):
    data = json.loads(request.body)

    nom = data.get("nom", "").strip()
    prenom = data.get("prenom", "").strip()
    email = data.get("email", "").strip()
    telephone = data.get("telephone", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    # ✅ VALIDATION STRICTE
    if not all([nom, prenom, email, telephone, username, password]):
        return JsonResponse({"error": "Champs manquants"}, status=400)

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return JsonResponse({"error": "Email invalide"}, status=400)

    if len(password) < 8:
        return JsonResponse({"error": "Mot de passe trop court"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email déjà utilisé"}, status=400)

    # ✅ CRÉATION UTILISATEUR (mot de passe haché automatiquement)
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        nom=nom,
        prenom=prenom,
        telephone=telephone
    )

    return JsonResponse({"success": True})


# ✅ CONNEXION (SIGN IN)
@require_POST
@ensure_csrf_cookie
def sign_in(request):
    data = json.loads(request.body)

    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return JsonResponse({"error": "Identifiants invalides"}, status=400)

    user = authenticate(request, email=email, password=password)

    if user is None:
        return JsonResponse({"error": "Identifiants invalides"}, status=401)

    # ✅ CRÉATION SESSION SÉCURISÉE
    login(request, user)

    return JsonResponse({
        "success": True,
        "user": {
            "nom": user.nom,
            "prenom": user.prenom,
            "email": user.email
        }
    })
