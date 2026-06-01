import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice'

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    dispatch(loginStart())
    
    // Simulate API call for luxury feel
    setTimeout(() => {
      dispatch(loginSuccess({ email: data.email, name: 'Exclusive Patron' }))
      navigate('/')
    }, 1500)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <h2 className="font-cormorant text-[28px] font-light tracking-[.06em] text-[#d4af37]">
          Sign In
        </h2>
        <p className="font-montserrat text-[10px] tracking-[.15em] text-[#a39282] uppercase mt-1">
          Welcome to your Scent Sanctuary
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#e35f5f]/10 border border-[#e35f5f]/30 text-[#e35f5f] text-[11px] tracking-[.05em] text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] mb-1.5 font-medium">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full bg-[#f9f8f6] border ${errors.email ? 'border-[#e35f5f]' : 'border-[#e0ddd8]'} focus:border-[#b39874] text-[#1a1410] px-3 py-2 text-xs tracking-wider outline-none transition-all duration-300 placeholder:text-[#c5bfb8]`}
            placeholder="patron@luxury.com"
          />
          {errors.email && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] font-medium">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[#d4af37]/80 hover:text-[#d4af37] text-[9px] tracking-[.15em] uppercase transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            {...register('password')}
            className={`w-full bg-[#f9f8f6] border ${errors.password ? 'border-[#e35f5f]' : 'border-[#e0ddd8]'} focus:border-[#b39874] text-[#1a1410] px-3 py-2 text-xs tracking-wider outline-none transition-all duration-300 placeholder:text-[#c5bfb8]`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-1 inline-flex items-center justify-center gap-2 font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-black bg-[#d4af37] hover:bg-[#c29e2d] py-2.5 px-4 cursor-pointer transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin mr-1" />
              Verifying...
            </>
          ) : (
            'Access Sanctuary'
          )}
        </button>
      </form>

      <div className="mt-5 text-center border-t border-[#b39874]/10 pt-4">
        <p className="text-[10px] tracking-[.15em] text-[#a39282]">
          New to Third Eye Scent?{' '}
          <Link
            to="/register"
            className="text-[#d4af37] hover:underline font-medium transition-all"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}
