import { SchemaMarkup } from './SchemaMarkup';
import { generateFAQSchema } from '@/lib/utils/seo';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions' }: FAQSectionProps) {
  const schema = generateFAQSchema(faqs);

  return (
    <section className="py-12">
      <SchemaMarkup schema={schema} />
      <h2 className="text-2xl font-display font-bold text-text-primary mb-8">
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-bg-secondary overflow-hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-text-primary font-medium hover:bg-bg-tertiary transition-colors">
              <span>{faq.question}</span>
              <svg
                className="h-5 w-5 text-text-secondary transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-text-secondary leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
