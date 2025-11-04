import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStudentStore from '../store/studentStore';
import { useNavigate } from 'react-router-dom';
import { filterProps, motion } from 'framer-motion';

const Modal = ({student, onClose}) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-xl font-bold mb-4 text-center'>Detalles del Estudiante</h2>
      <div className='flex flex-col items-center'>
        <img src={student.profile_photo ? student.profile_photo : "/default_photo.jpg"}
             alt={`Foto de ${student.name}`}
             className='w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4' />
        <p><strong>Nombre: </strong>{student.name}</p>
        <p><strong>Matricula: </strong>{student.matricula}</p>
        <p><strong>Carrera: </strong>{student.carrera}</p>
        <p><strong>Semestre: </strong>{student.semestre}</p>
      </div>
      <button onClick={onClose} className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full' >
        Cerrar
      </button>
    </motion.div>
  </motion.div>  
);

const StudentList = () => {
    const { students, setStudents, deleteStudent } = useStudentStore();
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedSemestre, setSelectedSemestre] = useState('');
    const [selectedCarrera, setSelectedCarrera] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/students').then(res => {
            setStudents(res.data);
            setFilteredStudents(res.data);
    })
            .catch(err => console.error('Error cargando alumnos:', err))        
    }, [setStudents]);

    const uniqueSemestres = [...new Set(students.map(s => s.semestre))].sort((a, b) => a - b);
    const uniqueCarreras = [...new Set(students.map(s => s.carrera))].sort();

    useEffect(() => {
      let filtered = students;
      if(searchTerm) {
        filtered = filtered.filter(student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if(selectedSemestre) {
        filtered = filtered.filter(student => student.semestre === parseInt(selectedSemestre));
      }

      if(selectedCarrera) {
        filtered = filtered.filter(student => student.carrera === selectedCarrera);
      }
      setFilteredStudents(filtered);
    }, [searchTerm, selectedSemestre, selectedCarrera, students]);

    const handleDelete = (id) => {
        if(window.confirm('Seguro que quieres eliminar este alumno?')) {
          axios.delete(`http://localhost:8000/api/students/${id}/`).then(() => deleteStudent(id))
            .then(() => deleteStudent(id))
            .catch(err => console.error('Error cargando alumnos:', err));
        }
    };

    const openModal = (student) => {
      setSelectedStudent(student);
    }

    const closeModal = () => {
      setSelectedStudent(null);
    }

    const handleSearch = () => {
      if(searchTerm.trim() === '') {
        setFilteredStudents(students);
      } else {
        axios.get(`http://localhost:8000/api/students/?search=${encodeURIComponent(searchTerm)}`)
          .then(res => {
            setFilteredStudents(res.data);
          })
          .catch(err => console.error('Error buscando alumnos:', err));
      }
    };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Lista de Alumnos</h1>

      <div className='mb-6 flex space-x-2'>
        <input type='text' placeholder='Buscar por nombre...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        className='flex-1 border border-gray-300 rounded px-3 py-2' />
        <button onClick={handleSearch} className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>
          Buscar
        </button>
      </div>

      <div className='mb-6 flex space-x-4'>
        <div className='flex-1'>
          <label className='block mb-1 font-medium'>Filtrar por semestre</label>
          <select value={selectedSemestre} onChange={(e) => setSelectedSemestre(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2'  >
              <option value="">Todos los semestres</option>
              {uniqueSemestres.map(semestre => (
                <option key={semestre} value={semestre}>{semestre}</option>
              ))}
            </select>
        </div>
        <div className='flex-1'>
          <label className='block mb-1 font-medium'>Filtrar por carrera</label>
          <select value={selectedCarrera} onChange={(e) => setSelectedCarrera(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2' >
              <option value="">Todas las carreras</option>
              {uniqueCarreras.map(carrera => (
                <option key={carrera} value={carrera}>{carrera}</option>
              ))}
            </select>
        </div>
      </div>

      <button onClick={() => navigate('/add')} className='mb-6 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700'>Crear Nuevo Alumno</button>
      {filteredStudents.length === 0 ? (
        <p>No hay alumnos registrados o que coincidan con la busqueda.</p>
      ) : (
        filteredStudents.map(student => (
          <div key={student.id} className='border p-4 mb-4 rounded shadow flex items-center space-x-4'>
            <img
              src={student.profile_photo ? student.profile_photo : "/default_photo.jpg"}
              alt={`Foto de ${student.name}`}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => (e.target.src = "/default_photo.jpg")}
            />

            <div className='flex-1'>
              <h2 className='text-xl font-semibold'>{student.name}</h2>
              <p>Matricula: {student.matricula}</p>
              <p>Carrera: {student.carrera}</p>
              <p>Semestre: {student.semestre}</p>
            </div>

            <div className='flex space-x-2'>
              <button onClick={() => openModal(student)}
                      className='px-4 py-2 bg-purple-600 text-white hover:bg-purple-700'>
                        Mostrar Detalles
              </button>
              <button onClick={() => navigate(`/boleta/${student.id}`)}
                      className='px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700'>
                Ver Boleta
              </button>
              <button onClick={() => navigate(`/edit/${student.id}`)}
                      className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                        Editar
              </button>
              <button onClick={() => handleDelete(student.id)}
                      className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      {selectedStudent && <Modal student={selectedStudent} onClose={closeModal} />}

    </div>
  )
}

export default StudentList
