// Form validation utilities with comprehensive error messages

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  feedback: string[]
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Validates password with strength requirements
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpperCase) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!hasLowerCase) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!hasNumber) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }

  if (!hasSpecialChar) {
    return { isValid: false, error: 'Password must contain at least one special character' }
  }

  return { isValid: true }
}

/**
 * Validates name field
 */
export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' }
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must not exceed 50 characters' }
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  }

  return { isValid: true }
}

/**
 * Calculates password strength with detailed feedback
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'No password',
      color: 'bg-gray-300',
      feedback: ['Enter a password to see strength']
    }
  }

  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) {
    score++
  } else {
    feedback.push('Use at least 8 characters')
  }

  // Complexity checks
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (hasUpperCase && hasLowerCase) {
    score++
  } else {
    feedback.push('Mix uppercase and lowercase letters')
  }

  if (hasNumber) {
    score++
  } else {
    feedback.push('Include at least one number')
  }

  if (hasSpecialChar) {
    score++
  } else {
    feedback.push('Add a special character (!@#$%^&*)')
  }

  // Determine label and color based on score
  let label: string
  let color: string

  if (score === 0) {
    label = 'Very Weak'
    color = 'bg-red-500'
  } else if (score === 1) {
    label = 'Weak'
    color = 'bg-orange-500'
  } else if (score === 2) {
    label = 'Fair'
    color = 'bg-yellow-500'
  } else if (score === 3) {
    label = 'Good'
    color = 'bg-blue-500'
  } else {
    label = 'Strong'
    color = 'bg-green-500'
  }

  return { score, label, color, feedback }
}

/**
 * Validates login form
 */
export function validateLoginForm(email: string, password: string): { isValid: boolean; errors: { email?: string; password?: string } } {
  const errors: { email?: string; password?: string } = {}

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates signup form
 */
export function validateSignupForm(name: string, email: string, password: string): { 
  isValid: boolean
  errors: { name?: string; email?: string; password?: string }
} {
  const errors: { name?: string; email?: string; password?: string } = {}

  const nameValidation = validateName(name)
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error
  }

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
