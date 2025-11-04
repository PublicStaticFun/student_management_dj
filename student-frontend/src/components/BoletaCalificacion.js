import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BoletaCalificacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [calificaciones, setCalificaciones] = useState([]);
    const [promedio, setPromedio] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [estudiante, setEstudiante] = useState(null);

    useEffect(() => {
        if(id) {
            axios.get(`http://localhost:8000/api/students/${id}/`)
                .then(res => {
                    setEstudiante(res.data);
                })
                .catch(err => {
                    console.error('Error cargando estudiante:', err);
                    setError('Error al cargar los datos del estudiante.');
                })

            axios.get(`http://localhost:8000/api/calificaciones/?estudiante=${id}`)
                .then(res => {
                    setCalificaciones(res.data);
                    if(res.data.length > 0) {
                        const avg = res.data.reduce((sum, c) => sum + parseFloat(c.calificacion) / 10, 0) / res.data.length;
                        setPromedio(avg.toFixed(2));
                    }
                    setLoading(false);
                })
                .catch(err => { console.error('Error cargando calificaciones:', err)
                       setError('No se pudieron cargar las calificaciones. Verifica que el backend esta corriendo.');
                       setLoading(false)  
        });
        } else {
            setError('ID del estudiante no válido');
            setLoading(false);
        }
    }, [id]);

    const getResultado = (promedio) => {
        const prom = parseFloat(promedio);
        if(prom >= 70){
            return 'Todo bien';
        } else {
            return 'Examen Extraordinario';
        }
    }

    if(loading) {
        return (
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-6'>Boleta de Calificaciones</h1>
                <p>Cargando...</p>
            </div>
        );
    }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Boleta de Calificaciones</h1>
      <button onClick={() => navigate('/')} className='mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'>
        Volver a Lista.
      </button>
      {error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <>
        {estudiante && (
            <div className='mb-6 p-4 border border-gray-300 rounded bg-gray-50'>
                <h2 className='text-2xl font-semibold mb-4'>Datos del estudiante</h2>
                <div className='flex items-center space-x-4'>
                    <img src={estudiante.profile_photo ? estudiante.profile_photo : "/default_photo.jpg"}
                        alt={`Foto de ${estudiante.name}`}
                        className='w-20 h-20 rounded-full object-cover border' />
                    <div>
                        <p><strong>Nombre:</strong> {estudiante.name}</p>
                        <p><strong>Matricula:</strong> {estudiante.matricula}</p>
                        <p><strong>Carrera:</strong> {estudiante.carrera}</p>
                        <p><strong>Semestre:</strong> {estudiante.semestre}</p>
                    </div>
                </div>
            </div>
        )}
        {calificaciones.length === 0 ? (
        <p>No hay calificaciones registradas para este estudiante</p>
      ) : (
        <>
            <table className='w-full border-collapse border border-gray-300 mb-4'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='border border-gray-300 px-4 py-2'>Materia</th>
                        <th className='border border-gray-300 px-4 py-2'>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map(cal => (
                        <tr key={cal.id}>
                            <td className='border border-gray-300 px-4 py-2'>{cal.materia}</td>
                            <td className='border border-gray-300 px-4 py-2'>{cal.calificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='text-xl font-semibold'>Promedio: {promedio}</p>
            <p className='text-lg font-medium'>Resultado: {getResultado(promedio)}</p>
        </>
      )}
      </>
      )}
    </div>
  );
};

export default BoletaCalificacion
