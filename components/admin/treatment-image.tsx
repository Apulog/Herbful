"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { isImageAccessible } from "@/lib/admin/storage-api";

interface TreatmentImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}

export function TreatmentImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
}: TreatmentImageProps) {
  const [imageAccessible, setImageAccessible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkImageAccessibility = async () => {
      if (!src) {
        setImageAccessible(false);
        setLoading(false);
        return;
      }

      try {
        // Check if the image URL is accessible
        const accessible = await isImageAccessible(src);
        setImageAccessible(accessible);
      } catch (error: any) {
        console.warn(
          "Error checking image accessibility for",
          src,
          ":",
          error?.message || error
        );
        setImageAccessible(false);
      } finally {
        setLoading(false);
      }
    };

    checkImageAccessibility();
  }, [src]);

  // Handle image load errors
  const handleImageError = (error: any) => {
    console.warn(
      "Failed to load image:",
      src,
      "Error:",
      error?.message || "Unknown error"
    );
    setImageAccessible(false);
  };

  if (loading) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="animate-pulse">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (!src || !imageAccessible) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      onError={handleImageError}
    />
  );
}
