import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const GUIDES_DIR = path.join(process.cwd(), 'content/guides')

export interface GuideData {
  slug: string
  title: string
  description: string
  category?: string
  date?: string
  contentHtml: string
}

export interface GuideMeta {
  slug: string
  title: string
  description: string
  category?: string
  date?: string
}

export async function getAllGuides(): Promise<GuideMeta[]> {
  try {
    if (!fs.existsSync(GUIDES_DIR)) return []
    const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md'))

    return files.map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const fullPath = path.join(GUIDES_DIR, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ''),
        category: data.category ? String(data.category) : undefined,
        date: data.date ? String(data.date) : undefined,
      }
    })
  } catch {
    return []
  }
}

export async function getGuideBySlug(slug: string): Promise<GuideData | null> {
  try {
    const fullPath = path.join(GUIDES_DIR, `${slug}.md`)
    if (!fs.existsSync(fullPath)) return null

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const processedContent = await remark()
      .use(remarkHtml, { sanitize: false })
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ''),
      category: data.category ? String(data.category) : undefined,
      date: data.date ? String(data.date) : undefined,
      contentHtml,
    }
  } catch {
    return null
  }
}
