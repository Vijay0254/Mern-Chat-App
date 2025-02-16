import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Error_500 from './Error_Pages/Error_500'
import Error_404 from './Error_Pages/Error_404'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import ProtectedRoute1 from './utils/ProtectedRoute1'
import ProtectedRoute2 from './utils/ProtectedRoute2'
import { useThemeStore } from './store/useThemeStore'

const App = () => {

  const { verifyToken, isCheckingAuth, authUser, onlineUser } = useAuthStore()
  const { theme, settheme } = useThemeStore()

  const navigate = useNavigate()

  useEffect(() =>{
    verifyToken(navigate)
  }, [])

  if(isCheckingAuth && !authUser){
    return(
      <div data-theme={theme} className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <main data-theme={theme}>
      {console.log(onlineUser)}
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute1 />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute2 />}>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Route>
        
        <Route path='/settings' element={<Settings />} />

        <Route path='/500' element={<Error_500 />} />
        <Route path='*' element={<Error_404 />} />
      </Routes>
    </main>
  )
}

export default App