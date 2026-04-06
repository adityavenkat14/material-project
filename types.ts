export interface ROIInputs {
  annualProductionValue: number;
  failureRate: number;
  costPerFailure: number;
  inventoryValue: number;
  timeToMarketDelayCost: number;
  expectedFailureReduction: number;
  expectedInventoryOptimization: number;
  expectedTimeReduction: number;
  softwareCost: number;
}

export interface IndustrySample extends ROIInputs {
  industry: string;
}