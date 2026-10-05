interface LeasePageReview { configuration: string; checks: string[]; sourceTitle: string; sourceUrl: string }
export const LEASE_PAGE_REVIEWS: Record<string, LeasePageReview> = {
  'tesla-model-y-performance-2025': {
    configuration: 'A 2025 Model Y Performance quote should identify the production version, wheels and vehicle condition. A current Model Y advertisement may describe another model year or drivetrain.',
    checks: ['Confirm that the quoted VIN is Performance, rather than Long Range, and compare insurance and tire costs for that exact configuration.', 'Keep term, annual mileage and upfront cost equal when comparing with a Long Range quote. Record whether the first payment and order deposit are already included.', 'Read the actual lessor’s return and purchase-option terms. Do not assume another Tesla contract has the same end-of-lease options.'],
    sourceTitle: 'Tesla leasing guidance', sourceUrl: 'https://www.tesla.com/support/leasing-your-vehicle',
  },
  'tesla-model-y-long-range-2025': {
    configuration: 'Long Range alone does not identify a complete 2025 Model Y configuration. Ask whether the quote is RWD or AWD and confirm the production version before comparing price or range.',
    checks: ['Use the drivetrain and window-sticker range of the quoted vehicle; a Long Range RWD rating does not describe the AWD version.', 'Compare the full upfront cost and annual mileage alongside the monthly payment. Tesla notes that its initial lease estimates can exclude taxes and fees.', 'Check state availability and the named lessor. Confirm the purchase option, return fees and early-termination terms in the written agreement.'],
    sourceTitle: 'Tesla leasing guidance', sourceUrl: 'https://www.tesla.com/support/leasing-your-vehicle',
  },
  'volkswagen-id-buzz-pro-s-2025': {
    configuration: 'For a US 2025 ID. Buzz Pro S quote, verify the drivetrain, seating and equipment on the specific vehicle. European ID. Buzz specifications and another US trim are not equivalent quote comparisons.',
    checks: ['Ask the dealer to identify the VIN, Pro S grade and any options or accessories included in the selling price.', 'Check whether the quote depends on loyalty, conquest or other eligibility conditions. Enter only incentives confirmed for you in the written quote.', 'Review included mileage, scheduled return fees and any purchase option with the lessor. Budget charging and insurance separately from the lease payment.'],
    sourceTitle: 'Volkswagen financing and leasing', sourceUrl: 'https://www.vw.com/en/shop/financing-and-leasing.html',
  },
  'hyundai-ioniq-5-sel-long-range-2025': {
    configuration: 'A 2025 IONIQ 5 SEL Long Range quote must specify RWD or AWD. The 318-mile US EPA RWD reference and 290-mile 19-inch AWD reference describe different configurations.',
    checks: ['Match the drivetrain, model year and included equipment before comparing SEL quotes from different dealers.', 'Ask whether the payment includes local taxes, acquisition fees and dealer-installed accessories. Count any prepaid amount only once.', 'Confirm the quote’s expiration date, annual mileage and eligibility conditions. A national headline payment may not apply to your postcode or remaining 2025 inventory.'],
    sourceTitle: 'Hyundai US offers — check location and model year', sourceUrl: 'https://www.hyundaiusa.com/us/en/offers',
  },
  'polestar-4-long-range-dual-motor-2025': {
    configuration: 'The 2025 Polestar 4 Long Range Dual Motor is distinct from the Single Motor version. The US EPA Dual Motor reference is 272 miles; a Single Motor range claim should not be used to describe this quote.',
    checks: ['Confirm Dual Motor, model year and option packs on the quoted vehicle, and check whether any advertised price refers to a different configuration.', 'Record the cash due at signing, any trade-in equity and all recurring payments. Check whether quoted incentives require another vehicle, membership or specific credit approval.', 'Use the return-mileage allowance that fits your driving and obtain the excess-mile rate from the contract. Check end-of-lease purchase and return conditions separately.'],
    sourceTitle: 'Polestar US offers — check model and eligibility', sourceUrl: 'https://www.polestar.com/us/offers/',
  },
};
