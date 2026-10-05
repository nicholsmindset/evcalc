const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
function loadTs(file) {
  const filename = path.resolve(file);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = new Module(filename, module); mod.filename = filename; mod.paths = module.paths;
  mod.require = specifier => {
    if (specifier === '@/lib/blog') return { getAllSlugs: () => [] };
    if (specifier.includes('/supabase/queries/')) return {};
    if (specifier.startsWith('@/')) return loadTs('src/' + specifier.slice(2) + '.ts');
    if (specifier.endsWith('.json')) return require(path.resolve(path.dirname(filename), specifier));
    return require(specifier);
  };
  mod._compile(output, filename); return mod.exports;
}
const { compareLeaseQuote } = loadTs('src/lib/calculations/lease-quote.ts');
const quote = { monthly: 400, months: 36, upfront: 3000, firstPaymentIncluded: true, endFees: 400, annualAllowance: 10000, annualMiles: 15000, excessRate: .25 };
const result = compareLeaseQuote(quote);
assert.equal(result.total, 21150);
assert.equal(result.effectiveMonthly, 587.5);
assert.equal(result.excessMiles, 15000);
assert.equal(result.remainingPayments, 35);
assert.equal(compareLeaseQuote({ ...quote, firstPaymentIncluded: false }).total, 21550);
assert.equal(compareLeaseQuote({ ...quote, annualMiles: 8000 }).mileageCost, 0);
assert.equal(compareLeaseQuote({ ...quote, months: 1, annualMiles: 10000 }).total, 3400);
assert.equal(compareLeaseQuote({ ...quote, upfront: 4000, monthly: 400 - 1000 / 35 }).total, result.total);
for (const invalid of [{ monthly: 0 }, { upfront: -1 }, { upfront: 399 }, { months: 0 }, { months: 36.5 }, { months: 121 }, { excessRate: NaN }, { annualMiles: Infinity }]) assert.equal(compareLeaseQuote({ ...quote, ...invalid }), null);
const reviews = require('../src/lib/data/vehicle-reviews.json');
const inputs = require('../src/lib/data/vehicle-review-inputs.json');
assert.equal(Object.keys(reviews).length, 32);
assert.deepEqual(Object.keys(reviews).sort(), Object.keys(inputs).sort());
for (const [slug, review] of Object.entries(reviews)) {
  assert(review.sources.length && review.variants.length, `${slug} source coverage`);
  for (const source of review.sources) assert(new URL(source.url).protocol === 'https:');
  if (inputs[slug]) {
    assert.equal(review.standard, 'EPA');
    const variant = review.variants[0];
    assert.equal(inputs[slug].epa_range_mi, variant.rangeMi);
    assert.equal(inputs[slug].epa_range_km, Math.round(variant.rangeMi * 1.609344));
    assert.equal(inputs[slug].efficiency_wh_per_km, Math.round(variant.consumption * 10 / 1.609344));
  }
}
assert.equal(inputs['jeep-recon-standard-range-2026'], null);
assert.equal(inputs['audi-q4-e-tron-premium-2025'], null);
assert.match(inputs['nissan-leaf-plus-2024'].connector_type, /CHAdeMO/);
assert.equal(inputs['hyundai-ioniq-5-limited-awd-2025'].epa_range_mi, 269);
assert.equal(inputs['hyundai-ioniq-6-se-long-range-rwd-2025'].epa_range_mi, 342);
assert.equal(reviews['vinfast-vf9-plus-extended-2025'].variants[0].rangeMi, 291);
const snapshot = require('../docs/data/epa-vehicle-reference-2026-10-05.json');
const records = Object.fromEntries(snapshot.records.map(r => [r.id, r]));
for (const review of Object.values(reviews)) for (const variant of review.variants) {
  const match = variant.source?.match(/noframes\/(\d+)\.shtml/);
  if (match) {
    assert.equal(variant.rangeMi, Number(records[match[1]].range));
    if (variant.consumption != null) assert.equal(variant.consumption, Number(records[match[1]].combE));
  }
}
console.log('PASS: lease totals, first-payment handling, mileage, invalid inputs, 32 review records and EPA unit conversions');

loadTs('src/lib/sitemap.ts').getSitemap('vehicles').then(entries => {
  const urls = new Map(entries.map(e => [e.url, e.lastModified]));
  assert.equal(urls.size, entries.length, 'No duplicate sitemap URLs');
  for (const slug of Object.keys(reviews)) assert.equal(urls.get(`https://www.evrangetools.com/vehicles/${slug}`), '2026-10-05');
  for (const slug of Object.keys(loadTs('src/lib/data/lease-page-reviews.ts').LEASE_PAGE_REVIEWS)) assert.equal(urls.get(`https://www.evrangetools.com/vehicles/${slug}/lease-deals`), '2026-10-05');
  console.log(`PASS: ${entries.length} sitemap URLs, all reviewed guides and five lease pages have stable update dates`);
}).catch(error => { console.error(error); process.exitCode = 1; });
