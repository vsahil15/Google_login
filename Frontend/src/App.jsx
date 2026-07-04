import './App.css';
import Register from './pages/register';
import Login from './pages/login';
import Welcome from './pages/welcome';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Navigate replace to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/welcome' element={<Welcome />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
