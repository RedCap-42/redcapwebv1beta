import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sessionType: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  sessionType, 
  className = '', 
  style = {},
  onError 
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  const getOptimizedStyle = (): React.CSSProperties => {
    if (sessionType === 'escalier' && imageDimensions) {
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      
      // If image is very tall (aspect ratio < 0.8), optimize for vertical display
      if (aspectRatio < 0.8) {
        return {
          ...style,
          objectFit: 'contain',
          objectPosition: 'center',
          maxHeight: '100%',
          width: 'auto',
          margin: '0 auto'
        };
      }
    }
    
    return style;
  };

  const getOptimizedClassName = (): string => {
    let classes = className;
    
    if (sessionType === 'escalier' && imageDimensions) {
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      
      // Add specific classes for escalier images
      if (aspectRatio < 0.8) {
        classes += ' max-w-none'; // Allow image to use its natural width
      }
    }
    
    return classes;
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={getOptimizedClassName()}
        style={getOptimizedStyle()}
        onLoad={handleLoad}
        onError={onError}
      />
      
      {/* Loading placeholder while image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500 text-sm">Chargement...</div>
        </div>
      )}
    </>
  );
}
