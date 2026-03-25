import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Credit Cards for EV Charging 2025 — Maximize Your Rewards',
  description:
    'Compare the top credit cards that earn rewards on EV charging, electricity bills, and gas stations. See which card pays back the most on your monthly charging spend.',
  alternates: { canonical: '/best-credit-card-ev-charging' },
  openGraph: {
    title: 'Best Credit Cards for EV Charging 2025',
    description:
      'The top credit cards for EV owners — highest rewards on charging stations, electric bills, and related spend. Find the card that pays you back the most.',
    url: '/best-credit-card-ev-charging',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Best Credit Cards for EV Charging 2025',
      description:
        'A comparison of the best credit cards for EV owners, focusing on reward rates for EV charging, electricity, and related categories.',
      url: 'https://evrangetools.com/best-credit-card-ev-charging',
      datePublished: '2025-01-01',
      dateModified: '2026-03-01',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Best Credit Cards for EV Charging', item: 'https://evrangetools.com/best-credit-card-ev-charging' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which credit card is best for EV charging?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For pure charging rewards, the Blue Cash Preferred from Amex (6% on US streaming/transit, 3% on gas) or Citi Custom Cash (5% on top spend category, including EV charging) are top picks. If you want flat-rate simplicity, the Citi Double Cash (2% on everything) is the easiest choice. For Tesla owners specifically, the Tesla Visa earns 3% at Tesla charging stations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do credit cards count EV charging as "gas" for rewards?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on the network and card issuer. Tesla Superchargers typically code as "service stations" (MCC 5541), which most gas category cards count as a gas purchase. ChargePoint, EVgo, and Electrify America may code differently — often as "electric vehicle charging" (MCC 5552), which not all cards categorize as gas. Cards that earn on "utilities" or "transit" are a safer bet for any charging network.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much can I earn with a rewards card on EV charging?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'At $80/month charging spend (average US EV owner), a 5% card earns $48/year vs $19.20 with a 2% flat card. The difference grows with higher-mile driving. Premium cards with annual fees are usually worth it above $6,000/year in relevant spend.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the annual fee worth it for an EV rewards card?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use this simple test: (reward rate difference × annual spend in category) > annual fee. Example: Amex Blue Cash Preferred ($95 fee) earns 3% on gas vs 1% on a free card. On $3,200/year in gas/charging spend, you earn $96 extra — worth it. The sign-up bonus often offsets the first year\'s fee entirely.',
          },
        },
      ],
    },
  ],
};

