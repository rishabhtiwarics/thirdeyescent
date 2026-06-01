import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice'

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function RegisterForm() {
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
    dispatch(registerStart())
    
    // Simulate API call for registration
    setTimeout(() => {
      dispatch(registerSuccess({ email: data.email, name: data.name }))
      navigate('/')
    }, 1500)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-cormorant text-[28px] font-light tracking-[.06em] text-[#d4af37]">
          Register
        </h2>
        <p className="font-montserrat text-[10px] tracking-[.15em] text-[#a39282] uppercase mt-1">
          Begin your olfactory journey
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#e35f5f]/10 border border-[#e35f5f]/30 text-[#e35f5f] text-[11px] tracking-[.05em] text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] mb-1 font-medium">
            Full Name
          </label>
          <input
            type="text"
            {...register('name')}
            className={`w-full bg-[#140e0b] border ${errors.name ? 'border-[#e35f5f]' : 'border-[#b39874]/30'} focus:border-[#d4af37] text-white px-4 py-2.5 text-xs tracking-wider outline-none transition-all duration-300`}
            placeholder="Alexandra Vance"
          />
          {errors.name && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] mb-1 font-medium">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full bg-[#140e0b] border ${errors.email ? 'border-[#e35f5f]' : 'border-[#b39874]/30'} focus:border-[#d4af37] text-white px-4 py-2.5 text-xs tracking-wider outline-none transition-all duration-300`}
            placeholder="alexandra@luxury.com"
          />
          {errors.email && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            className={`w-full bg-[#140e0b] border ${errors.password ? 'border-[#e35f5f]' : 'border-[#b39874]/30'} focus:border-[#d4af37] text-white px-4 py-2.5 text-xs tracking-wider outline-none transition-all duration-300`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[9px] tracking-[.2em] uppercase text-[#a39282] mb-1 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`w-full bg-[#140e0b] border ${errors.confirmPassword ? 'border-[#e35f5f]' : 'border-[#b39874]/30'} focus:border-[#d4af37] text-white px-4 py-2.5 text-xs tracking-wider outline-none transition-all duration-300`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-[#e35f5f] text-[10px] mt-1 tracking-wide">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 inline-flex items-center justify-center gap-2 font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-black bg-[#d4af37] hover:bg-[#c29e2d] py-3.5 px-4 cursor-pointer transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin mr-1" />
              Creating...
            </>
          ) : (
            'Initiate Patronage'
          )}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-[#b39874]/10 pt-5">
        <p className="text-[10px] tracking-[.15em] text-[#a39282]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#d4af37] hover:underline font-medium transition-all"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
