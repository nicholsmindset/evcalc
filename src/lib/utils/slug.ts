/**
 * Generate a URL-friendly kebab-case slug from vehicle details.
 * Example: generateSlug("Tesla", "Model 3", 2025, "Long Range") => "tesla-model-3-long-range-2025"
 */
export function generateSlug(
  make: string,
  model: string,
  year: number,
  trim?: string,
): string {
  const parts = [make, model, ...(trim ? [trim] : []), String(year)];

  return parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
