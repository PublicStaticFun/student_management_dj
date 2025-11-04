from rest_framework import serializers
from .models import Student, Calificacion

class StudentSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(use_url=True)
    class Meta:
        model = Student
        fields = '__all__'

class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_name = serializers.CharField(source='estudiante.name', read_only=True)
    class Meta:
        model = Calificacion
        fields = ['id', 'estudiante', 'estudiante_name', 'materia', 'calificacion', 'promedio']