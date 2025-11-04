from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Student(models.Model):
    name = models.CharField(max_length=100)
    matricula = models.CharField(max_length=20, unique=True)
    carrera = models.CharField(max_length=100)
    semestre = models.IntegerField()
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return self.name

class Calificacion(models.Model):
    estudiante = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='calificaciones')
    materia = models.CharField(max_length=100)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(10)])
    promedio = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        calificaciones = Calificacion.objects.filter(estudiante = self.estudiante)
        if calificaciones.exists():
            self.promedio = calificaciones.aggregate(models.Avg('calificacion'))['calificacion__avg']
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.estudiante.name} - {self.materia}: {self.calificacion}"