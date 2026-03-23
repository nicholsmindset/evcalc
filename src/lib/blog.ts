import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string | null;
  readingTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'EV Range Calculator Team',
      category: data.category || 'General',
      tags: data.tags || [],
      image: data.image || null,
      readingTime: estimateReadingTime(content),
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'EV Range Calculator Team',
    category: data.category || 'General',
    tags: data.tags || [],
    image: data.image || null,
    readingTime: estimateReadingTime(content),
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  return Array.from(new Set(posts.map((p) => p.category)));
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPostMeta[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return getAllPosts().filter((p) => p.slug !== currentSlug).slice(0, limit);

  const all = getAllPosts().filter((p) => p.slug !== currentSlug);

  // Score by matching tags and category
  const scored = all.map((post) => {
    let score = 0;
    if (post.category === current.category) score += 3;
    for (const tag of post.tags) {
      if (current.tags.includes(tag)) score += 1;
    }
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}
