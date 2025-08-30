import { MetadataRoute } from 'next'
import { seoConfig } from '@/lib/seo/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/auth/error',
        '/auth/verify-email',
        '/auth/reset-password'
      ],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  }
}
