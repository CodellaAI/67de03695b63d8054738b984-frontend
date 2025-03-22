
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, ThumbsDown, Share, Save, Flag, MessageSquare } from 'lucide-react'
import VideoComments from '@/components/VideoComments'
import RecommendedVideos from '@/components/RecommendedVideos'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function WatchPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}`)
        setVideo(response.data)
        
        // Check if user has liked or disliked this video
        if (user) {
          const likeStatus = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/like-status`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
          setLiked(likeStatus.data.liked)
          setDisliked(likeStatus.data.disliked)
        }
      } catch (error) {
        console.error('Error fetching video:', error)
        toast({
          title: 'Error',
          description: 'Could not load video',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideo()
    }
  }, [id, user, toast])

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like videos',
        variant: 'destructive'
      })
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setLiked(true)
      setDisliked(false)
      // Update video likes count
      setVideo(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1,
        dislikes: disliked ? prev.dislikes - 1 : prev.dislikes
      }))
    } catch (error) {
      console.error('Error liking video:', error)
      toast({
        title: 'Error',
        description: 'Could not like video',
        variant: 'destructive'
      })
    }
  }

  const handleDislike = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to dislike videos',
        variant: 'destructive'
      })
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/dislike`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setDisliked(true)
      setLiked(false)
      // Update video dislikes count
      setVideo(prev => ({
        ...prev,
        dislikes: disliked ? prev.dislikes - 1 : prev.dislikes + 1,
        likes: liked ? prev.likes - 1 : prev.likes
      }))
    } catch (error) {
      console.error('Error disliking video:', error)
      toast({
        title: 'Error',
        description: 'Could not dislike video',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  if (!video) {
    return <div className="flex justify-center items-center h-full">Video not found</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="rounded-lg overflow-hidden aspect-video bg-gray-800">
          <ReactPlayer
            url={video.videoUrl}
            width="100%"
            height="100%"
            controls
            playing
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
        </div>
        
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <img 
                src={video.user?.avatar || 'https://via.placeholder.com/40'} 
                alt={video.user?.username} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{video.user?.username}</h3>
                <p className="text-sm text-yt-gray-dark">{video.user?.subscribers || 0} subscribers</p>
              </div>
              <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                Subscribe
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLike}
                className={`flex items-center px-3 py-2 rounded-full ${liked ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <ThumbsUp size={20} className={liked ? 'text-yt-red' : ''} />
                <span className="ml-2">{video.likes || 0}</span>
              </button>
              
              <button 
                onClick={handleDislike}
                className={`flex items-center px-3 py-2 rounded-full ${disliked ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <ThumbsDown size={20} className={disliked ? 'text-yt-red' : ''} />
                <span className="ml-2">{video.dislikes || 0}</span>
              </button>
              
              <button className="flex items-center px-3 py-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Share size={20} />
                <span className="ml-2">Share</span>
              </button>
              
              <button className="flex items-center px-3 py-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Save size={20} />
                <span className="ml-2">Save</span>
              </button>
              
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Flag size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-sm text-yt-gray-dark mb-2">
              <span>{video.views || 0} views</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="whitespace-pre-line">{video.description}</p>
          </div>
          
          <VideoComments videoId={id} />
        </div>
      </div>
      
      <div>
        <RecommendedVideos currentVideoId={id} />
      </div>
    </div>
  )
}
