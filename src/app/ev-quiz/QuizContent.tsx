'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// ─── Question definitions ──────────────────────────────────────────────────

interface QuizOption {
  label: string;
  value: string;
  scores: Partial<Record<Dimension, number>>;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

type Dimension = 'readiness' | 'financial' | 'charging' | 'range' | 'environmental';

const DIMENSION_LABELS: Record<Dimension, string> = {
  readiness: 'EV Readiness',
  financial: 'Financial Fit',
  charging: 'Charging Access',
  range: 'Range Confidence',
  environmental: 'Eco Impact',
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'commute',
    question: 'What is your typical daily driving distance?',
    subtitle: 'This determines whether EV range meets your needs.',
    options: [
      { label: 'Under 30 miles', value: 'short', scores: { readiness: 5, range: 5 } },
      { label: '30–60 miles', value: 'medium', scores: { readiness: 4, range: 4 } },
      { label: '60–100 miles', value: 'long', scores: { readiness: 3, range: 3 } },
      { label: 'Over 100 miles', value: 'verylong', scores: { readiness: 2, range: 2 } },
    ],
  },
  {
    id: 'road_trips',
    question: 'How often do you take long road trips (100+ miles)?',
    subtitle: 'Frequent long trips require more charging stops with an EV.',
    options: [
      { label: 'Rarely or never', value: 'never', scores: { range: 5, readiness: 5 } },
      { label: 'A few times per year', value: 'occasional', scores: { range: 4, readiness: 4 } },
      { label: 'Monthly', value: 'monthly', scores: { range: 3, readiness: 3 } },
      { label: 'Weekly or more', value: 'weekly', scores: { range: 1, readiness: 2 } },
    ],
  },
  {
    id: 'parking',
    question: 'Where do you typically park your vehicle overnight?',
    options: [
      { label: 'Private garage at home', value: 'private_garage', scores: { charging: 5, readiness: 5 } },
      { label: 'Driveway or carport', value: 'driveway', scores: { charging: 4, readiness: 4 } },
      { label: 'Shared parking with outlet access', value: 'shared_outlet', scores: { charging: 3, readiness: 3 } },
      { label: 'Street parking / no outlet', value: 'street', scores: { charging: 1, readiness: 2 } },
    ],
  },
  {
    id: 'charging_240v',
    question: 'Do you have (or could you install) a 240V outlet in your parking space?',
    subtitle: '240V / NEMA 14-50 is needed for Level 2 home charging.',
    options: [
      { label: 'Yes, already have one', value: 'yes_have', scores: { charging: 5 } },
      { label: 'No, but I could install one', value: 'could_install', scores: { charging: 4 } },
      { label: 'Maybe — would need to check', value: 'maybe', scores: { charging: 3 } },
      { label: 'No, not possible (renting, condo, etc.)', value: 'no', scores: { charging: 1 } },
    ],
  },
  {
    id: 'budget',
    question: 'What is your vehicle budget?',
    options: [
      { label: 'Under $35,000', value: 'low', scores: { financial: 3, readiness: 3 } },
      { label: '$35,000 – $55,000', value: 'mid', scores: { financial: 5, readiness: 5 } },
      { label: '$55,000 – $80,000', value: 'high', scores: { financial: 5, readiness: 5 } },
      { label: 'Over $80,000', value: 'premium', scores: { financial: 4, readiness: 5 } },
    ],
  },
  {
    id: 'vehicle_type',
    question: 'What type of vehicle are you looking for?',
    options: [
      { label: 'Sedan or compact car', value: 'sedan', scores: { financial: 5 } },
      { label: 'SUV or crossover', value: 'suv', scores: { financial: 4 } },
      { label: 'Truck or van', value: 'truck', scores: { financial: 3, range: 2 } },
      { label: 'Sports car or performance', value: 'sports', scores: { financial: 4 } },
    ],
  },
  {
    id: 'passengers',
    question: 'How many passengers do you regularly carry?',
    options: [
      { label: 'Just me (or 1–2 people)', value: 'solo', scores: { readiness: 5 } },
      { label: '3–4 people (family car)', value: 'family', scores: { readiness: 4 } },
      { label: '5–7 people (3-row SUV)', value: 'large', scores: { readiness: 3 } },
      { label: '8+ people (van/minibus)', value: 'van', scores: { readiness: 2 } },
    ],
  },
  {
    id: 'climate',
    question: 'What is the typical winter temperature where you live?',
    subtitle: 'Cold weather can reduce EV range by 20–40%.',
    options: [
      { label: 'Mild (rarely below 40°F)', value: 'mild', scores: { range: 5, readiness: 5 } },
      { label: 'Cold (20–40°F winters)', value: 'cold', scores: { range: 3, readiness: 4 } },
      { label: 'Very cold (below 20°F)', value: 'verycold', scores: { range: 2, readiness: 3 } },
      { label: 'Hot (rarely freezes)', value: 'hot', scores: { range: 4, readiness: 5 } },
    ],
  },
  {
    id: 'state',
    question: 'What US state are you in?',
    subtitle: 'State incentives can save you $2,000–$7,500 on top of the federal credit.',
    options: [
      { label: 'California, Colorado, or New York', value: 'high_incentive', scores: { financial: 5, environmental: 5 } },
      { label: 'Washington, Oregon, or Massachusetts', value: 'good_incentive', scores: { financial: 4, environmental: 5 } },
      { label: 'Another state with EV incentives', value: 'some_incentive', scores: { financial: 4, environmental: 4 } },
      { label: 'No major state EV incentive', value: 'no_incentive', scores: { financial: 3, environmental: 3 } },
    ],
  },
  {
    id: 'priorities',
    question: 'What matters most to you in a vehicle?',
    options: [
      { label: 'Saving money on fuel and maintenance', value: 'savings', scores: { financial: 5, environmental: 4, readiness: 5 } },
      { label: 'Environmental impact / lower emissions', value: 'eco', scores: { environmental: 5, readiness: 4 } },
      { label: 'Technology and performance', value: 'tech', scores: { readiness: 5 } },
      { label: 'Convenience and reliability', value: 'convenience', scores: { charging: 4, readiness: 4 } },
    ],
  },
];

