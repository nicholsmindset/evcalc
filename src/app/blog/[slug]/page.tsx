import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — EV Range Tools Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EV Range Tools',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.evrangetools.com/blog/${slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.evrangetools.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.evrangetools.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.evrangetools.com/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={[articleSchema, breadcrumbSchema]} />

      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-text-secondary truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {post.category}
          </span>
          <span className="text-text-tertiary">{post.readingTime} min read</span>
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          {post.description}
        </p>
        <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <span className="font-display text-sm font-bold text-accent">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{post.author}</p>
            <time className="text-xs text-text-tertiary">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-3
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-text-secondary prose-p:leading-relaxed
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:text-text-primary prose-strong:font-semibold
        prose-code:text-accent prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-bg-tertiary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
        prose-table:border-collapse
        prose-th:border prose-th:border-border prose-th:bg-bg-tertiary prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:text-text-primary prose-th:font-semibold
        prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-td:text-text-secondary
        prose-ul:text-text-secondary prose-ol:text-text-secondary
        prose-li:marker:text-accent
        prose-blockquote:border-accent prose-blockquote:text-text-secondary
        prose-hr:border-border
      ">
        <MDXRemote source={post.content} />
      </article>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-tertiary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Related Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
              >
                <span className="text-xs text-accent">{related.category}</span>
                <h3 className="mt-1 font-display font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <p className="mt-2 text-xs text-text-tertiary">
                  {related.readingTime} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
        <h2 className="font-display text-lg font-bold text-text-primary">
          Calculate Your EV&apos;s Real Range
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Use our free range calculator with the conditions from this article.
        </p>
        <Link
          href="/calculator"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
        >
          Try the Range Calculator
        </Link>
      </section>

      {/* Back to Blog */}
      <div className="mt-8">
        <Link
          href="/blog"
          className="text-sm text-text-tertiary hover:text-accent transition-colors"
        >
          &larr; Back to all articles
        </Link>
      </div>
    </div>
  );
}
