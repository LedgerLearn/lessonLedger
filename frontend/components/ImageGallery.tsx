'use client'

import { useState } from 'react'
import OptimizedImage from './OptimizedImage'
import { getResponsiveSizes, shouldUsePriority } from '@/lib/imageUtils'

interface ImageItem {
  id: string
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  columns?: number
  gap?: number
  className?: string
}

/**
 * ImageGallery Component
 * 
 * Displays a responsive grid of optimized images with lazy loading
 * 
 * @example
 * <ImageGallery 
 *   images={[
 *     { id: '1', src: '/images/photo1.jpg', alt: 'Photo 1', width: 800, height: 600 }
 *   ]}
 *   columns={3}
 * />
 */
export default function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  className = '',
}: ImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId))
  }

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  const gapClass = `gap-${gap}`

  return (
    <div className={`grid ${gridClass} ${gapClass} ${className}`}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={shouldUsePriority(index, index < 6)}
            quality={85}
            sizes={getResponsiveSizes()}
            className="w-full h-auto"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            onLoadingComplete={() => handleImageLoad(image.id)}
          />
          
          {/* Optional: Image caption */}
          {image.alt && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm">{image.alt}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
