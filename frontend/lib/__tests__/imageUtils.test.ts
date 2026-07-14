import {
  getResponsiveSizes,
  shouldUsePriority,
  isValidImageFormat,
  toWebP,
  getDimensionsFromAspectRatio,
} from '../imageUtils'

describe('imageUtils', () => {
  describe('getResponsiveSizes', () => {
    it('returns default responsive sizes', () => {
      const sizes = getResponsiveSizes()
      expect(sizes).toBe('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw')
    })

    it('accepts custom breakpoints', () => {
      const sizes = getResponsiveSizes({
        mobile: '90vw',
        tablet: '60vw',
        desktop: '40vw',
      })
      expect(sizes).toBe('(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 40vw')
    })

    it('merges custom with defaults', () => {
      const sizes = getResponsiveSizes({ mobile: '95vw' })
      expect(sizes).toContain('95vw')
      expect(sizes).toContain('50vw') // default tablet
      expect(sizes).toContain('33vw') // default desktop
    })
  })

  describe('shouldUsePriority', () => {
    it('returns true for first two images', () => {
      expect(shouldUsePriority(0)).toBe(true)
      expect(shouldUsePriority(1)).toBe(true)
    })

    it('returns false for images after index 1', () => {
      expect(shouldUsePriority(2)).toBe(false)
      expect(shouldUsePriority(5)).toBe(false)
    })

    it('returns true for above-fold images', () => {
      expect(shouldUsePriority(10, true)).toBe(true)
    })

    it('returns false for below-fold images after index 1', () => {
      expect(shouldUsePriority(3, false)).toBe(false)
    })
  })

  describe('isValidImageFormat', () => {
    it('validates common image formats', () => {
      expect(isValidImageFormat('photo.jpg')).toBe(true)
      expect(isValidImageFormat('photo.jpeg')).toBe(true)
      expect(isValidImageFormat('photo.png')).toBe(true)
      expect(isValidImageFormat('photo.webp')).toBe(true)
      expect(isValidImageFormat('photo.avif')).toBe(true)
      expect(isValidImageFormat('photo.gif')).toBe(true)
      expect(isValidImageFormat('icon.svg')).toBe(true)
    })

    it('rejects invalid formats', () => {
      expect(isValidImageFormat('document.pdf')).toBe(false)
      expect(isValidImageFormat('video.mp4')).toBe(false)
      expect(isValidImageFormat('file.txt')).toBe(false)
    })

    it('is case insensitive', () => {
      expect(isValidImageFormat('PHOTO.JPG')).toBe(true)
      expect(isValidImageFormat('Photo.PNG')).toBe(true)
    })
  })

  describe('toWebP', () => {
    it('converts jpg to webp', () => {
      expect(toWebP('/images/photo.jpg')).toBe('/images/photo.webp')
    })

    it('converts jpeg to webp', () => {
      expect(toWebP('/images/photo.jpeg')).toBe('/images/photo.webp')
    })

    it('converts png to webp', () => {
      expect(toWebP('/images/photo.png')).toBe('/images/photo.webp')
    })

    it('is case insensitive', () => {
      expect(toWebP('/images/PHOTO.JPG')).toBe('/images/PHOTO.webp')
    })

    it('handles paths with multiple dots', () => {
      expect(toWebP('/images/my.photo.v2.jpg')).toBe('/images/my.photo.v2.webp')
    })
  })

  describe('getDimensionsFromAspectRatio', () => {
    it('calculates dimensions for 16:9', () => {
      const dimensions = getDimensionsFromAspectRatio('16:9', 1600)
      expect(dimensions).toEqual({ width: 1600, height: 900 })
    })

    it('calculates dimensions for 4:3', () => {
      const dimensions = getDimensionsFromAspectRatio('4:3', 800)
      expect(dimensions).toEqual({ width: 800, height: 600 })
    })

    it('calculates dimensions for 1:1', () => {
      const dimensions = getDimensionsFromAspectRatio('1:1', 500)
      expect(dimensions).toEqual({ width: 500, height: 500 })
    })

    it('calculates dimensions for 21:9 ultrawide', () => {
      const dimensions = getDimensionsFromAspectRatio('21:9', 2100)
      expect(dimensions).toEqual({ width: 2100, height: 900 })
    })

    it('rounds height to nearest integer', () => {
      const dimensions = getDimensionsFromAspectRatio('16:9', 1000)
      expect(dimensions.height).toBe(563) // 562.5 rounded
      expect(Number.isInteger(dimensions.height)).toBe(true)
    })
  })
})
