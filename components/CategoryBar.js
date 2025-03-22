
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryBar() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = [
    'All',
    'Music',
    'Gaming',
    'News',
    'Live',
    'Comedy',
    'Programming',
    'Podcasts',
    'Cooking',
    'Sports',
    'Education',
    'Technology',
    'Travel',
    'Fashion',
    'Fitness',
    'Animation',
    'Science',
    'Movies',
    'Documentaries'
  ]

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setShowLeftArrow(container.scrollLeft > 0)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      // Initial check
      checkScrollPosition()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative mb-4">
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yt-black bg-opacity-90 p-1 rounded-full shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-2 -mx-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg mr-3 text-sm whitespace-nowrap ${
              activeCategory === category
                ? 'bg-white text-black font-medium'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yt-black bg-opacity-90 p-1 rounded-full shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}
