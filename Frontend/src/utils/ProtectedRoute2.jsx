import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute2 = () => {

    const { authUser } = useAuthStore()
    
  return !authUser ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute2