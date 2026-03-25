import Link from 'next/link';

export interface RelatedTool {
  href: string;
  label: string;
  desc: string;
  emoji?: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  heading?: string;
}

export function RelatedTools({ tools, heading = 'Try These Next' }: RelatedToolsProps) {
  return (
    <section className="border-t border-border mt-12 pt-10">
      <h2 className="font-display text-lg font-bold text-text-primary mb-5">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-3 rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/40 hover:bg-bg-tertiary"
          >
            {tool.emoji && (
              <span className="text-xl shrink-0 mt-0.5">{tool.emoji}</span>
            )}
            <div>
              <p className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors">
                {tool.label}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary leading-relaxed">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
