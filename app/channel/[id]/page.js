
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import VideoCard from '@/components/VideoCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function ChannelPage() {
  const { id } = useParams()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        // Fetch channel info
        const channelResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`)
        setChannel(channelResponse.data)
        
        // Fetch channel videos
        const videosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/user/${id}`)
        setVideos(videosResponse.data)
        
        // Check if current user is subscribed to this channel
        if (user) {
          const subscriptionResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/subscription-status`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          )
          setIsSubscribed(subscriptionResponse.data.isSubscribed)
        }
      } catch (error) {
        console.error('Error fetching channel data:', error)
        toast({
          title: 'Error',
          description: 'Could not load channel data',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchChannelData()
    }
  }, [id, user, toast])

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to channels',
        variant: 'destructive'
      })
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      setIsSubscribed(true)
      setChannel(prev => ({
        ...prev,
        subscribers: prev.subscribers + 1
      }))
      
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to ${channel.username}`,
      })
    } catch (error) {
      console.error('Error subscribing:', error)
      toast({
        title: 'Error',
        description: 'Could not subscribe to channel',
        variant: 'destructive'
      })
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/unsubscribe`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      setIsSubscribed(false)
      setChannel(prev => ({
        ...prev,
        subscribers: prev.subscribers - 1
      }))
      
      toast({
        title: 'Unsubscribed',
        description: `You have unsubscribed from ${channel.username}`,
      })
    } catch (error) {
      console.error('Error unsubscribing:', error)
      toast({
        title: 'Error',
        description: 'Could not unsubscribe from channel',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  if (!channel) {
    return <div className="flex justify-center items-center h-full">Channel not found</div>
  }

  return (
    <div className="container mx-auto">
      {/* Channel Header */}
      <div className="relative">
        {/* Channel Banner */}
        <div className="w-full h-40 md:h-60 bg-gray-700 rounded-lg overflow-hidden">
          {channel.banner ? (
            <Image
              src={channel.banner}
              alt={`${channel.username}'s banner`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700" />
          )}
        </div>
        
        {/* Channel Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-6 px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            {channel.avatar ? (
              <Image
                src={channel.avatar}
                alt={channel.username}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-2xl font-bold">
                {channel.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 mt-4 md:mt-0 md:ml-6">
            <h1 className="text-2xl font-bold">{channel.username}</h1>
            <p className="text-yt-gray-dark mt-1">
              {channel.subscribers} subscribers • {videos.length} videos
            </p>
            <p className="text-yt-gray-dark mt-2 line-clamp-2">
              {channel.description || 'No description provided'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {user && user._id === id ? (
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-700"
              >
                Manage Channel
              </button>
            ) : (
              <button
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                className={`px-6 py-2 rounded-full font-medium ${
                  isSubscribed 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'bg-yt-red hover:bg-red-700 text-white'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Channel Content */}
      <div className="mt-8">
        <Tabs defaultValue="videos">
          <TabsList className="border-b border-gray-700 mb-6">
            <TabsTrigger value="videos" className="px-6 py-3">Videos</TabsTrigger>
            <TabsTrigger value="playlists" className="px-6 py-3">Playlists</TabsTrigger>
            <TabsTrigger value="about" className="px-6 py-3">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-yt-gray-dark">This channel doesn&apos;t have any videos yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="playlists">
            <div className="text-center py-10">
              <p className="text-yt-gray-dark">No playlists found.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="max-w-3xl">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="whitespace-pre-line text-yt-gray-dark">
                  {channel.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Stats</h3>
                <p className="text-yt-gray-dark">Joined {new Date(channel.createdAt).toLocaleDateString()}</p>
                <p className="text-yt-gray-dark">{channel.views || 0} channel views</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
