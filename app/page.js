
import VideoGrid from '@/components/VideoGrid'
import CategoryBar from '@/components/CategoryBar'

export default function Home() {
  return (
    <div className="container mx-auto">
      <CategoryBar />
      <VideoGrid />
    </div>
  )
}
