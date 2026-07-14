/**
 * Placeholder Image Generator
 * Generate base64 encoded placeholder images for blur effect
 */

/**
 * Generate a solid color placeholder
 * @param color - Hex color (e.g., "#f3f4f6")
 * @returns Base64 data URL
 */
export function generateSolidPlaceholder(color: string = '#f3f4f6'): string {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="${color}"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Generate a gradient placeholder
 * @param color1 - Start color
 * @param color2 - End color
 * @returns Base64 data URL
 */
export function generateGradientPlaceholder(
  color1: string = '#e5e7eb',
  color2: string = '#f3f4f6'
): string {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="10" height="10" fill="url(#grad)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Generate a shimmer/skeleton placeholder
 * @returns Base64 data URL
 */
export function generateShimmerPlaceholder(): string {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer">
          <stop offset="0%" stop-color="#f3f4f6"/>
          <stop offset="50%" stop-color="#e5e7eb"/>
          <stop offset="100%" stop-color="#f3f4f6"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#shimmer)">
        <animate attributeName="x" from="-400" to="400" dur="1s" repeatCount="indefinite"/>
      </rect>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Generate placeholder based on image aspect ratio
 * @param width - Image width
 * @param height - Image height
 * @param color - Background color
 * @returns Base64 data URL
 */
export function generateAspectRatioPlaceholder(
  width: number,
  height: number,
  color: string = '#f3f4f6'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Get theme-aware placeholder color
 * @param isDark - Whether dark mode is active
 * @returns Placeholder data URL
 */
export function getThemePlaceholder(isDark: boolean = false): string {
  return isDark 
    ? generateSolidPlaceholder('#1f2937')  // dark gray
    : generateSolidPlaceholder('#f3f4f6')  // light gray
}

/**
 * Common preset placeholders
 */
export const PLACEHOLDER_PRESETS = {
  light: generateSolidPlaceholder('#f3f4f6'),
  dark: generateSolidPlaceholder('#1f2937'),
  lightGradient: generateGradientPlaceholder('#e5e7eb', '#f3f4f6'),
  darkGradient: generateGradientPlaceholder('#1f2937', '#111827'),
  blue: generateSolidPlaceholder('#dbeafe'),
  green: generateSolidPlaceholder('#dcfce7'),
  purple: generateSolidPlaceholder('#f3e8ff'),
  shimmer: generateShimmerPlaceholder(),
}

/**
 * Generate a placeholder with text
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param text - Text to display
 * @returns Base64 data URL
 */
export function generateTextPlaceholder(
  width: number,
  height: number,
  text: string = `${width}×${height}`
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#e5e7eb"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        fill="#9ca3af"
      >${text}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Extract dominant color from image URL (simplified version)
 * For production, use a library like color-thief or vibrant.js
 * @param imageUrl - URL of the image
 * @returns Promise with hex color
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  // This is a placeholder implementation
  // In production, use a proper color extraction library
  
  // For now, return a default color
  // You would integrate with color-thief or similar:
  // const colorThief = new ColorThief()
  // const color = await colorThief.getColor(imageElement)
  
  return '#f3f4f6'
}

/**
 * Create a blur hash style placeholder
 * Simplified version - for production, use blurhash library
 * @param width - Width
 * @param height - Height
 * @returns Base64 data URL
 */
export function generateBlurHashPlaceholder(
  width: number = 32,
  height: number = 32
): string {
  // This is a simplified version
  // For production, use the blurhash library: https://github.com/woltapp/blurhash
  
  const colors = ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280']
  const pixelSize = 4
  
  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
  
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      svgContent += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`
    }
  }
  
  svgContent += '</svg>'
  
  return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`
}
