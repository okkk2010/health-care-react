// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import MyPage from './pages/MyPage';
import storageService from './services/storage';
import MedicalAppointment from './pages/patient/MedicalAppointment';
import MyAppointment from './pages/patient/MyAppointment';
import Appointment from './pages/Appointment';
import CurrentAppointment from './pages/doctor/CurrentAppointment';
import CheckAppointment from './pages/doctor/CheckAppointment';
import VideoAdminPage from './pages/doctor/VideoAdminPage';
import VideoVisitorPage from './pages/patient/VideoVisitorPage';
import './App.css';

function App() {
    const [isLogin, setIsLogin] = useState(storageService.getEmail() !== null);

    return (
        <BrowserRouter>
            <NavBar isLogin={isLogin} />
            <Routes>
                <Route path='/' element={<Home />} />

                {/* 공통 라우터 */}
                <Route path='/Login' element={<Login setIsLogin={setIsLogin} />} />
                <Route path='/Register' element={<Register />} />
                <Route path='/MyPage' element={<MyPage setIsLogin={setIsLogin} />} />

                {/* 환자 라우터 */}
                <Route path='/MedicalAppointment' element={<MedicalAppointment />} />
                <Route path='/MyAppointment' element={<MyAppointment />} />
                <Route path='/MedicalAppointment/Appointment' element={<Appointment />} />
                <Route path='/video/visitor/:appointmentCode' element={<VideoVisitorPage />} />

                {/* 의사 라우터 */}
                <Route path='/CheckAppointments' element={<CheckAppointment />} />
                <Route path='/CurrentAppointments' element={<CurrentAppointment />} />
                <Route path='/video/admin/:appointmentCode' element={<VideoAdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
