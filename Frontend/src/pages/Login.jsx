import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Mail, MessageSquare, User, Lock, EyeOff, Eye, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern'

const Login = () => {

    const { login, isLoggingIn } = useAuthStore()
    
    const navigate = useNavigate()

    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState({
        email: "",
        password: ""
    })

  return (
    <section className='min-h-screen grid lg:grid-cols-2'>

        <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
            <div className='w-full max-w-md space-y-8'>

                <div className='text-center mb-8'>
                    <div className='flex flex-col items-center gap-2 group'>
                        <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                            <MessageSquare className='size-6 text-primary' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
                        <p className='text-base-content/60'>Sign in to your account</p>
                    </div>
                </div>

                <form className='space-y-6'>

                    <div className='form-control'>
                        <label htmlFor="email" className='label-text'>
                            <span className='label-text font-medium'>Email</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto'>
                                <Mail className='size-5 text-base-content/40' />
                            </div>
                            <input type="email" name='email' id='email' value={formData.email} onChange={(event) =>setformData({...formData, email: event.target.value})} placeholder='Enter email' className='input input-bordered pl-10 w-full' />
                        </div>
                    </div>

                    <div className='form-control'>
                        <label htmlFor="password" className='label-text'>
                            <span className='label-text font-medium'>Password</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto'>
                                <Lock className='size-5 text-base-content/40' />
                            </div>
                            <input type={showPassword ? "text" : "password"} name='password' id='password' value={formData.password} onChange={(event) =>setformData({...formData, password: event.target.value})} placeholder='Enter password' className='input input-bordered pl-10 w-full' />
                            <button type='button' onClick={() =>setshowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                {showPassword ? 
                                    <EyeOff className='size-5 text-base-content/40' /> :
                                    <Eye className='size-5 text-base-content/40' />
                                }
                            </button>
                        </div>
                    </div>

                    <button onClick={(event) =>login(event, navigate, formData, setformData)} disabled={isLoggingIn} className='btn btn-primary w-full'>{isLoggingIn ? <><Loader2 className='size-5 animate-spin' />Loading...</> : "Login"}</button>
                </form>
                
                <div className='text-center'>
                    <p className='text-base-content/60'>Doesn't have an account?{" "}<Link to="/signup" className='link link-primary'>Create Account</Link></p>
                </div>
            </div>
        </div>

        <AuthImagePattern title="Welcome back!" subtitle="Sign in to continue your conversions and catch up with your messages." />
    </section>
  )
}

export default Login