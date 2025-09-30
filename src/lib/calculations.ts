// Heavy Metal Pollution Index Calculations

export interface WaterSample {
  id: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any; // For metal concentrations
}

export interface CalculationResult {
  id: string;
  latitude?: number;
  longitude?: number;
  hpi: number;
  hei: number;
  cd: number;
  category: "Safe" | "Slightly Polluted" | "Hazardous";
  metals: { [key: string]: number };
}

// Standard WHO guideline values (mg/L) for common heavy metals
export const WHO_STANDARDS: { [key: string]: number } = {
  As: 0.01,
  Cd: 0.003,
  Cr: 0.05,
  Cu: 2.0,
  Fe: 0.3,
  Pb: 0.01,
  Mn: 0.4,
  Ni: 0.07,
  Zn: 3.0,
  Hg: 0.006,
};

// Calculate Heavy Metal Pollution Index (HPI)
export function calculateHPI(sample: WaterSample, metals: string[]): number {
  let weightedSum = 0;
  let totalWeight = 0;

  metals.forEach((metal) => {
    const concentration = parseFloat(sample[metal]) || 0;
    const standard = WHO_STANDARDS[metal] || 1;
    
    // Weight is inversely proportional to standard
    const weight = 1 / standard;
    
    // Sub-index: (Actual value - Ideal value) / (Standard - Ideal) * 100
    // Ideal value is typically 0 for heavy metals
    const subIndex = (concentration / standard) * 100;
    
    weightedSum += weight * subIndex;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// Calculate Heavy Metal Evaluation Index (HEI)
export function calculateHEI(sample: WaterSample, metals: string[]): number {
  let sum = 0;

  metals.forEach((metal) => {
    const concentration = parseFloat(sample[metal]) || 0;
    const standard = WHO_STANDARDS[metal] || 1;
    
    // HEI is the sum of ratios of concentration to standard
    sum += concentration / standard;
  });

  return sum;
}

// Calculate Contamination Degree (Cd)
export function calculateCd(sample: WaterSample, metals: string[]): number {
  let sum = 0;

  metals.forEach((metal) => {
    const concentration = parseFloat(sample[metal]) || 0;
    const standard = WHO_STANDARDS[metal] || 1;
    
    // Contamination factor
    const cf = concentration / standard;
    sum += cf;
  });

  return sum;
}

// Categorize water quality based on HPI
export function categorizeWaterQuality(hpi: number): "Safe" | "Slightly Polluted" | "Hazardous" {
  if (hpi < 100) return "Safe";
  if (hpi < 200) return "Slightly Polluted";
  return "Hazardous";
}

// Process all samples and calculate indices
export function processWaterSamples(samples: WaterSample[]): CalculationResult[] {
  if (!samples || samples.length === 0) return [];

  // Detect metal columns (excluding id, latitude, longitude)
  const firstSample = samples[0];
  const metalColumns = Object.keys(firstSample).filter(
    (key) => !["id", "latitude", "longitude", "lat", "lon", "lng"].includes(key.toLowerCase())
  );

  return samples.map((sample, index) => {
    const hpi = calculateHPI(sample, metalColumns);
    const hei = calculateHEI(sample, metalColumns);
    const cd = calculateCd(sample, metalColumns);
    const category = categorizeWaterQuality(hpi);

    const metals: { [key: string]: number } = {};
    metalColumns.forEach((metal) => {
      metals[metal] = parseFloat(sample[metal]) || 0;
    });

    return {
      id: sample.id || `Sample ${index + 1}`,
      latitude: sample.latitude || sample.lat,
      longitude: sample.longitude || sample.lon || sample.lng,
      hpi: Math.round(hpi * 100) / 100,
      hei: Math.round(hei * 100) / 100,
      cd: Math.round(cd * 100) / 100,
      category,
      metals,
    };
  });
}
