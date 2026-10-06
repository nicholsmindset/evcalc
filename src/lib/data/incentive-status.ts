/** Preserve historical records while keeping expired programs out of active lists. */
export function normalizeIncentives<T extends {
  state_code: string;
  incentive_name: string;
  funding_status: string;
  expiration_date: string | null;
  last_verified: string;
}>(rows: T[], today = new Date().toISOString().slice(0, 10)): T[] {
  const unique = new Map<string, T>();
  for (const row of rows) {
    const closedCVRP = row.state_code === 'CA' && row.incentive_name === 'Clean Vehicle Rebate Project (CVRP)';
    const expired = closedCVRP || !!(row.expiration_date && row.expiration_date < today);
    const normalized = { ...row, funding_status: expired ? 'expired' : row.funding_status };
    const key = `${row.state_code}:${row.incentive_name}`;
    const previous = unique.get(key);
    if (!previous || row.last_verified > previous.last_verified) unique.set(key, normalized);
  }
  return Array.from(unique.values());
}
