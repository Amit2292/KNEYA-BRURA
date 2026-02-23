'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const validImages = images.filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">אין תמונה</span>
      </div>
    )
  }

  return (
    <div dir="rtl">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 border border-gray-200">
        <Image
          src={validImages[activeIndex]}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.slice(0, 6).map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-colors ${
                i === activeIndex ? 'border-brand-500' : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`תמונה ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} - תמונה ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
