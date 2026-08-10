/**
 * Calculates volumetric weight for shipping couriers.
 * Formula commonly used: (Length x Width x Height in cm) / 5000
 */
export function calculateVolumetricWeight(lengthCm: number, widthCm: number, heightCm: number): number {
  return (lengthCm * widthCm * heightCm) / 5000;
}

/**
 * Mock interface for Courier APIs (Econt & Speedy)
 * Real integration requires merchant API credentials.
 */
export async function getShippingRates(postalCode: string, countryCode: string, weightKg: number, volumetricWeight: number) {
  // Use the greater of actual weight or volumetric weight
  const chargeableWeight = Math.max(weightKg, volumetricWeight);

  // Mock rates for Bulgaria
  if (countryCode === 'BG') {
    return {
      econt: 6.50 + (chargeableWeight * 1.20),
      speedy: 5.80 + (chargeableWeight * 1.15),
    };
  }

  // Mock rates for International (EU)
  return {
    internationalStandard: 25.00 + (chargeableWeight * 5.00),
  };
}
