'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname()

  const getRedirectPath = (targetLang: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'bg')) {
      segments[1] = targetLang
    } else {
      segments.splice(1, 0, targetLang)
    }
    return segments.join('/')
  }

  return (
    <div className="flex space-x-2 text-sm font-semibold">
      <Link 
        href={getRedirectPath('bg')} 
        className={currentLang === 'bg' ? 'text-custom-gold' : 'hover:text-custom-gold'}
      >
        BG
      </Link>
      <span className="text-gray-400">|</span>
      <Link 
        href={getRedirectPath('en')} 
        className={currentLang === 'en' ? 'text-custom-gold' : 'hover:text-custom-gold'}
      >
        EN
      </Link>
    </div>
  )
}
