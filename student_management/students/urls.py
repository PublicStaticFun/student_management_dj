from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, CalificacionViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'calificaciones', CalificacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
