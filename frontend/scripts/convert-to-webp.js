/**
 * Image Conversion Script
 * 
 * Converts JPG, JPEG, and PNG images to WebP format
 * 
 * Usage:
 *   node scripts/convert-to-webp.js [directory]
 * 
 * Example:
 *   node scripts/convert-to-webp.js public/images
 * 
 * Requirements:
 *   npm install sharp
 */

const fs = require('fs')
const path = require('path')

// Check if sharp is installed
let sharp
try {
  sharp = require('sharp')
} catch (error) {
  console.error('❌ Error: sharp is not installed')
  console.log('📦 Install it with: npm install sharp')
  process.exit(1)
}

const DEFAULT_QUALITY = 85
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png']

/**
 * Convert a single image to WebP
 */
async function convertImage(inputPath, quality = DEFAULT_QUALITY) {
  const ext = path.extname(inputPath).toLowerCase()
  const outputPath = inputPath.replace(new RegExp(`${ext}$`), '.webp')

  // Skip if WebP already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipped (already exists): ${path.basename(outputPath)}`)
    return { skipped: true }
  }

  try {
    const info = await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath)

    const inputSize = fs.statSync(inputPath).size
    const outputSize = info.size
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1)

    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`)
    console.log(`   Size: ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${savings}% smaller)`)

    return {
      success: true,
      inputPath,
      outputPath,
      inputSize,
      outputSize,
      savings: parseFloat(savings),
    }
  } catch (error) {
    console.error(`❌ Failed: ${path.basename(inputPath)}`)
    console.error(`   Error: ${error.message}`)
    return { error: true, path: inputPath }
  }
}

/**
 * Recursively find all images in a directory
 */
function findImages(dir) {
  let images = []

  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`)
    return images
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      images = images.concat(findImages(fullPath))
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase()
      if (SUPPORTED_FORMATS.includes(ext)) {
        images.push(fullPath)
      }
    }
  }

  return images
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2)
  const targetDir = args[0] || 'public/images'
  const quality = parseInt(args[1]) || DEFAULT_QUALITY

  console.log('🖼️  WebP Image Converter')
  console.log('═══════════════════════════════════')
  console.log(`📁 Directory: ${targetDir}`)
  console.log(`⚙️  Quality: ${quality}%`)
  console.log('')

  // Find all images
  console.log('🔍 Searching for images...')
  const images = findImages(targetDir)

  if (images.length === 0) {
    console.log('ℹ️  No images found to convert')
    return
  }

  console.log(`📸 Found ${images.length} image(s)\n`)

  // Convert all images
  const results = []
  for (const imagePath of images) {
    const result = await convertImage(imagePath, quality)
    results.push(result)
  }

  // Summary
  console.log('\n📊 Summary')
  console.log('═══════════════════════════════════')

  const successful = results.filter((r) => r.success)
  const skipped = results.filter((r) => r.skipped)
  const failed = results.filter((r) => r.error)

  console.log(`✅ Converted: ${successful.length}`)
  console.log(`⏭️  Skipped: ${skipped.length}`)
  console.log(`❌ Failed: ${failed.length}`)

  if (successful.length > 0) {
    const totalInputSize = successful.reduce((sum, r) => sum + r.inputSize, 0)
    const totalOutputSize = successful.reduce((sum, r) => sum + r.outputSize, 0)
    const avgSavings = successful.reduce((sum, r) => sum + r.savings, 0) / successful.length

    console.log(`\n💾 Total size: ${formatBytes(totalInputSize)} → ${formatBytes(totalOutputSize)}`)
    console.log(`📉 Average savings: ${avgSavings.toFixed(1)}%`)
  }

  console.log('\n✨ Done!')
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
