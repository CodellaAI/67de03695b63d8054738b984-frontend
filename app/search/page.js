
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Filter } from 'lucide-react'
import VideoCard from '@/components/VideoCard'
import { useToast } from '@/components/ui/Toast'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setVideos([])
        setLoading(false)
        return
      }
      
      setLoading(true)
      
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/search`, {
          params: { q: query, sort: filter }
        })
        setVideos(response.data)
      } catch (error) {
        console.error('Error fetching search results:', error)
        toast({
          title: 'Error',
          description: 'Could not load search results',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, filter, toast])

  const filters = [
    { id: 'relevance', name: 'Relevance' },
    { id: 'date', name: 'Upload date' },
    { id: 'views', name: 'View count' },
    { id: 'rating', name: 'Rating' },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">
          {query ? `Search results for "${query}"` : 'Search results'}
        </h1>
        
        <div className="relative">
          <button
            className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                {filters.map(item => (
                  <button
                    key={item.id}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === item.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setFilter(item.id)
                      setShowFilters(false)
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-2">No results found</p>
          <p className="text-gray-500">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  )
}
