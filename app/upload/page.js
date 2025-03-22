
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Upload, X, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('entertainment')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})
  
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // Redirect if not logged in
  if (typeof window !== 'undefined' && !user) {
    router.push('/login')
    return null
  }

  const categories = [
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'music', name: 'Music' },
    { id: 'education', name: 'Education' },
    { id: 'sports', name: 'Sports' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'technology', name: 'Technology' },
    { id: 'travel', name: 'Travel' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'news', name: 'News' },
  ]

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!videoFile) newErrors.video = 'Video file is required'
    if (!thumbnailFile) newErrors.thumbnail = 'Thumbnail is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setUploading(true)
    setUploadProgress(0)
    
    try {
      // In a real app, you would upload files to a storage service
      // Here we'll simulate file upload with a timeout
      
      // Create form data
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('video', videoFile)
      formData.append('thumbnail', thumbnailFile)
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(uploadInterval)
            return 95
          }
          return prev + 5
        })
      }, 500)
      
      // Send to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
          }
        }
      )
      
      clearInterval(uploadInterval)
      setUploadProgress(100)
      
      toast({
        title: 'Success!',
        description: 'Your video has been uploaded successfully',
      })
      
      // Redirect to the video page
      router.push(`/watch/${response.data._id}`)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'An error occurred during upload',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Video File</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors ${errors.video ? 'border-red-500' : 'border-gray-600'}`}
              onClick={() => document.getElementById('video-upload').click()}
            >
              {videoPreview ? (
                <div className="relative w-full h-full">
                  <video 
                    src={videoPreview} 
                    className="w-full h-full object-cover rounded" 
                    controls
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setVideoFile(null)
                      setVideoPreview('')
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Click to upload video</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, WebM or AVI (max. 1GB)</p>
                </>
              )}
              <input 
                id="video-upload" 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleVideoChange}
              />
            </div>
            {errors.video && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.video}
              </p>
            )}
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Thumbnail</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors ${errors.thumbnail ? 'border-red-500' : 'border-gray-600'}`}
              onClick={() => document.getElementById('thumbnail-upload').click()}
            >
              {thumbnailPreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover rounded" 
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-black bg-opacity-70 p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setThumbnailFile(null)
                      setThumbnailPreview('')
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Click to upload thumbnail</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (16:9 ratio)</p>
                </>
              )}
              <input 
                id="thumbnail-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleThumbnailChange}
              />
            </div>
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.thumbnail}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Add a title that describes your video"
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.title}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-2 font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-field min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Tell viewers about your video"
            maxLength={5000}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.description}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">{description.length}/5000</p>
        </div>
        
        <div>
          <label htmlFor="category" className="block mb-2 font-medium">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {uploading && (
          <div className="mb-4">
            <p className="text-sm mb-1">Uploading: {uploadProgress}%</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yt-red h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => router.back()}
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  )
}
