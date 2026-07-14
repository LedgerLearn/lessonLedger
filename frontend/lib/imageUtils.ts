/**
 * Image Utility Functions
 * Helpers for generating optimized image URLs and placeholders
 */

/**
 * Generate a blur data URL for image placeholders
 * @param width - Width of the blur placeholder
 * @param height - Height of the blur placeholder
 * @returns Base64 encoded blur data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  
  if (!canvas) {
    // Fallback for SSR
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  }

  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/png')
}

/**
 * Get optimized image sizes string for responsive images
 * @param breakpoints - Custom breakpoints or use defaults
 * @returns Sizes string for Next.js Image component
 */
export function getResponsiveSizes(breakpoints?: {
  mobile?: string
  tablet?: string
  desktop?: string
}): string {
  const defaults = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
  }
  
  const sizes = { ...defaults, ...breakpoints }
  
  return `(max-width: 640px) ${sizes.mobile}, (max-width: 1024px) ${sizes.tablet}, ${sizes.desktop}`
}

/**
 * Check if image should be loaded with priority
 * @param index - Image index in list
 * @param isAboveFold - Whether image is above the fold
 * @returns Boolean indicating if priority loading should be used
 */
export function shouldUsePriority(index: number = 0, isAboveFold: boolean = false): boolean {
  // Load first 2 images or above-fold images with priority
  return index < 2 || isAboveFold
}

/**
 * Validate image format
 * @param filename - Image filename
 * @returns Boolean indicating if format is valid
 */
export function isValidImageFormat(filename: string): boolean {
  const validFormats = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i
  return validFormats.test(filename)
}

/**
 * Convert image path to WebP format
 * @param imagePath - Original image path
 * @returns WebP image path
 */
export function toWebP(imagePath: string): string {
  return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
}

/**
 * Get image dimensions from aspect ratio
 * @param aspectRatio - Aspect ratio (e.g., "16:9")
 * @param baseWidth - Base width in pixels
 * @returns Object with width and height
 */
export function getDimensionsFromAspectRatio(
  aspectRatio: string,
  baseWidth: number
): { width: number; height: number } {
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number)
  const height = Math.round((baseWidth * heightRatio) / widthRatio)
  
  return { width: baseWidth, height }
}

/**
 * Preload critical images
 * @param imageSrcs - Array of image sources to preload
 */
export function preloadImages(imageSrcs: string[]): void {
  if (typeof window === 'undefined') return

  imageSrcs.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.type = 'image/webp'
    document.head.appendChild(link)
  })
}

/**
 * Lazy load images with Intersection Observer
 * @param imageElement - Image element to observe
 * @param options - Intersection Observer options
 */
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
        }
        
        observer.unobserve(img)
      }
    })
  }, defaultOptions)

  observer.observe(imageElement)
  return observer
}
