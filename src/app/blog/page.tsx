import Link from 'next/link';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Blog — Range Tips, Charging Guides & EV News',
  description: 'Expert articles on EV range optimization, charging strategies, battery health, road trip planning, and cost analysis. Data-driven guides for EV owners.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'EV Blog — Range Tips, Charging Guides & EV News',
    description: 'Expert articles on EV range optimization, charging strategies, battery health, road trip planning, and cost analysis.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Blog
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Data-driven articles on EV range, charging, battery health, and cost savings.
          Everything you need to get the most from your electric vehicle.
        </p>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
            All ({posts.length})
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-bg-tertiary px-3 py-1.5 text-xs text-text-secondary"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                  {post.category}
                </span>
                <span>{post.readingTime} min read</span>
              </div>
              <h2 className={`mt-3 font-display font-bold text-text-primary group-hover:text-accent transition-colors ${
                index === 0 ? 'text-xl sm:text-2xl' : 'text-lg'
              }`}>
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <time className="text-xs text-text-tertiary">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <span className="text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Read more &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">No posts yet</p>
          <p className="mt-2 text-sm text-text-tertiary">Check back soon for EV guides and tips.</p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          About Our EV Blog
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            Our blog covers everything EV owners and prospective buyers need to know — from
            maximizing range in cold weather to understanding the true cost of EV ownership.
            Every article is backed by data from EPA testing, manufacturer specifications,
            and real-world reports from our community.
          </p>
          <p>
            Popular topics include{' '}
            <Link href="/blog/how-temperature-affects-ev-range" className="text-accent hover:underline">
              temperature effects on range
            </Link>,{' '}
            <Link href="/blog/ev-range-anxiety-myths" className="text-accent hover:underline">
              range anxiety myths
            </Link>, and{' '}
            <Link href="/blog/ev-vs-gas-true-cost" className="text-accent hover:underline">
              EV vs gas cost comparison
            </Link>.
          </p>
        </div>
      </section>

      {/* Tool Links */}
      <section className="mt-12 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">EV Tools</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Calculator</Link>
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Charging Station Finder</Link>
          <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs</Link>
        </div>
      </section>
    </div>
  );
}
