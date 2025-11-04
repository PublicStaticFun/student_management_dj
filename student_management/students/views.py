from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Student, Calificacion
from .serializers import StudentSerializer, CalificacionSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['carrera', 'semestre']
    search_fields = ['name']

class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['estudiante', 'materia']
    search_fields = ['materia']