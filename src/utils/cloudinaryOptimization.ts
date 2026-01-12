/**
 * Cloudinary Image Optimization Utility
 * Converts standard Cloudinary URLs to optimized versions with automatic transformations
 */

type ImageCategory = 'blog' | 'gallery' | 'testimonial' | 'default';

interface TransformationConfig {
  width: number;
  height: number;
  quality: number;
  format: string;
  fit: string;
}

const CLOUDINARY_TRANSFORMATIONS: Record<ImageCategory, TransformationConfig> = {
  blog: {
    width: 1200,
    height: 600,
    quality: 92,
    format: 'auto',
    fit: 'fill'
  },
  gallery: {
    width: 600,
    height: 600,
    quality: 92,
    format: 'auto',
    fit: 'fill'
  },
  testimonial: {
    width: 200,
    height: 200,
    quality: 95,
    format: 'auto',
    fit: 'fill'
  },
  default: {
    width: 1000,
    height: 1000,
    quality: 92,
    format: 'auto',
    fit: 'fit'
  }
};

/**
 * Extract cloud name from Cloudinary URL
 * Handles: https://res.cloudinary.com/{CLOUD_NAME}/image/upload/...
 * @param url - Cloudinary image URL
 * @returns cloud name or default
 */
export function extractCloudName(url: string): string {
  try {
    const match = url.match(/res\.cloudinary\.com\/([^/]+)/);
    if (match && match[1]) return match[1];
  } catch (e) {
    console.warn('Could not extract cloud name from URL:', url);
  }
  return import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dovcohv9k';
}

/**
 * Extract public_id from Cloudinary URL
 * Handles both versioned and non-versioned URLs
 * @param url - Cloudinary image URL
 * @returns public_id string
 */
export function extractPublicId(url: string): string {
  try {
    // If it's already just a public_id, return it
    if (!url.includes('res.cloudinary.com')) {
      return url;
    }
    
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find 'upload' index and get everything after it
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return url;
    
    // Get everything after /upload/ and remove version if present
    const remaining = pathParts.slice(uploadIndex + 1).join('/');
    // Remove /v{number}/ prefix if present
    const withoutVersion = remaining.replace(/\/v\d+\//g, '/').replace(/\/$/, '');
    
    return withoutVersion;
  } catch {
    return url;
  }
}

/**
 * Generate optimized Cloudinary URL with transformations
 * Preserves original cloud name from URL
 * @param imageUrl - Original or public_id
 * @param category - Image category for optimization settings
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  category: ImageCategory = 'default'
): string {
  if (!imageUrl) return '';

  // Extract cloud name from URL if it's a full URL
  let cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dovcohv9k';
  if (imageUrl.includes('res.cloudinary.com')) {
    cloudName = extractCloudName(imageUrl);
  }

  // Extract public_id
  let publicId = imageUrl;
  if (imageUrl.includes('res.cloudinary.com')) {
    publicId = extractPublicId(imageUrl);
  }

  const config = CLOUDINARY_TRANSFORMATIONS[category];

  // Build transformation string
  // Format: w_{width},h_{height},c_{fit},q_{quality},f_{format}
  const transformation = `w_${config.width},h_${config.height},c_${config.fit},q_${config.quality},f_${config.format}`;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
}

/**
 * Generate multiple optimized URLs for responsive images
 * @param imageUrl - Original or public_id
 * @returns Object with urls for different sizes
 */
export function getResponsiveImageUrls(imageUrl: string) {
  return {
    thumbnail: getOptimizedImageUrl(imageUrl, 'testimonial'),
    gallery: getOptimizedImageUrl(imageUrl, 'gallery'),
    blog: getOptimizedImageUrl(imageUrl, 'blog'),
    full: getOptimizedImageUrl(imageUrl, 'default')
  };
}

/**
 * Get srcset string for responsive images
 * @param imageUrl - Original or public_id
 * @param category - Image category
 * @returns srcset string for img tag
 */
export function getSrcSet(
  imageUrl: string,
  category: ImageCategory = 'default'
): string {
  const config = CLOUDINARY_TRANSFORMATIONS[category];
  const cloudName = extractCloudName(imageUrl);
  const publicId = extractPublicId(imageUrl);

  // 1x: original size, 2x: double size for high-DPI displays
  const original = `https://res.cloudinary.com/${cloudName}/image/upload/w_${config.width},h_${config.height},c_${config.fit},q_${config.quality},f_${config.format}/${publicId} 1x`;
  const double = `https://res.cloudinary.com/${cloudName}/image/upload/w_${config.width * 2},h_${config.height * 2},c_${config.fit},q_${config.quality},f_${config.format}/${publicId} 2x`;

  return `${original}, ${double}`;
}

export default {
  extractCloudName,
  extractPublicId,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getSrcSet
};
