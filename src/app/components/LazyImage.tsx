import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  width?: number;
  height?: number;
}

/**
 * LazyImage Component
 * 
 * Implements IntersectionObserver API for native lazy loading
 * Images are only loaded when they become visible in the viewport
 * 
 * Features:
 * - Native browser lazy loading
 * - Smooth fade-in transition
 * - Loading state with spinner
 * - Responsive with optional dimensions
 * - Configurable placeholder color
 * 
 * @component
 * @example
 * <LazyImage 
 *   src="https://example.com/image.jpg"
 *   alt="Description"
 *   className="w-full h-full object-cover"
 * />
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  placeholderColor = 'bg-gray-200',
  width,
  height
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Image is now visible, start loading
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative w-full h-full ${placeholderColor}`}>
      {/* Placeholder while loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="animate-spin text-blue-900" size={24} />
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
          <span className="text-gray-500 text-sm">Image failed to load</span>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          crossOrigin="anonymous"
          className={`${className} transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default LazyImage;
