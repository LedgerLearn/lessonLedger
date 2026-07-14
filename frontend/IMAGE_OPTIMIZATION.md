# Image Optimization Guide

## Overview

This project implements comprehensive image optimization and lazy loading to achieve excellent web performance, particularly on slow 3G connections.

## Features Implemented ✅

### 1. Image Format Optimization
- **WebP Format**: Automatic conversion to WebP format (85% quality by default)
- **AVIF Support**: Next.js will serve AVIF when browser supports it
- **Format Fallback**: Automatic fallback to original format if WebP/AVIF not supported

### 2. Lazy Loading
- **Intersection Observer**: Images load only when entering viewport
- **Configurable Threshold**: Loads 50px before image enters view
- **Priority Loading**: First 2 images and above-fold content load immediately
- **SSR Compatible**: Fallback for browsers without IntersectionObserver

### 3. Placeholder & Loading States
- **Blur Placeholders**: Low-quality image placeholder while loading
- **Loading Indicators**: Animated spinner during image load
- **Smooth Transitions**: Fade-in effect when image loads
- **Error Handling**: Fallback UI for broken images

### 4. Responsive Images
- **Multiple Sizes**: 8 device sizes from 640px to 3840px
- **Smart Sizing**: Automatic selection of optimal size
- **Responsive Breakpoints**: Mobile, tablet, desktop optimized
- **Art Direction**: Support for different images at different breakpoints

### 5. Performance Optimization
- **CDN Caching**: 60-second minimum cache TTL
- **Progressive Loading**: Images load as user scrolls
- **Network Detection**: Adapts to slow connections (2G/3G)
- **Data Saver Mode**: Respects user's data preferences
- **Core Web Vitals**: Optimized for LCP, CLS, FID

## Components

### OptimizedImage

Main image component with all optimization features.

```tsx
import OptimizedImage from '@/components/OptimizedImage'

<OptimizedImage 
  src="/images/hero.webp"
  alt="Hero image"
  width={1200}
  height={600}
  priority={false}
  quality={85}
  className="rounded-lg"
/>
```

**Props:**
- `src`: Image source (preferably WebP)
- `alt`: Alternative text (required for accessibility)
- `width`, `height`: Dimensions in pixels
- `fill`: Use for background images
- `priority`: Load immediately (use for above-fold)
- `quality`: 1-100, default 85
- `objectFit`: 'cover', 'contain', etc.
- `sizes`: Responsive sizes string
- `placeholder`: 'blur' or 'empty'
- `blurDataURL`: Custom blur placeholder

### ImageGallery

Responsive grid with optimized images.

```tsx
import ImageGallery from '@/components/ImageGallery'

<ImageGallery 
  images={[
    { 
      id: '1', 
      src: '/images/photo1.webp', 
      alt: 'Description',
      width: 800,
      height: 600
    }
  ]}
  columns={3}
  gap={4}
/>
```

## Hooks

### useLazyLoad

Custom lazy loading hook.

```tsx
import { useLazyLoad } from '@/lib/useLazyLoad'

const { ref, isIntersecting } = useLazyLoad({ rootMargin: '100px' })

<div ref={ref}>
  {isIntersecting && <HeavyComponent />}
</div>
```

### usePerformanceMonitoring

Monitor Core Web Vitals.

```tsx
import { usePerformanceMonitoring } from '@/lib/usePerformanceMonitoring'

const { metrics, networkInfo } = usePerformanceMonitoring()

// metrics.lcp - Largest Contentful Paint
// metrics.fid - First Input Delay
// metrics.cls - Cumulative Layout Shift
// networkInfo.effectiveType - '4g', '3g', '2g', 'slow-2g'
```

### useSlowNetwork

Detect slow connections.

```tsx
import { useSlowNetwork } from '@/lib/usePerformanceMonitoring'

const isSlowNetwork = useSlowNetwork()

// Load lower quality or smaller images on slow networks
<OptimizedImage 
  quality={isSlowNetwork ? 60 : 85}
  src={isSlowNetwork ? smallImage : largeImage}
/>
```

## Utilities

### imageUtils.ts

Helper functions for image optimization.

```tsx
import { 
  getResponsiveSizes, 
  shouldUsePriority,
  toWebP,
  preloadImages 
} from '@/lib/imageUtils'

// Get responsive sizes string
const sizes = getResponsiveSizes({
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
})

// Check if image should load with priority
const priority = shouldUsePriority(index, isAboveFold)

// Convert to WebP
const webpPath = toWebP('/images/photo.jpg') // '/images/photo.webp'

// Preload critical images
preloadImages(['/images/hero.webp', '/images/logo.webp'])
```

## Configuration

### next.config.js

