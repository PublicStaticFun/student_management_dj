# Sistema de Gestión de Estudiantes en una Universidad - Proyecto Django, PostgreSQL y React.
![Imagen del proyecto](https://github.com/PublicStaticFun/student_management_dj/blob/main/Portada_Student.png)
## Introducción
Una aplicación web Full Stack para gestionar una lista de alumnos universitarios, permitiendo operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con fotos de perfil.
## Descripción


Esta aplicación permite a usuarios gestionar registros de alumnos, incluyendo datos básicos como nombre, matrícula, carrera y semestre, además de subir fotos de perfil. El backend está construido con Django REST Framework y PostgreSQL, mientras que el frontend utiliza React con Zustand para el estado global.


## Características


- **Operaciones CRUD**: Crear, leer, actualizar y eliminar alumnos.

- **Subida de Fotos**: Soporte para fotos de perfil con validación.

- **Filtros y Búsqueda**: Filtrar por carrera, semestre y buscar por nombre.

- **Autenticación**: Soporte para JWT (JSON Web Tokens).

- **Interfaz Responsiva**: Diseño moderno con Tailwind CSS.

- **API RESTful**: Backend con endpoints bien definidos.


## Tecnologías Utilizadas


### Backend

- **Django REST Framework**: Para la API REST.

- **PostgreSQL**: Base de datos.

- **Celery + Redis**: Para tareas asíncronas (opcional, no incluido en la versión actual).

- **python-decouple**: Para variables de entorno.

- **Pillow**: Para manejo de imágenes.


### Frontend

- **React**: Librería para la interfaz de usuario.

- **Axios**: Para consumir la API.

- **React Router**: Para navegación.

- **Zustand**: Para gestión de estado global.

- **Tailwind CSS**: Para estilos.


## Instalación


### Prerrequisitos

- Python 3.8+

- Node.js 16+

- PostgreSQL instalado y configurado.


### Backend (Django)

1. Clona el repositorio:

   ```bash

   git clone https://github.com/tu-usuario/student-management-app.git

   cd student-management-app
