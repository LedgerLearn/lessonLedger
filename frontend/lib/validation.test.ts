import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  getPasswordStrength,
  validateLoginForm,
  validateSignupForm 
} from './validation'

describe('Email Validation', () => {
  test('validates correct email format', () => {
    expect(validateEmail('test@example.com')).toEqual({ isValid: true })
    expect(validateEmail('user.name+tag@example.co.uk')).toEqual({ isValid: true })
  })

  test('rejects invalid email formats', () => {
    expect(validateEmail('').isValid).toBe(false)
    expect(validateEmail('notanemail').isValid).toBe(false)
    expect(validateEmail('missing@domain').isValid).toBe(false)
    expect(validateEmail('@example.com').isValid).toBe(false)
  })
})

describe('Password Validation', () => {
  test('validates strong passwords', () => {
    expect(validatePassword('Strong@Pass123').isValid).toBe(true)
    expect(validatePassword('MyP@ssw0rd!').isValid).toBe(true)
  })

  test('rejects weak passwords', () => {
    const tooShort = validatePassword('Short1!')
    expect(tooShort.isValid).toBe(false)
    expect(tooShort.error).toContain('8 characters')

    const noUppercase = validatePassword('password123!')
    expect(noUppercase.isValid).toBe(false)
    expect(noUppercase.error).toContain('uppercase')

    const noLowercase = validatePassword('PASSWORD123!')
    expect(noLowercase.isValid).toBe(false)
    expect(noLowercase.error).toContain('lowercase')

    const noNumber = validatePassword('Password!')
    expect(noNumber.isValid).toBe(false)
    expect(noNumber.error).toContain('number')

    const noSpecial = validatePassword('Password123')
    expect(noSpecial.isValid).toBe(false)
    expect(noSpecial.error).toContain('special character')
  })
})

describe('Name Validation', () => {
  test('validates correct names', () => {
    expect(validateName('John Doe').isValid).toBe(true)
    expect(validateName("O'Brien").isValid).toBe(true)
    expect(validateName('Mary-Jane').isValid).toBe(true)
  })

  test('rejects invalid names', () => {
    expect(validateName('').isValid).toBe(false)
    expect(validateName('A').isValid).toBe(false)
    expect(validateName('John123').isValid).toBe(false)
    expect(validateName('A'.repeat(51)).isValid).toBe(false)
  })
})

describe('Password Strength', () => {
  test('calculates password strength correctly', () => {
    const weak = getPasswordStrength('pass')
    expect(weak.score).toBeLessThan(2)
    expect(weak.label).toContain('Weak')

    const strong = getPasswordStrength('Strong@Pass123')
    expect(strong.score).toBe(4)
    expect(strong.label).toBe('Strong')
  })

  test('provides helpful feedback', () => {
    const weak = getPasswordStrength('password')
    expect(weak.feedback.length).toBeGreaterThan(0)
    expect(weak.feedback.some(f => f.includes('8 characters'))).toBe(true)
  })
})

describe('Form Validation', () => {
  test('validates login form', () => {
    const valid = validateLoginForm('test@example.com', 'password123')
    expect(valid.isValid).toBe(true)

    const invalid = validateLoginForm('notanemail', '')
    expect(invalid.isValid).toBe(false)
    expect(invalid.errors.email).toBeDefined()
    expect(invalid.errors.password).toBeDefined()
  })

  test('validates signup form', () => {
    const valid = validateSignupForm('John Doe', 'test@example.com', 'Strong@Pass123')
    expect(valid.isValid).toBe(true)

    const invalid = validateSignupForm('A', 'notanemail', 'weak')
    expect(invalid.isValid).toBe(false)
    expect(invalid.errors.name).toBeDefined()
    expect(invalid.errors.email).toBeDefined()
    expect(invalid.errors.password).toBeDefined()
  })
})
