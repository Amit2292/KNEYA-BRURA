'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const validImages = images.filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">אין תמונה</span>
      </div>
    )
  }

  function handleScroll() {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const width = scrollRef.current.offsetWidth
    const newIndex = Math.round(scrollLeft / width)
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < validImages.length) {
      setActiveIndex(newIndex)
    }
  }

  return (
    <div dir="rtl">
      {/* Swipeable carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto hide-scrollbar rounded-xl bg-gray-50"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {validImages.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full aspect-square relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Image
              src={src}
              alt={`${alt} - תמונה ${i + 1}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {validImages.length > 1 && (
        <div className="carousel-dots flex justify-center gap-2 mt-3">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollRef.current?.scrollTo({
                  left: i * (scrollRef.current?.offsetWidth ?? 0),
                  behavior: 'smooth',
                })
                setActiveIndex(i)
              }}
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              aria-label={`תמונה ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