```javascript
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

## Best Practices

### 1. Image Preparation
- **Convert to WebP**: Use tools like `sharp`, `squoosh`, or online converters
- **Optimize Quality**: 85% is optimal balance of quality/size
- **Right Size**: Don't use 4K images for thumbnails
- **Naming**: Use descriptive names: `hero-banner.webp`, not `img123.jpg`

### 2. Lazy Loading Strategy
- **Above Fold**: Set `priority={true}` for images visible on load
- **Hero Images**: Always use priority for main banner/hero
- **Below Fold**: Let lazy loading handle the rest
- **Galleries**: First 2-6 images with priority

### 3. Responsive Images
```tsx
// Hero image - full width on mobile, half on desktop
<OptimizedImage 
  sizes="(max-width: 768px) 100vw, 50vw"
  src="/images/hero.webp"
  priority={true}
/>

// Thumbnail in grid - always small
<OptimizedImage 
  sizes="(max-width: 768px) 50vw, 33vw"
  src="/images/thumb.webp"
/>
```

### 4. Performance Tips
- **Limit Priority Images**: Only 2-3 images above fold need priority
- **Use Blur Placeholders**: Improves perceived performance
- **Preload Critical**: Use `preloadImages()` for hero images
- **Monitor Metrics**: Check LCP should be < 2.5s
- **Test on 3G**: Use Chrome DevTools throttling

### 5. Accessibility
- **Always Add Alt Text**: Describe the image content
- **Decorative Images**: Use `alt=""` for purely decorative images
- **Context Matters**: Alt text should be contextual to surrounding content
- **Avoid "Image of"**: Screen readers already announce it's an image

## Image Organization

```
public/
└── images/
    ├── avatars/          # User profile images
    ├── backgrounds/      # Background images
    ├── icons/           # Icon images
    ├── products/        # Product photos
    ├── thumbnails/      # Thumbnail versions
    └── hero/            # Hero/banner images
```

## Performance Targets

### Lighthouse Score Goals
- **Performance**: > 90
- **LCP**: < 2.5 seconds (Good)
- **CLS**: < 0.1 (Good)
- **FID**: < 100ms (Good)

### Network Conditions
- **4G**: All images load normally
- **3G**: Slightly reduced quality (75%)
- **2G/Slow 2G**: Minimal images, lower quality (60%)
- **Save Data**: Respect user preference, load fewer images

## Testing

### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Performance Testing

1. **Chrome DevTools**
   - Open DevTools → Lighthouse
   - Select "Performance" category
   - Choose "Mobile" device
   - Set "Slow 3G" throttling
   - Run audit

2. **Network Throttling**
   - DevTools → Network tab
   - Select "Slow 3G" preset
   - Reload page and observe loading

3. **Core Web Vitals**
   - Install Web Vitals extension
   - Or use built-in performance monitoring hook
   - Check console for metrics

### Manual Checks
- [ ] Images appear as they scroll into view
- [ ] Blur placeholder shows while loading
- [ ] No broken image icons
- [ ] Fast load on 3G (test with throttling)
- [ ] Smooth scrolling without layout shifts
- [ ] Images have appropriate alt text

## Troubleshooting

### Images Not Loading
- Check image path is correct (`/images/...`)
- Ensure WebP files exist in public/images/
- Verify Next.js server is running
- Check console for errors

### Slow Loading
- Reduce image quality in component props
- Ensure images are properly optimized
- Check network tab for large file sizes
- Use WebP format (smaller than JPG/PNG)

### Layout Shift
- Always specify width and height
- Use aspect ratio in CSS if needed
- Reserve space for images before load
- Test CLS score in Lighthouse

### Broken Images
- Add proper error handling
- Provide fallback images
- Check image format is supported
- Verify file permissions

## Migration Guide

### Converting Existing Images

1. **Replace `<img>` tags:**
```tsx
// Before
<img src="/photo.jpg" alt="Photo" />

// After
<OptimizedImage 
  src="/images/photo.webp"
  alt="Photo"
  width={800}
  height={600}
/>
```

2. **Update Image Imports:**
```tsx
// Before
import logo from '../public/logo.png'

// After
<OptimizedImage 
  src="/images/logo.webp"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

3. **Convert Files to WebP:**
```bash
# Using sharp-cli
npm install -g sharp-cli
sharp -i input.jpg -o output.webp -f webp -q 85

# Or use online tools
# - squoosh.app
# - cloudconvert.com
```

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Image Best Practices](https://web.dev/fast/#optimize-your-images)
- [Core Web Vitals](https://web.dev/vitals/)
- [WebP Format](https://developers.google.com/speed/webp)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Support

For issues or questions about image optimization, check:
1. This documentation
2. Next.js Image component docs
3. Project README.md
4. Open an issue in the repository

---

**Last Updated**: July 15, 2026
**Lighthouse Score Target**: > 90
**Tested On**: Chrome, Firefox, Safari, Edge
**Mobile Optimized**: ✅ iOS & Android
