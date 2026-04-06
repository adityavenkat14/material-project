import { ROIInputs } from '../types';

export const calculateROI = (inputs: ROIInputs) => {
  const currentFailureLoss = (inputs.annualProductionValue * (inputs.failureRate / 100));
  const failureSavings = currentFailureLoss * (inputs.expectedFailureReduction / 100);
  const inventorySavings = inputs.inventoryValue * (inputs.expectedInventoryOptimization / 100);
  const timeToMarketSavings = inputs.timeToMarketDelayCost * (inputs.expectedTimeReduction / 100);
  const totalAnnualBenefit = failureSavings + inventorySavings + timeToMarketSavings;
  const roi = ((totalAnnualBenefit - inputs.softwareCost) / inputs.softwareCost) * 100;
  return { currentFailureLoss, failureSavings, inventorySavings, timeToMarketSavings, totalAnnualBenefit, roi, paybackPeriod: (inputs.softwareCost / totalAnnualBenefit) * 12 };
};

export const getSensitivityAnalysis = (inputs: ROIInputs) => {
  return { 
    base: calculateROI(inputs), 
    worst: calculateROI({...inputs, expectedFailureReduction: inputs.expectedFailureReduction * 0.7}), 
    best: calculateROI({...inputs, expectedFailureReduction: inputs.expectedFailureReduction * 1.3}) 
  };
};