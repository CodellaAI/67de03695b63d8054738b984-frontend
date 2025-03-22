
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export default function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Format view count
  const formatViewCount = (count) => {
    if (!count) return '0 views'
    
    if (count < 1000) return `${count} views`
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`
    return `${(count / 1000000).toFixed(1)}M views`
  }

  return (
    <div className="cursor-pointer">
      <Link href={`/watch/${video._id}`}>
        <div 
          className="relative aspect-video rounded-lg overflow-hidden bg-gray-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={video.thumbnailUrl || 'https://via.placeholder.com/640x360'}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Video duration */}
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
            {video.duration || '0:00'}
          </div>
        </div>
      </Link>
      
      <div className="flex mt-2">
        <Link href={`/channel/${video.user?._id}`} className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700">
            <img
              src={video.user?.avatar || 'https://via.placeholder.com/40'}
              alt={video.user?.username || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        
        <div className="ml-2">
          <Link href={`/watch/${video._id}`}>
            <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
          </Link>
          
          <Link href={`/channel/${video.user?._id}`} className="text-yt-gray-dark text-xs mt-1 hover:text-white">
            {video.user?.username || 'Anonymous'}
          </Link>
          
          <div className="text-yt-gray-dark text-xs mt-1">
            <span>{formatViewCount(video.views)}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
