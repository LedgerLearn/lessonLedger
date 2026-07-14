'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  quality?: number
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoadingComplete?: () => void
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Automatic WebP/AVIF format conversion
 * - Lazy loading with intersection observer
 * - Blur placeholder while loading
 * - Responsive sizing
 * - Error handling with fallback
 * - Loading state indicator
 * 
 * @example
 * <OptimizedImage 
 *   src="/images/hero.jpg" 
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 *   priority={false}
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  className = '',
  objectFit = 'cover',
  sizes,
  placeholder = 'blur',
  blurDataURL,
  onLoadingComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate a simple blur data URL if none provided
  const defaultBlurDataURL = 
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

  const handleLoadingComplete = () => {
    setIsLoading(false)
    onLoadingComplete?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Error state fallback
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
          <ImageIcon className="w-8 h-8" />
          <span className="text-sm">Image not available</span>
        </div>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    quality,
    className: `${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`,
    onLoad: handleLoadingComplete,
    onError: handleError,
    loading: priority ? undefined : ('lazy' as const),
    priority,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
    ...(placeholder === 'blur' && { 
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL || defaultBlurDataURL 
    }),
    style: {
      objectFit,
    },
  }

  return (
    <div className="relative">
      <Image {...imageProps} />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 animate-pulse">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
