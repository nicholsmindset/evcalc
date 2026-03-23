'use client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent/10 text-text-primary'
            : 'border border-border bg-bg-secondary text-text-primary'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:text-text-primary prose-strong:text-text-primary prose-code:text-accent prose-code:bg-bg-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
          <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Simple markdown to HTML converter for assistant messages.
 * Handles: bold, italic, code, lists, paragraphs.
 */
function formatMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-bg-tertiary rounded-lg p-3 my-2 overflow-x-auto"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Wrap consecutive <li> in <ul>/<ol>
    .replace(/((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g, '<ul class="my-1">$1</ul>')
    .replace(/((?:<li class="ml-4 list-decimal">.*<\/li>\n?)+)/g, '<ol class="my-1">$1</ol>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="my-1">')
    // Single newlines to <br>
    .replace(/\n/g, '<br>')
    // Wrap in paragraph
    .replace(/^(.+)/, '<p class="my-1">$1</p>');
}
