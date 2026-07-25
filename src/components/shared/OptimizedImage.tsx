'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackText?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackText = 'MC',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative overflow-hidden bg-muted', containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-muted-foreground/20" />
      )}
      {isError ? (
        <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 font-semibold text-sm">
          {getInitials(fallbackText || alt)}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          priority={priority}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}
