import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
}

interface NetworkInfo {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

/**
 * Hook for monitoring Core Web Vitals and performance metrics
 * 
 * @returns Object containing performance metrics
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Get network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      })
    }

    // Measure Core Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          setMetrics((prev) => ({ ...prev, lcp: lastEntry.renderTime || lastEntry.loadTime }))
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observation not supported')
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            setMetrics((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observation not supported')
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsScore = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value
              setMetrics((prev) => ({ ...prev, cls: clsScore }))
            }
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observation not supported')
      }
    }

    // Get Navigation Timing metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      
      if (perfEntries.length > 0) {
        const navTiming = perfEntries[0]
        
        setMetrics((prev) => ({
          ...prev,
          fcp: navTiming.responseStart - navTiming.requestStart,
          ttfb: navTiming.responseStart - navTiming.requestStart,
        }))
      }
    }
  }, [])

  return { metrics, networkInfo }
}

/**
 * Hook to detect slow network conditions
 * 
 * @returns Boolean indicating if connection is slow
 */
export function useSlowNetwork(): boolean {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      // Consider 2G, slow-2g, or save-data as slow network
      const slow = connection.effectiveType === '2g' || 
                   connection.effectiveType === 'slow-2g' || 
                   connection.saveData === true

      setIsSlowNetwork(slow)

      // Listen for changes
      const handleChange = () => {
        const newSlow = connection.effectiveType === '2g' || 
                       connection.effectiveType === 'slow-2g' || 
                       connection.saveData === true
        setIsSlowNetwork(newSlow)
      }

      connection.addEventListener('change', handleChange)

      return () => {
        connection.removeEventListener('change', handleChange)
      }
    }
  }, [])

  return isSlowNetwork
}

/**
 * Hook to check if device prefers reduced data
 * 
 * @returns Boolean indicating if user has data saver enabled
 */
export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      setSaveData(connection.saveData === true)
    }
  }, [])

  return saveData
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (process.env.NODE_ENV !== 'development') return

  console.group('🚀 Performance Metrics')
  
  if (metrics.lcp) {
    const lcpStatus = metrics.lcp < 2500 ? '✅' : metrics.lcp < 4000 ? '⚠️' : '❌'
    console.log(`${lcpStatus} LCP: ${metrics.lcp.toFixed(2)}ms (Good: <2.5s, Needs Improvement: <4s)`)
  }
  
  if (metrics.fid) {
    const fidStatus = metrics.fid < 100 ? '✅' : metrics.fid < 300 ? '⚠️' : '❌'
    console.log(`${fidStatus} FID: ${metrics.fid.toFixed(2)}ms (Good: <100ms, Needs Improvement: <300ms)`)
  }
  
  if (metrics.cls) {
    const clsStatus = metrics.cls < 0.1 ? '✅' : metrics.cls < 0.25 ? '⚠️' : '❌'
    console.log(`${clsStatus} CLS: ${metrics.cls.toFixed(3)} (Good: <0.1, Needs Improvement: <0.25)`)
  }
  
  if (metrics.fcp) {
    console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`)
  }
  
  if (metrics.ttfb) {
    console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`)
  }
  
  console.groupEnd()
}
