'use client'

import { useEffect } from 'react'
import OptimizedImage from '@/components/OptimizedImage'
import ImageGallery from '@/components/ImageGallery'
import { usePerformanceMonitoring, useSlowNetwork, logPerformanceMetrics } from '@/lib/usePerformanceMonitoring'
import { useLazyLoad } from '@/lib/useLazyLoad'
import Navbar from '@/components/Navbar'

export default function ImageExamplesPage() {
  const { metrics, networkInfo } = usePerformanceMonitoring()
  const isSlowNetwork = useSlowNetwork()
  const { ref: lazySection, hasIntersected } = useLazyLoad({ rootMargin: '100px' })

  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      logPerformanceMetrics(metrics)
    }
  }, [metrics])

  // Sample images for gallery (replace with real images)
  const galleryImages = [
    {
      id: '1',
      src: '/images/sample1.webp',
      alt: 'Sample image 1',
      width: 800,
      height: 600,
    },
    {
      id: '2',
      src: '/images/sample2.webp',
      alt: 'Sample image 2',
      width: 800,
      height: 600,
    },
    {
      id: '3',
      src: '/images/sample3.webp',
      alt: 'Sample image 3',
      width: 800,
      height: 600,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Image Optimization Examples
        </h1>

        {/* Performance Info */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Network Info</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Type: <span className="font-mono">{networkInfo.effectiveType || 'Unknown'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Downlink: <span className="font-mono">{networkInfo.downlink || 'N/A'} Mbps</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                RTT: <span className="font-mono">{networkInfo.rtt || 'N/A'} ms</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Slow Network: <span className="font-mono">{isSlowNetwork ? 'Yes' : 'No'}</span>
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Core Web Vitals</h3>
              {metrics.lcp && (
                <p className="text-gray-600 dark:text-gray-400">
                  LCP: <span className="font-mono">{metrics.lcp.toFixed(0)}ms</span>
                  <span className={metrics.lcp < 2500 ? 'text-green-600 ml-2' : 'text-yellow-600 ml-2'}>
                    {metrics.lcp < 2500 ? '✅ Good' : '⚠️ Needs improvement'}
                  </span>
                </p>
              )}
              {metrics.fid && (
                <p className="text-gray-600 dark:text-gray-400">
                  FID: <span className="font-mono">{metrics.fid.toFixed(0)}ms</span>
                </p>
              )}
              {metrics.cls !== undefined && (
                <p className="text-gray-600 dark:text-gray-400">
                  CLS: <span className="font-mono">{metrics.cls.toFixed(3)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Example 1: Priority Image (Above Fold) */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            1. Hero Image (Priority Loading)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This image loads immediately with priority={true} because it's above the fold.
          </p>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <OptimizedImage
              src="/images/hero.webp"
              alt="Hero banner"
              width={1200}
              height={600}
              priority={true}
              className="w-full rounded-lg"
            />
          </div>
        </section>

        {/* Example 2: Lazy Loaded Image */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            2. Lazy Loaded Image
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This image loads only when it enters the viewport (scroll down to see it load).
          </p>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <OptimizedImage
              src="/images/feature.webp"
              alt="Feature showcase"
              width={800}
              height={500}
              quality={isSlowNetwork ? 60 : 85}
              className="w-full rounded-lg"
            />
          </div>
        </section>

        {/* Example 3: Image Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            3. Image Gallery (Responsive Grid)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Responsive gallery with lazy loading and optimized sizes for each breakpoint.
          </p>
          <ImageGallery images={galleryImages} columns={3} gap={6} />
        </section>

        {/* Example 4: Conditional Loading */}
        <section className="mb-12" ref={lazySection}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            4. Conditionally Loaded Section
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This entire section loads only when you scroll to it.
          </p>
          {hasIntersected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <OptimizedImage
                  src="/images/thumbnail1.webp"
                  alt="Thumbnail 1"
                  width={400}
                  height={300}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">Card Title 1</h3>
                <p className="text-gray-600 dark:text-gray-400">Card description here</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <OptimizedImage
                  src="/images/thumbnail2.webp"
                  alt="Thumbnail 2"
                  width={400}
                  height={300}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">Card Title 2</h3>
                <p className="text-gray-600 dark:text-gray-400">Card description here</p>
              </div>
            </div>
          )}
        </section>

        {/* Example 5: Network-Aware Loading */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            5. Network-Aware Loading
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Image quality adjusts based on network speed. Currently loading at{' '}
            <span className="font-semibold">{isSlowNetwork ? '60%' : '85%'} quality</span>.
          </p>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <OptimizedImage
              src="/images/adaptive.webp"
              alt="Network adaptive image"
              width={800}
              height={500}
              quality={isSlowNetwork ? 60 : 85}
              className="w-full rounded-lg"
            />
          </div>
        </section>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            📊 Testing Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Open DevTools Network tab to see lazy loading in action</li>
            <li>Use Network throttling to simulate 3G connections</li>
            <li>Run Lighthouse audit to check performance score</li>
            <li>Scroll slowly to observe images loading as they enter viewport</li>
            <li>Check console for performance metrics</li>
          </ul>
        </div>

        {/* Documentation Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            For complete documentation, see{' '}
            <code className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">
              frontend/IMAGE_OPTIMIZATION.md
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}
