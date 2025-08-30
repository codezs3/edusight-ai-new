import { Metadata } from 'next'
import { seoConfig, pageConfigs } from './config'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
}

export function generateMetadata(props: SEOProps & { page?: keyof typeof pageConfigs }): Metadata {
  const pageConfig = props.page ? pageConfigs[props.page] : null
  
  const title = props.title || pageConfig?.title || seoConfig.openGraph.title
  const description = props.description || pageConfig?.description || seoConfig.description
  const keywords = props.keywords || pageConfig?.keywords || seoConfig.keywords.join(', ')
  const url = props.url || seoConfig.siteUrl
  const image = props.image || seoConfig.openGraph.images[0]

  return {
    title,
    description,
    keywords,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      images: typeof image === 'string' ? [{ url: image }] : [image],
      type: props.type || 'website',
      publishedTime: props.publishedTime,
      modifiedTime: props.modifiedTime
    },
    
    // Twitter
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
      images: typeof image === 'string' ? [image] : [image.url]
    },
    
    // Robots
    robots: props.noIndex ? {
      index: false,
      follow: false
    } : seoConfig.robots,
    
    // Canonical URL
    alternates: {
      canonical: url
    },
    
    // Additional meta tags
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'theme-color': '#059669', // Emerald-600
      'msapplication-TileColor': '#059669'
    }
  }
}

export function generateStructuredData(type: 'organization' | 'service' | 'faq' | 'breadcrumb', data?: any) {
  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        ...seoConfig.organization
      }
    
    case 'service':
      return {
        '@context': 'https://schema.org',
        ...seoConfig.service
      }
    
    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seoConfig.faqData.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    
    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        })) || []
      }
    
    default:
      return null
  }
}

export function generateBreadcrumbData(path: string) {
  const pathSegments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { name: 'Home', url: seoConfig.siteUrl }
  ]
  
  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    breadcrumbs.push({
      name,
      url: `${seoConfig.siteUrl}${currentPath}`
    })
  })
  
  return breadcrumbs
}

export function getCanonicalUrl(path: string) {
  return `${seoConfig.siteUrl}${path}`
}

// SEO-friendly URL generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Meta tag validation
export function validateMetaTags(metadata: Metadata): string[] {
  const issues: string[] = []
  
  if (!metadata.title) {
    issues.push('Missing title tag')
  } else if (typeof metadata.title === 'string' && metadata.title.length > 60) {
    issues.push('Title tag too long (should be under 60 characters)')
  }
  
  if (!metadata.description) {
    issues.push('Missing meta description')
  } else if (typeof metadata.description === 'string') {
    if (metadata.description.length < 120) {
      issues.push('Meta description too short (should be 120-160 characters)')
    } else if (metadata.description.length > 160) {
      issues.push('Meta description too long (should be 120-160 characters)')
    }
  }
  
  return issues
}
