'use client';

const QUESTIONS = [
  'How does cold weather affect my EV range?',
  'What speed should I drive to maximize range?',
  'How much does it cost to charge at home vs a fast charger?',
  'How do I plan a long road trip in an EV?',
  'Which EV has the best range for under $40K?',
  'How can I extend my EV battery lifespan?',
  'Is it bad to DC fast charge every day?',
  'Should I charge to 80% or 100%?',
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
