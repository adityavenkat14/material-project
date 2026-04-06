import { IndustrySample } from './types';

export const INDUSTRY_SAMPLES: IndustrySample[] = [
  {
    industry: 'Pharmaceuticals',
    annualProductionValue: 50000000,
    failureRate: 4.5,
    costPerFailure: 15000,
    inventoryValue: 12000000,
    timeToMarketDelayCost: 2500000,
    expectedFailureReduction: 35,
    expectedInventoryOptimization: 20,
    expectedTimeReduction: 15,
    softwareCost: 150000
  },
  {
    industry: 'Automotive',
    annualProductionValue: 120000000,
    failureRate: 2.1,
    costPerFailure: 8000,
    inventoryValue: 25000000,
    timeToMarketDelayCost: 5000000,
    expectedFailureReduction: 25,
    expectedInventoryOptimization: 15,
    expectedTimeReduction: 10,
    softwareCost: 250000
  }
];