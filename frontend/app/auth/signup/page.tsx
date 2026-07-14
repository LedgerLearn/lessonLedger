'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { setStoredAuth } from '@/lib/auth'
import { validateName, validateEmail, validatePassword, getPasswordStrength } from '@/lib/validation'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({})

  const passwordStrength = getPasswordStrength(password)

  const validateField = (field: 'name' | 'email' | 'password', value: string) => {
    const errors: { name?: string; email?: string; password?: string } = {}

    if (field === 'name') {
      const nameValidation = validateName(value)
      if (!nameValidation.isValid) {
        errors.name = nameValidation.error
      }
    } else if (field === 'email') {
      const emailValidation = validateEmail(value)
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error
      }
    } else if (field === 'password') {
      const passwordValidation = validatePassword(value)
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error
      }
    }

    setFieldErrors(prev => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (touched.name) {
      validateField('name', value)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched.email) {
      validateField('email', value)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (touched.password) {
      validateField('password', value)
    }
  }

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, field === 'name' ? name : field === 'email' ? email : password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true })

    // Validate all fields
    const nameValid = validateField('name', name)
    const emailValid = validateField('email', email)
    const passwordValid = validateField('password', password)

    if (!nameValid || !emailValid || !passwordValid) {
      return
    }

    setLoading(true)

    const { data, error: apiError } = await api.signup(email, name, password)
    
    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      const { user, token } = data as any
      setStoredAuth(user, token)
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">Start your learning journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div 
                role="alert"
                aria-live="assertive"
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  className={`w-full px-4 pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors ${
                    fieldErrors.name 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                  }`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {fieldErrors.name && (
                <p id="name-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  className={`w-full px-4 pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors ${
                    fieldErrors.email 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error password-strength password-requirements' : 'password-strength password-requirements'}
                  className={`w-full px-4 pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base min-h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors ${
                    fieldErrors.password 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div id="password-strength" className="mt-2" aria-live="polite">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score >= 3 ? 'text-green-600 dark:text-green-400' : 
                      passwordStrength.score >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-full transition-colors ${
                          index < passwordStrength.score 
                            ? passwordStrength.color 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Password requirements */}
              <div id="password-requirements" className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password must contain:</p>
                <ul className="text-xs space-y-1" role="list">
                  <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {password.length >= 8 ? (
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" aria-hidden="true" />
                    )}
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {/[A-Z]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" aria-hidden="true" />
                    )}
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {/[a-z]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" aria-hidden="true" />
                    )}
                    <span>One lowercase letter</span>
                  </li>
                  <li className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {/[0-9]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" aria-hidden="true" />
                    )}
                    <span>One number</span>
                  </li>
                  <li className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-current" aria-hidden="true" />
                    )}
                    <span>One special character (!@#$%^&*)</span>
                  </li>
                </ul>
              </div>

              {fieldErrors.password && (
                <p id="password-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !!fieldErrors.name || !!fieldErrors.email || !!fieldErrors.password}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