// Card data
const CARDS = [
  {
    rank: 1,
    name: 'Citi Custom Cash℠ Card',
    badge: 'Best for EV Charging',
    badgeColor: 'bg-accent/15 text-accent',
    annualFee: 0,
    evChargingRate: '5%',
    otherRates: '1% on all other purchases',
    signupBonus: '$200 cash back after $1,500 spend in first 6 months',
    keyPerk: '5% automatically on your top spend category each month (up to $500/mo). EV charging often qualifies.',
    pros: [
      'No annual fee',
      '5% on top category — charges automatically',
      'Includes EV charging as eligible category',
      '$200 sign-up bonus',
    ],
    cons: [
      'Capped at $500/mo in 5% category',
      'Only one 5% category per month',
    ],
    bestFor: 'Light-to-moderate EV drivers who want set-it-and-forget-it rewards',
    affiliate: true,
  },
  {
    rank: 2,
    name: 'Blue Cash Preferred® Card from American Express',
    badge: 'Best for Daily Drivers',
    badgeColor: 'bg-info/15 text-info',
    annualFee: 95,
    evChargingRate: '3%',
    otherRates: '6% at US supermarkets (up to $6k/yr), 6% on select US streaming, 1% elsewhere',
    signupBonus: '$250 statement credit after $3,000 spend in first 6 months',
    keyPerk: '3% on transit (including EV charging at many networks) + best grocery rewards in any wallet.',
    pros: [
      '3% on transit category includes most public charging',
      '6% on groceries pays for the annual fee on its own',
      '$250 welcome bonus',
      'Apple Pay / Google Pay eligible',
    ],
    cons: [
      '$95 annual fee (waived first year)',
      'Amex not accepted everywhere',
      'Transit MCC coverage varies by charger',
    ],
    bestFor: 'EV owners who also do their own grocery shopping',
    affiliate: true,
  },
  {
    rank: 3,
    name: 'Ford Power Promise Visa® Card',
    badge: 'Best for Ford EV Owners',
    badgeColor: 'bg-blue-500/15 text-blue-400',
    annualFee: 0,
    evChargingRate: '3%',
    otherRates: '2% on Ford purchases, 1% everywhere else',
    signupBonus: '10,000 FordPass points after first purchase',
    keyPerk: 'Earns on Ford BlueCruise, parts, and service. Free home charging installation credit.',
    pros: [
      'No annual fee',
      '3% on EV charging (explicit category)',
      'Ford-specific perks',
      'Free Charge Assist installation credit',
    ],
    cons: [
      'FordPass points less flexible than cash back',
      'Not useful if you don\'t own a Ford EV',
    ],
    bestFor: 'Ford F-150 Lightning, Mustang Mach-E, and E-Transit owners',
    affiliate: false,
  },
  {
    rank: 4,
    name: 'Tesla Visa® Card',
    badge: 'Best for Tesla Owners',
    badgeColor: 'bg-red-500/15 text-red-400',
    annualFee: 0,
    evChargingRate: '3%',
    otherRates: '2% at restaurants and Tesla stores, 1% elsewhere',
    signupBonus: '10,000 Tesla credits after $1,000 spend',
    keyPerk: '3% at Tesla charging (Supercharger + Destination) credited to your Tesla account for future charging.',
    pros: [
      'No annual fee',
      '3% specifically at Tesla charging',
      'Credits apply directly to Tesla account',
      'Seamless integration with Tesla app',
    ],
    cons: [
      'Credits only usable at Tesla — no cash out',
      'Only useful for Tesla vehicles',
      '1% on non-Tesla categories',
    ],
    bestFor: 'Heavy Tesla Supercharger users who want rewards that offset charging costs',
    affiliate: false,
  },
  {
    rank: 5,
    name: 'Citi Double Cash® Card',
    badge: 'Best Flat-Rate Option',
    badgeColor: 'bg-warning/15 text-warning',
    annualFee: 0,
    evChargingRate: '2%',
    otherRates: '2% on everything (1% when you buy + 1% when you pay)',
    signupBonus: '$200 cash back after $1,500 spend in first 6 months',
    keyPerk: 'Simplest possible rewards — 2% on every single purchase with no category tracking.',
    pros: [
      'No annual fee',
      '2% on everything including charging',
      'No category tracking needed',
      '$200 bonus',
    ],
    cons: [
      'Lower rate than category cards for charging',
      'No elevated rewards anywhere',
    ],
    bestFor: 'EV owners who want simplicity and hate tracking categories',
    affiliate: true,
  },
  {
    rank: 6,
    name: 'Chase Freedom Flex℠',
    badge: 'Best for Rotating Bonuses',
    badgeColor: 'bg-purple-500/15 text-purple-400',
    annualFee: 0,
    evChargingRate: '5% (when EV charging is a quarterly bonus category)',
    otherRates: '5% on travel via Chase, 3% on dining and drugstores, 1% elsewhere',
    signupBonus: '$200 bonus after $500 spend in first 3 months',
    keyPerk: 'Chase occasionally includes EV charging in its quarterly 5% rotating categories (up to $1,500/quarter).',
    pros: [
      'No annual fee',
      'Up to 5% on EV charging in bonus quarters',
      'Strong all-around rewards card',
      '$200 bonus for easy minimum spend',
    ],
    cons: [
      'Charging bonus not guaranteed every quarter',
      'Requires checking categories quarterly',
      'Need to activate bonus categories',
    ],
    bestFor: 'Chase ecosystem users willing to optimize quarterly categories',
    affiliate: true,
  },
];

// Annual earnings calculator data
const SPEND_LEVELS = [40, 80, 120, 200];

function calcEarnings(rate: string, monthlySpend: number): number {
  const r = parseFloat(rate.replace('%', '')) / 100;
  return Math.round(monthlySpend * 12 * r);
}

