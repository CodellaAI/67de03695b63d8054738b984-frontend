
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import VideoCard from './VideoCard'
import { useToast } from '@/components/ui/Toast'

export default function VideoGrid() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
        setVideos(response.data)
      } catch (error) {
        console.error('Error fetching videos:', error)
        toast({
          title: 'Error',
          description: 'Could not load videos',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 rounded-lg aspect-video mb-2"></div>
            <div className="flex space-x-3">
              <div className="rounded-full bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}
