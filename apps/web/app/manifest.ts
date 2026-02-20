import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bandu Manamperi - Contemporary Artist & Art Restoration',
    short_name: 'Bandu Manamperi',
    description: 'Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi. A contemporary Sri Lankan artist specializing in paintings, sculptures, and traditional art framing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

