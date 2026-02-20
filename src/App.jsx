// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NavBar from './components/NavBar'
import MyPage from './pages/MyPage'
import storageService from './services/storage'
import './App.css'

function App() {

  const [isLogin, setIsLogin] = useState(storageService.getEmail() !== null); 

  return (
    <BrowserRouter>
      <NavBar isLogin={isLogin} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Login setIsLogin={setIsLogin} />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/MyPage' element={<MyPage setIsLogin={setIsLogin} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
