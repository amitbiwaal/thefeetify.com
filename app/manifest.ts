import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Sell Feet Pics Online`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: SITE.themeColor,
    icons: [
      { src: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/assets/favicon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
