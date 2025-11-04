import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStudentStore from '../store/studentStore';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const Modal = ({ message, onClose }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
            onClose();
        }, 9000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <>
            {showConfetti && <Confetti />}
            <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white p-6 rounded shadow-lg text-center max-w-xs"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className='mb-4 text-lg'>{message}</p>
                    <button onClick={() => {
                        setShowConfetti(false);
                        onClose();
                    }} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                        Aceptar
                    </button>
                </motion.div>
            </motion.div>
        </>
    );
};

const StudentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addStudent, updateStudent } = useStudentStore();

    const defaultPhoto = '/default_photo.jpg';

    const [formData, setFormData] = useState({
        name: '',
        matricula: '',
        carrera: '',
        semestre: '',
        profile_photo: null,
    });
    const [previewImage, setPreviewImage] = useState(defaultPhoto);
    const [showAnimation, setShowAnimation] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(id) {
            axios.get(`http://localhost:8000/api/students/${id}/`)
                .then(res => {
                    setFormData({
                        name: res.data.name || '',
                        matricula: res.data.matricula || '',
                        carrera: res.data.carrera || '',
                        semestre: res.data.semestre || '',
                        profile_photo: null,
                    });
                    if(res.data.profile_photo) {
                        setPreviewImage(`http://localhost:8000${res.data.profile_photo}`);
                    } else {
                        setPreviewImage(defaultPhoto);
                    }
                })
                .catch(err => console.error('Error cargando alumno:', err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setFormData(prev => ({...prev, profile_photo: file}));

            setShowAnimation(true);

            const url = URL.createObjectURL(file);
            setPreviewImage(url);

            setTimeout(() => setShowAnimation(false), 1500);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('matricula', formData.matricula);
        data.append('carrera', formData.carrera);
        data.append('semestre', formData.semestre);
        if(formData.profile_photo) {
            data.append('profile_photo', formData.profile_photo);
        }

        if(id) {
            axios.put(`http://localhost:8000/api/students/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(res => {
                    updateStudent(res.data);
                    setModalMessage('Estudiante actualizado con exito');
                    setModalOpen(true);
                })
                .catch(err => console.error('Error actualizando:', err));
        } else {
            axios.post('http://localhost:8000/api/students/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res => {
                addStudent(res.data);
                setModalMessage('Estudiante creado con exito');
                setModalOpen(true);
            })
            .catch(err => console.error('Error creando:', err));
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        navigate('/');
    }

    const circleVariants = {
        initial: { scale: 1, rotate: 0, boxShadow: '0 0 0px rgba(255,255,255,0)' },
        animate: {
        scale: 1.2,
        rotate: 20,
        boxShadow: [
            '0 0 0px rgba(255,255,255,0)',
            '0 0 10px rgba(255,215,0,1)',
            '0 0 20px rgba(255,215,0,0.5)',
            '0 0 10px rgba(255,215,0,1)',
            '0 0 0px rgba(255,255,255,0)'
        ],
        transition: { duration: 1.3, repeat: 1, repeatType: 'reverse' }
        }
    };

  return (
    <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-6'>{id ? 'Editar Alumno' : 'Crear Alumno'}</h1>

        <div className='flex justify-center mb-6'>
            <AnimatePresence>
                <motion.img
                    key={previewImage} src={previewImage}
                    alt='Foto de perfil'
                    className='w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-md'
                    variants={circleVariants}
                    initial="initial"
                    animate={showAnimation ? "animate" : "initial"}
                    exit="initial"
                />
            </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-sm font-medium'>Nombre</label>
                <input type='text' name='name' value={formData.name} onChange={handleChange} required className='w-full border border-gray-300 rounded px-3 py-2'/>
            </div>
            <div>
                <label className='block text-sm font-medium'>Matricula</label>
                <input type='text' name='matricula' value={formData.matricula} onChange={handleChange} required className='w-full border border-gray-300 rounded px-3 py-2'/>
            </div>
            <div>
                <label className='block text-sm font-medium'>Carrera</label>
                <input type='text' name='carrera' value={formData.carrera} onChange={handleChange} required className='w-full border border-gray-300 rounded px-3 py-2'/>
            </div>
            <div>
                <label className='block text-sm font-medium'>Semestre</label>
                <input type='number' name='semestre' value={formData.semestre} onChange={handleChange} required className='w-full border border-gray-300 rounded px-3 py-2'/>
            </div>
            <div>
                <label className='block mb-1 font-medium'>Foto de perfil</label>
                <input type='file' accept='image/*' onChange={handleFileChange} className='block w-full'/>
            </div>
            <button type='submit' className='bg-yellow-400 text-black rounded px-4 py-2 hover:bg-yellow-500' >{id ? 'Actualizar' : 'Crear'}</button>
        </form>

        {modalOpen && <Modal message={modalMessage} onClose={closeModal} />}

    </div>
  );
};

export default StudentForm
