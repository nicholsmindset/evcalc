import Link from 'next/link';

interface SidebarLink {
  label: string;
  href: string;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

interface SidebarProps {
  sections?: SidebarSection[];
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    title: 'Popular Tools',
    links: [
      { label: 'Range Calculator', href: '/calculator' },
      { label: 'Compare EVs', href: '/compare' },
      { label: 'Charging Stations', href: '/charging-stations' },
      { label: 'Charging Cost Calculator', href: '/charging-cost-calculator' },
      { label: 'EV vs Gas Savings', href: '/ev-vs-gas' },
      { label: 'Road Trip Planner', href: '/road-trip-planner' },
    ],
  },
  {
    title: 'Popular EVs',
    links: [
      { label: 'Tesla Model 3', href: '/vehicles/tesla-model-3-long-range-2024' },
      { label: 'Tesla Model Y', href: '/vehicles/tesla-model-y-long-range-2024' },
      { label: 'Hyundai Ioniq 5', href: '/vehicles/hyundai-ioniq-5-long-range-2024' },
      { label: 'Kia EV6', href: '/vehicles/kia-ev6-light-long-range-2024' },
      { label: 'Ford Mustang Mach-E', href: '/vehicles/ford-mustang-mach-e-select-2024' },
      { label: 'Chevrolet Equinox EV', href: '/vehicles/chevrolet-equinox-ev-2lt-2024' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'AI Range Advisor', href: '/advisor' },
      { label: 'TCO Calculator', href: '/tco-calculator' },
      { label: 'Home Charger Guide', href: '/home-charger' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

export function Sidebar({ sections = DEFAULT_SECTIONS, className = '', children }: SidebarProps) {
  return (
    <aside
      className={`hidden w-72 shrink-0 lg:block ${className}`}
    >
      <div className="sticky top-24 space-y-6">
        {/* Ad slot placeholder */}
        <div
          className="flex h-[250px] w-[300px] items-center justify-center rounded-lg border text-xs"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-tertiary)',
          }}
        >
          Ad Space (300x250)
        </div>

        {/* Navigation sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <h3
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Custom children (additional widgets, etc.) */}
        {children}
      </div>
    </aside>
  );
}
