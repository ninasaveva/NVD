from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter(); router.register("listings", views.ListingViewSet, basename="listing")
urlpatterns = [path("", include(router.urls)), path("categories/", views.categories), path("auth/register/", views.register), path("auth/login/", views.login), path("auth/me/", views.me)]

