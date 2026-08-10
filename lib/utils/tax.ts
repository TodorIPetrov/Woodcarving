/**
 * EU OSS VAT Logic Implementation
 * Default is Bulgarian VAT (20%).
 * Other EU nations use their destination-based rates.
 * Non-EU nations usually have 0% VAT (Export), handled conditionally.
 */

const EU_VAT_RATES: Record<string, number> = {
  BG: 0.20, // Bulgaria Default
  DE: 0.19, // Germany
  FR: 0.20, // France
  IT: 0.22, // Italy
  ES: 0.21, // Spain
  NL: 0.21, // Netherlands
  BE: 0.21, // Belgium
  AT: 0.20, // Austria
  GR: 0.24, // Greece
  // Add other EU countries as needed...
};

export function calculateTax(basePrice: number, countryCode: string, isEuMember: boolean): number {
  if (!isEuMember) {
    // Zero-rated for export outside EU
    return 0;
  }

  const vatRate = EU_VAT_RATES[countryCode.toUpperCase()] || EU_VAT_RATES['BG'];
  return basePrice * vatRate;
}

export function getTotalWithTax(basePrice: number, countryCode: string, isEuMember: boolean): number {
  const tax = calculateTax(basePrice, countryCode, isEuMember);
  return basePrice + tax;
}