// ─── Scoring logic ─────────────────────────────────────────────────────────

function computeScores(answers: Record<string, string>): Record<Dimension, number> {
  const sums: Record<Dimension, number> = { readiness: 0, financial: 0, charging: 0, range: 0, environmental: 0 };
  const counts: Record<Dimension, number> = { readiness: 0, financial: 0, charging: 0, range: 0, environmental: 0 };

  for (const q of QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;
    const option = q.options.find((o) => o.value === answer);
    if (!option) continue;
    for (const [dim, score] of Object.entries(option.scores) as [Dimension, number][]) {
      sums[dim] += score;
      counts[dim]++;
    }
  }

  const result: Record<Dimension, number> = {} as Record<Dimension, number>;
  for (const dim of Object.keys(sums) as Dimension[]) {
    result[dim] = counts[dim] > 0 ? Math.round((sums[dim] / counts[dim]) * 20) : 60;
  }
  return result;
}

function getOverallScore(scores: Record<Dimension, number>): number {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function getVerdict(score: number): { label: string; color: string; description: string } {
  if (score >= 80) return { label: 'EV Ready', color: 'text-green-400', description: 'An EV fits your lifestyle perfectly. You\'ll save money and reduce your environmental impact from day one.' };
  if (score >= 65) return { label: 'Good Fit', color: 'text-accent', description: 'An EV would work well for you with minor adjustments. Consider your charging setup and any long-trip planning.' };
  if (score >= 50) return { label: 'Worth Considering', color: 'text-yellow-400', description: 'An EV could work for you, but there are trade-offs to evaluate — especially charging access and range.' };
  return { label: 'Check Alternatives', color: 'text-orange-400', description: 'An EV may not be the best fit right now. A PHEV (plug-in hybrid) might bridge the gap.' };
}

// ─── EV Recommendations ────────────────────────────────────────────────────

interface EVRecommendation {
  make: string;
  model: string;
  range_mi: number;
  msrp: number;
  slug: string;
  why: string;
  best_for: string[];
}

const EV_RECS: EVRecommendation[] = [
  { make: 'Tesla', model: 'Model 3 Long Range', range_mi: 341, msrp: 42990, slug: 'tesla-model-3-long-range-2024', why: 'Best overall value, massive charging network, top-rated software.', best_for: ['tech', 'savings', 'sedan'] },
  { make: 'Chevrolet', model: 'Equinox EV', range_mi: 319, msrp: 34995, slug: 'chevrolet-equinox-ev-2024', why: 'Under $35k before tax credit, qualifies for full $7,500 federal credit, SUV practicality.', best_for: ['savings', 'suv', 'low'] },
  { make: 'Ford', model: 'Mustang Mach-E', range_mi: 312, msrp: 42995, slug: 'ford-mustang-mach-e-2024', why: 'Best blend of range, style, and practicality for family SUV buyers.', best_for: ['suv', 'family', 'tech'] },
  { make: 'Hyundai', model: 'Ioniq 6', range_mi: 361, msrp: 38615, slug: 'hyundai-ioniq-6-2024', why: 'Best range in its price class, ultra-fast 800V charging, futuristic design.', best_for: ['range', 'savings', 'sedan'] },
  { make: 'Rivian', model: 'R1S', range_mi: 410, msrp: 75900, slug: 'rivian-r1s-2024', why: 'Best EV SUV for off-road, towing, and adventure-ready families.', best_for: ['suv', 'large', 'high', 'eco'] },
  { make: 'BMW', model: 'i4 M50', range_mi: 270, msrp: 72900, slug: 'bmw-i4-m50-2024', why: 'Best-in-class performance EV sedan with premium driving dynamics.', best_for: ['sports', 'tech', 'high'] },
];

function getRecommendations(answers: Record<string, string>, scores: Record<Dimension, number>): EVRecommendation[] {
  const budget = answers['budget'];
  const type = answers['vehicle_type'];
  const priority = answers['priorities'];

  const scored = EV_RECS.map((rec) => {
    let score = 0;
    if (type && rec.best_for.includes(type)) score += 3;
    if (budget && rec.best_for.includes(budget)) score += 2;
    if (priority && rec.best_for.includes(priority)) score += 2;
    if (scores.financial >= 80 && rec.msrp < 45000) score += 1;
    if (scores.range >= 80 && rec.range_mi > 300) score += 1;
    return { rec, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((s) => s.rec);
}

// ─── Share URL ─────────────────────────────────────────────────────────────

function encodeAnswers(answers: Record<string, string>): string {
  return btoa(JSON.stringify(answers)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeAnswers(encoded: string): Record<string, string> | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

// ─── Main component ────────────────────────────────────────────────────────

export default function QuizContent() {
  const [step, setStep] = useState(0); // 0 = intro, 1–10 = questions, 11 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');

  // Load from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('a');
    if (encoded) {
      const decoded = decodeAnswers(encoded);
      if (decoded) {
        setAnswers(decoded);
        setStep(QUESTIONS.length + 1);
      }
    }
  }, []);

  const currentQuestion = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;
  const isResults = step === QUESTIONS.length + 1;
  const progress = step === 0 ? 0 : Math.round((step / (QUESTIONS.length + 1)) * 100);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = useCallback(() => {
    if (!currentQuestion || !selectedOption) return;
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (step === QUESTIONS.length) {
      // Generate share URL
      if (typeof window !== 'undefined') {
        const encoded = encodeAnswers(newAnswers);
        setShareUrl(`${window.location.origin}/ev-quiz?a=${encoded}`);
      }
      setStep(QUESTIONS.length + 1);
    } else {
      setStep(step + 1);
    }
  }, [answers, currentQuestion, selectedOption, step]);

  const handleBack = () => {
    if (step <= 1) return;
    const prevQuestion = QUESTIONS[step - 2];
    setSelectedOption(answers[prevQuestion.id] ?? null);
    setStep(step - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setSelectedOption(null);
    setStep(0);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/ev-quiz');
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard && shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  // Compute scores on results screen
  const scores = isResults ? computeScores(answers) : null;
  const overallScore = scores ? getOverallScore(scores) : 0;
  const verdict = scores ? getVerdict(overallScore) : null;
  const recommendations = scores ? getRecommendations(answers, scores) : [];

  const radarData = scores
    ? Object.entries(DIMENSION_LABELS).map(([key, label]) => ({
        subject: label,
        score: scores[key as Dimension],
      }))
    : [];

  // ─── Intro screen ──────────────────────────────────────────────────────

  if (step === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-accent/10">
          <span className="text-4xl">⚡</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-text-primary">Is an EV Right for You?</h2>
        <p className="mt-3 text-text-secondary">
          Answer 10 quick questions and get a personalized EV readiness score, radar chart,
          and 3 vehicle recommendations matched to your lifestyle.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-text-secondary">
          {['10 questions', '~2 minutes', 'Personalized results', 'Shareable score'].map((item) => (
            <span key={item} className="rounded-full border border-border px-3 py-1">{item}</span>
          ))}
        </div>
        <button
          onClick={() => setStep(1)}
          className="mt-8 w-full rounded-xl bg-accent px-6 py-4 font-semibold text-bg-primary transition-all hover:bg-accent-dim"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  // ─── Question screen ───────────────────────────────────────────────────

  if (currentQuestion && !isResults) {
    return (
      <div className="mx-auto max-w-xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-text-tertiary">
            <span>Question {step} of {QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="mb-1 font-display text-xl font-bold text-text-primary">
          {currentQuestion.question}
        </h2>
        {currentQuestion.subtitle && (
          <p className="mb-5 text-sm text-text-secondary">{currentQuestion.subtitle}</p>
        )}

        {/* Options */}
        <div className="mt-5 space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full rounded-xl border px-5 py-4 text-left transition-all ${
                selectedOption === option.value
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/40 hover:bg-bg-tertiary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border border-border px-4 py-3 text-sm text-text-secondary hover:border-accent/30 hover:text-text-primary"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === QUESTIONS.length ? 'See My Results →' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Results screen ────────────────────────────────────────────────────

  if (isResults && scores && verdict) {
    return (
      <div className="mx-auto max-w-3xl">
        {/* Score header */}
        <div className="mb-8 rounded-2xl border border-border bg-bg-secondary p-6 text-center">
          <div className={`font-display text-6xl font-bold ${verdict.color}`}>
            {overallScore}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            EV Readiness Score
          </div>
          <div className={`mt-2 font-display text-2xl font-bold ${verdict.color}`}>
            {verdict.label}
          </div>
          <p className="mt-2 max-w-sm mx-auto text-sm text-text-secondary">
            {verdict.description}
          </p>

          {/* Share */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handleShare}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent"
            >
              Copy Shareable Link
            </button>
            <button
              onClick={handleRestart}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent"
            >
              Retake Quiz
            </button>
          </div>
        </div>

        {/* Radar chart */}
        <div className="mb-8 rounded-2xl border border-border bg-bg-secondary p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-text-primary">Your EV Profile</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a3e" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8888a0', fontSize: 11 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#00e676"
                  fill="#00e676"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 8 }}
                  labelStyle={{ color: '#f0f0f5' }}
                  formatter={(value) => [`${value}/100`, '']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => {
              const score = scores[key as Dimension];
              const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-accent' : score >= 40 ? 'text-yellow-400' : 'text-orange-400';
              return (
                <div key={key} className="rounded-lg bg-bg-tertiary px-3 py-2 text-center">
                  <div className={`font-mono text-lg font-bold ${color}`}>{score}</div>
                  <div className="text-xs text-text-tertiary">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EV Recommendations */}
        <div className="mb-8">
          <h3 className="mb-4 font-display text-xl font-bold text-text-primary">
            Your Top EV Matches
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {recommendations.map((rec, i) => (
              <Link
                key={rec.slug}
                href={`/vehicles/${rec.slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-xs text-accent font-semibold">
                    {i === 0 ? 'Best Match' : i === 1 ? 'Runner Up' : 'Also Consider'}
                  </span>
                </div>
                <div className="font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                  {rec.make} {rec.model}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
                  <span className="font-mono text-accent">{rec.range_mi} mi</span>
                  <span>${(rec.msrp / 1000).toFixed(0)}k</span>
                </div>
                <p className="mt-2 text-xs text-text-secondary">{rec.why}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Annual savings estimate */}
        <div className="mb-8 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <h3 className="mb-2 font-semibold text-text-primary">Estimated Annual Savings vs Gas</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Fuel Savings', value: '~$1,200', desc: '15k mi/yr at $0.14/kWh vs $3.50/gal' },
              { label: 'Maintenance', value: '~$600', desc: 'No oil changes, fewer brake replacements' },
              { label: 'Tax Credits', value: 'Up to $7,500', desc: 'Federal credit if you qualify' },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-display text-xl font-bold text-accent">{item.value}</div>
                <div className="text-xs font-semibold text-text-primary">{item.label}</div>
                <div className="mt-0.5 text-xs text-text-tertiary">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-text-primary">Your Next Steps</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/tax-credit-checker', label: 'Check Your Tax Credit Eligibility', desc: 'See if you qualify for the $7,500 federal EV credit' },
              { href: '/ev-incentives', label: 'Find State Incentives', desc: 'Many states offer additional $1,000–$5,000 in savings' },
              { href: '/charger-installation-cost', label: 'Calculate Charger Cost', desc: 'Get a home charging installation estimate' },
              { href: '/tco-calculator', label: 'Total Cost of Ownership', desc: 'Calculate 5-year cost vs. your current gas car' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30"
              >
                <span className="mt-0.5 text-accent group-hover:scale-110 transition-transform">→</span>
                <div>
                  <div className="font-medium text-text-primary group-hover:text-accent transition-colors">{item.label}</div>
                  <div className="text-xs text-text-tertiary">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
