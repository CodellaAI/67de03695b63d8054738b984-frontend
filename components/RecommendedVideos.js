
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/components/ui/Toast'

export default function RecommendedVideos({ currentVideoId }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${currentVideoId}/recommended`)
        setVideos(response.data)
      } catch (error) {
        console.error('Error fetching recommended videos:', error)
        toast({
          title: 'Error',
          description: 'Could not load recommended videos',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedVideos()
  }, [currentVideoId, toast])

  // Format view count
  const formatViewCount = (count) => {
    if (!count) return '0 views'
    
    if (count < 1000) return `${count} views`
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`
    return `${(count / 1000000).toFixed(1)}M views`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse flex">
            <div className="bg-gray-700 rounded-lg w-40 h-24"></div>
            <div className="flex-1 ml-2 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {videos.map(video => (
        <Link key={video._id} href={`/watch/${video._id}`} className="flex group">
          <div className="w-40 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={video.thumbnailUrl || 'https://via.placeholder.com/160x90'} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="ml-2 flex-1">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-400">
              {video.title}
            </h3>
            
            <Link href={`/channel/${video.user?._id}`} className="text-yt-gray-dark text-xs mt-1 hover:text-white">
              {video.user?.username || 'Anonymous'}
            </Link>
            
            <div className="text-yt-gray-dark text-xs mt-1">
              <span>{formatViewCount(video.views)}</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
