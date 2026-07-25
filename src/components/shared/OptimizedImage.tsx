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
  fill,
  ...props
}: OptimizedImageProps) {
  const [isError, setIsError] = useState(false);

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isStringSrc = typeof src === 'string';
  const hasNoSrc = !src || (isStringSrc && src.trim() === '');

  if (isError || hasNoSrc) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 font-semibold text-sm', containerClassName)}>
        {getInitials(fallbackText || alt)}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', fill ? 'w-full h-full' : '', containerClassName)}>
      {/* Standard HTML img for foolproof cross-origin and local asset rendering */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={isStringSrc ? (src as string) : undefined}
        alt={alt}
        className={cn(
          fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto object-cover',
          className
        )}
        onError={() => setIsError(true)}
      />
    </div>
  );
}
