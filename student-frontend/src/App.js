import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import BoletaCalificacion from './components/BoletaCalificacion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path='/add' element={<StudentForm />} />
        <Route path='/edit/:id' element={<StudentForm />}/>
        <Route path='/boleta/:id' element={<BoletaCalificacion />} />
      </Routes>
    </Router>
  );
}

export default App;
