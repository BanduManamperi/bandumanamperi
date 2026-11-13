import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bandu Manamperi, Contemporary Artist & Art Restoration',
    short_name: 'Bandu Manamperi',
    description: 'Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi. A contemporary Sri Lankan artist specializing in paintings, sculptures, and traditional art framing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e9e9e9',
    theme_color: '#e9e9e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      // Full-bleed with the monogram inside the safe zone, so these also work as maskable icons
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

