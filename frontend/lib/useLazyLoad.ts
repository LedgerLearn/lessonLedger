import { useEffect, useRef, useState } from 'react'

interface UseLazyLoadOptions {
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
}

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLElement>
  isIntersecting: boolean
  hasIntersected: boolean
}

/**
 * Custom hook for lazy loading elements using Intersection Observer
 * 
 * @param options - Configuration options for the Intersection Observer
 * @returns Object containing ref to attach to element and intersection state
 * 
 * @example
 * const { ref, isIntersecting } = useLazyLoad({ rootMargin: '100px' })
 * 
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <HeavyComponent />}
 *   </div>
 * )
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    triggerOnce = true,
  } = options

  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true)
      setHasIntersected(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting) {
          setHasIntersected(true)
          
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [rootMargin, threshold, triggerOnce])

  return {
    ref: ref as React.RefObject<HTMLElement>,
    isIntersecting,
    hasIntersected,
  }
}

/**
 * Hook for lazy loading images with preloading support
 * 
 * @param imageSrc - Image source URL
 * @param options - Lazy load options
 * @returns Object with ref, loading state, and error state
 */
export function useLazyImage(
  imageSrc: string,
  options: UseLazyLoadOptions = {}
) {
  const { ref, isIntersecting, hasIntersected } = useLazyLoad(options)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!hasIntersected) return

    setIsLoading(true)
    setError(null)

    const img = new Image()

    img.onload = () => {
      setLoadedSrc(imageSrc)
      setIsLoading(false)
    }

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${imageSrc}`))
      setIsLoading(false)
    }

    img.src = imageSrc

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageSrc, hasIntersected])

  return {
    ref,
    isIntersecting,
    hasIntersected,
    isLoading,
    error,
    src: loadedSrc,
  }
}
