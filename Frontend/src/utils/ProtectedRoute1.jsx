import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute1 = () => {

    const { authUser } = useAuthStore()
    
  return authUser ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute1