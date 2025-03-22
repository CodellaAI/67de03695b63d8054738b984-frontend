
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Clock, ThumbsUp, Film, Gamepad2, Lightbulb, Trophy, Music, Newspaper, Flame, ShoppingBag, Plus } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const mainLinks = [
    { icon: Home, text: 'Home', href: '/' },
    { icon: Compass, text: 'Explore', href: '/explore' },
    { icon: Plus, text: 'Shorts', href: '/shorts' },
    { icon: Film, text: 'Subscriptions', href: '/subscriptions' },
  ]

  const libraryLinks = [
    { icon: Clock, text: 'History', href: '/history' },
    { icon: ThumbsUp, text: 'Liked videos', href: '/playlist?list=LL' },
  ]

  const exploreLinks = [
    { icon: Flame, text: 'Trending', href: '/trending' },
    { icon: Music, text: 'Music', href: '/music' },
    { icon: Film, text: 'Movies & TV', href: '/movies' },
    { icon: Gamepad2, text: 'Gaming', href: '/gaming' },
    { icon: Newspaper, text: 'News', href: '/news' },
    { icon: Trophy, text: 'Sports', href: '/sports' },
    { icon: Lightbulb, text: 'Learning', href: '/learning' },
    { icon: ShoppingBag, text: 'Fashion & Beauty', href: '/fashion' },
  ]

  // Don't show sidebar on certain pages
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  return (
    <aside className={`${expanded ? 'w-64' : 'w-20'} h-full bg-yt-black flex-shrink-0 overflow-y-auto hidden md:block`}>
      <div className="py-3">
        <ul>
          {mainLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={`flex items-center px-3 py-2 mx-2 rounded-lg ${
                  pathname === link.href ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <link.icon size={24} className="min-w-[24px]" />
                {expanded && <span className="ml-6">{link.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        {expanded && (
          <>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="px-5 mb-1 text-sm font-medium">Library</h3>
              <ul>
                {libraryLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2 mx-2 rounded-lg ${
                        pathname === link.href ? 'bg-gray-800' : 'hover:bg-gray-800'
                      }`}
                    >
                      <link.icon size={24} />
                      <span className="ml-6">{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="px-5 mb-1 text-sm font-medium">Explore</h3>
              <ul>
                {exploreLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2 mx-2 rounded-lg ${
                        pathname === link.href ? 'bg-gray-800' : 'hover:bg-gray-800'
                      }`}
                    >
                      <link.icon size={24} />
                      <span className="ml-6">{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700 px-5 text-sm text-gray-400">
              <div className="flex flex-wrap gap-2 mb-3">
                <a href="#" className="hover:text-gray-200">About</a>
                <a href="#" className="hover:text-gray-200">Press</a>
                <a href="#" className="hover:text-gray-200">Copyright</a>
                <a href="#" className="hover:text-gray-200">Contact</a>
                <a href="#" className="hover:text-gray-200">Creators</a>
                <a href="#" className="hover:text-gray-200">Advertise</a>
                <a href="#" className="hover:text-gray-200">Developers</a>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <a href="#" className="hover:text-gray-200">Terms</a>
                <a href="#" className="hover:text-gray-200">Privacy</a>
                <a href="#" className="hover:text-gray-200">Policy & Safety</a>
                <a href="#" className="hover:text-gray-200">How YouTube works</a>
                <a href="#" className="hover:text-gray-200">Test new features</a>
              </div>
              
              <p className="mt-4">© 2023 YouTube Clone</p>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
