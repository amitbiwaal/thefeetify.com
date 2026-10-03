import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// AI / LLM crawlers are welcomed explicitly (see also /llms.txt). A crawler that has its
// own group ignores the "*" group, so the private paths are repeated for each one.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
]

const PRIVATE_PATHS = ['/admin', '/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
