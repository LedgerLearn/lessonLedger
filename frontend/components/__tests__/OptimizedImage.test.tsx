import { render, screen, waitFor } from '@testing-library/react'
import OptimizedImage from '../OptimizedImage'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

describe('OptimizedImage', () => {
  it('renders image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.webp')
  })

  it('shows loading indicator initially', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
      />
    )

    // Loading spinner should be present
    const loadingIndicator = document.querySelector('.animate-spin')
    expect(loadingIndicator).toBeInTheDocument()
  })

  it('applies blur effect during loading', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image.className).toContain('blur-sm')
  })

  it('handles error state gracefully', async () => {
    render(
      <OptimizedImage
        src="/non-existent.webp"
        alt="Test image"
        width={800}
        height={600}
      />
    )

    const image = screen.getByAltText('Test image')
    
    // Simulate error
    image.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(screen.getByText('Image not available')).toBeInTheDocument()
    })
  })

  it('uses priority loading when specified', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
        priority={true}
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image).not.toHaveAttribute('loading', 'lazy')
  })

  it('applies custom className', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
        className="custom-class"
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image.className).toContain('custom-class')
  })

  it('handles fill prop for background images', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        fill={true}
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
  })

  it('uses custom quality setting', () => {
    render(
      <OptimizedImage
        src="/test-image.webp"
        alt="Test image"
        width={800}
        height={600}
        quality={60}
      />
    )

    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
  })
})