export default function BestCreditCardEvChargingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Best Credit Cards for EV Charging</span>
        </nav>

        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">Updated March 2026</span>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Best Credit Cards for EV Charging 2025–2026
        </h1>
        <p className="mt-3 text-text-secondary">
          The right credit card can earn $50–$200+ per year on your EV charging spend.
          We compared reward rates, annual fees, and EV-specific perks across every major card.
        </p>

        <p className="mt-3 text-xs text-text-tertiary">
          <em>Advertiser disclosure: Some links below are affiliate links. We may earn a commission
          at no cost to you. This does not affect our recommendations — cards are ranked by objective criteria.</em>
        </p>

        {/* Annual Earnings Table */}
        <section className="my-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            How Much Can You Earn? (Annual Charging Rewards)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3">Card</th>
                  <th className="px-4 py-3">Rate</th>
                  {SPEND_LEVELS.map((s) => (
                    <th key={s} className="px-4 py-3">${s}/mo</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CARDS.map((card, i) => (
                  <tr key={card.name} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg-secondary/50'}`}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-text-primary">{card.name.split('®')[0].split('℠')[0]}</span>
                      {card.annualFee > 0 && (
                        <span className="ml-1 text-xs text-text-tertiary">(${card.annualFee}/yr fee)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-accent">{card.evChargingRate}</td>
                    {SPEND_LEVELS.map((s) => {
                      const gross = calcEarnings(card.evChargingRate.split(' ')[0], s);
                      const net = gross - card.annualFee;
                      return (
                        <td key={s} className="px-4 py-3 text-text-primary">
                          ${gross}
                          {card.annualFee > 0 && (
                            <span className={`ml-1 text-xs ${net > 0 ? 'text-success' : 'text-error'}`}>
                              (${net} net)
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            Annual gross earnings on charging spend only. &quot;Net&quot; subtracts annual fee. Excludes sign-up bonuses and rewards on other categories.
          </p>
        </section>

        {/* Card Reviews */}
        <section className="space-y-8">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Full Reviews — Best EV Charging Credit Cards
          </h2>

          {CARDS.map((card) => (
            <div key={card.name} className="rounded-xl border border-border bg-bg-secondary p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-text-tertiary">#{card.rank}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${card.badgeColor}`}>{card.badge}</span>
                    {card.annualFee === 0 && (
                      <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">No Annual Fee</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary">{card.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-accent">{card.evChargingRate}</div>
                  <div className="text-xs text-text-tertiary">on EV charging</div>
                </div>
              </div>

              {/* Key stats */}
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-bg-tertiary p-3">
                  <div className="text-xs text-text-tertiary">Annual Fee</div>
                  <div className="mt-0.5 font-semibold text-text-primary">
                    {card.annualFee === 0 ? 'Free' : `$${card.annualFee}/yr`}
                  </div>
                </div>
                <div className="rounded-lg bg-bg-tertiary p-3">
                  <div className="text-xs text-text-tertiary">Sign-up Bonus</div>
                  <div className="mt-0.5 text-sm font-semibold text-text-primary">{card.signupBonus.split(' after')[0]}</div>
                </div>
                <div className="col-span-2 rounded-lg bg-bg-tertiary p-3 sm:col-span-1">
                  <div className="text-xs text-text-tertiary">Other Rates</div>
                  <div className="mt-0.5 text-xs text-text-secondary">{card.otherRates}</div>
                </div>
              </div>

              <p className="mb-4 text-sm text-text-secondary">{card.keyPerk}</p>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Pros</h4>
                  <ul className="space-y-1">
                    {card.pros.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-0.5 text-success">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-error">Cons</h4>
                  <ul className="space-y-1">
                    {card.cons.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-0.5 text-error">✗</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-bg-tertiary px-4 py-3">
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">Best for: </span>{card.bestFor}
                </span>
                {card.affiliate && (
                  <a
                    href="#"
                    rel="sponsored noopener noreferrer"
                    className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg-primary hover:bg-accent-dim transition-colors"
                  >
                    Apply →
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Tips */}
        <section className="my-10">
          <h2 className="mb-5 font-display text-xl font-bold text-text-primary">
            Tips for Maximizing EV Charging Rewards
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Verify charging MCC before applying',
                body: "Before you apply for a card expecting 5% on charging, check which Merchant Category Code (MCC) your most-used network uses. Tesla Supercharger = 5541 (gas), ChargePoint = 5552 (EV charging), Electrify America = 5552. Not all cards map both MCCs to the 'gas' or 'transit' category.",
              },
              {
                title: "Stack with utility rebates — don't double-count",
                body: 'Your utility may offer a rebate on home charging. This reduces your net charging cost but not your credit card statement, so you still earn rewards on the full amount billed. Check your utility\'s rebates at our Utility Rebates tool.',
              },
              {
                title: 'Use the sign-up bonus strategically',
                body: 'A $200–$250 sign-up bonus after $1,500–$3,000 spend is often worth more than a full year of charging rewards. Time your application before a large purchase (charger installation, vehicle accessories) to hit the minimum spend easily.',
              },
              {
                title: 'Track home electricity separately',
                body: 'If you charge mostly at home, your EV use is bundled into your electricity bill. Some cards with utility bill rewards (like certain Amex cards) earn on electric payments — run the numbers on whether a utility category card outperforms a charging-specific one.',
              },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg border border-border bg-bg-secondary p-4">
                <h3 className="mb-1 font-semibold text-text-primary">{tip.title}</h3>
                <p className="text-sm text-text-secondary">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border pt-8">
          <h2 className="mb-6 font-display text-xl font-bold text-text-primary">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {(jsonLd['@graph'][2] as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }).mainEntity.map((q) => (
              <div key={q.name}>
                <h3 className="mb-2 font-semibold text-text-primary">{q.name}</h3>
                <p className="text-sm text-text-secondary">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/ev-rebates" className="text-sm text-accent hover:underline">Utility Rebates</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/charging-schedule" className="text-sm text-accent hover:underline">Charging Schedule Optimizer</Link>
          </div>
        </section>
      </div>
    </>
  );
}
