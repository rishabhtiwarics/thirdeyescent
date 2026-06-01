import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
})

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    
    // Simulate API call for forgot password
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <h2 className="font-cormorant text-[28px] font-light tracking-[.06em] text-[#d4af37]">
          Recover Password
        </h2>
        <p className="font-montserrat text-[10px] tracking-[.15em] text-[#a39282] uppercase mt-1">
          Restore Access to Sanctuary
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs tracking-wider leading-relaxed">
            An email with recovery instructions has been dispatched to your address. Please verify your inbox.
          </div>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-black bg-[#d4af37] hover:bg-[#c29e2d] py-2.5 px-4 cursor-pointer transition-all duration-300 active:scale-[0.98]"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-[11px] tracking-wide text-[#a39282] leading-relaxed text-center font-light">
            Provide your registered email address, and we will send you instructions to reset your password.
          </p>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 inline-flex items-center justify-center gap-2 font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-black bg-[#d4af37] hover:bg-[#c29e2d] py-2.5 px-4 cursor-pointer transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin mr-1" />
                Dispatching...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-[#d4af37]/80 hover:text-[#d4af37] text-[10px] tracking-[.15em] uppercase transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
