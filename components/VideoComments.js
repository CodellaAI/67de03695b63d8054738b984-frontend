
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function VideoComments({ videoId }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`)
        setComments(response.data)
      } catch (error) {
        console.error('Error fetching comments:', error)
        toast({
          title: 'Error',
          description: 'Could not load comments',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [videoId, toast])

  const handleAddComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) return
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to comment',
        variant: 'destructive'
      })
      return
    }
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`, 
        { content: commentText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      // Add the new comment to the list
      setComments([response.data, ...comments])
      setCommentText('')
      
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: 'Error',
        description: 'Could not add comment',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <button 
          className="flex items-center"
          onClick={() => setShowComments(!showComments)}
        >
          <h3 className="text-lg font-medium mr-2">{comments.length} Comments</h3>
          {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {showComments && (
        <>
          {/* Comment form */}
          <div className="flex mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {user ? (
                <img 
                  src={user.avatar || 'https://via.placeholder.com/40'} 
                  alt={user.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-lg font-bold">
                  ?
                </div>
              )}
            </div>
            
            <form onSubmit={handleAddComment} className="flex-1 ml-3">
              <input
                type="text"
                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                className="w-full bg-transparent border-b border-gray-700 px-1 py-2 focus:outline-none focus:border-gray-500"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!user}
              />
              
              {commentText.trim() && (
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm font-medium rounded-full hover:bg-gray-800"
                    onClick={() => setCommentText('')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    Comment
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Comments list */}
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment._id} className="flex">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    <img 
                      src={comment.user?.avatar || 'https://via.placeholder.com/40'} 
                      alt={comment.user?.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-sm">{comment.user?.username}</h4>
                      <span className="ml-2 text-xs text-yt-gray-dark">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm">{comment.content}</p>
                    
                    <div className="flex items-center mt-2">
                      <button className="flex items-center mr-4 text-yt-gray-dark hover:text-white">
                        <ThumbsUp size={14} className="mr-1" />
                        <span className="text-xs">{comment.likes || 0}</span>
                      </button>
                      
                      <button className="flex items-center text-yt-gray-dark hover:text-white">
                        <ThumbsDown size={14} className="mr-1" />
                      </button>
                      
                      <button className="ml-4 text-xs font-medium text-yt-gray-dark hover:text-white">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-yt-gray-dark">
              <MessageSquare className="mx-auto mb-2" size={32} />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
