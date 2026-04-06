"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, TrendingUp, Clock, FileText, Table as TableIcon,
  ChevronRight, Info, RefreshCw, BarChart3, PieChart as PieChartIcon,
  ArrowRight, AlertCircle, Globe
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import { cn, formatCurrency } from '../lib/utils';
import { ROIInputs, IndustrySample } from '..//types';
import { INDUSTRY_SAMPLES } from '../constants';
import { calculateROI, getSensitivityAnalysis } from '../utils/calculations';

const COLORS = ['#141414', '#4a4a4a', '#8e9299', '#d1d1d1'];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export default function App() { 
  const [inputs, setInputs] = useState<ROIInputs>(INDUSTRY_SAMPLES[0]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(INDUSTRY_SAMPLES[0].industry);
  const [currency, setCurrency] = useState('USD');

  const results = useMemo(() => calculateROI(inputs), [inputs]);
  const sensitivity = useMemo(() => getSensitivityAnalysis(inputs), [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const chartData = [
    { name: 'Failure Savings', value: results.failureSavings },
    { name: 'Inventory Savings', value: results.inventorySavings },
    { name: 'Time Savings', value: results.timeToMarketSavings },
  ];

  const sensitivityData = [
    { name: 'Worst Case', roi: sensitivity.worst.roi, benefit: sensitivity.worst.totalAnnualBenefit },
    { name: 'Base Case', roi: sensitivity.base.roi, benefit: sensitivity.base.totalAnnualBenefit },
    { name: 'Best Case', roi: sensitivity.best.roi, benefit: sensitivity.best.totalAnnualBenefit },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#141414] font-sans selection:bg-[#141414] selection:text-white">
      <header className="border-b border-[#141414]/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141414] rounded-lg flex items-center justify-center text-white">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Material Intelligence</h1>
              <p className="text-xs text-[#141414]/50 uppercase tracking-widest font-semibold">ROI Calculator v1.1</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-2 border border-[#141414]/10 rounded-full text-sm font-medium bg-white">
                <Globe size={14} />
                <span>{currency}</span>
              </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-white rounded-full text-sm font-medium">
              <FileText size={16} />
              <span>Word Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#141414]/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#141414]/40 mb-4 flex items-center gap-2">
              <RefreshCw size={14} /> Industry Presets
            </h2>
            {INDUSTRY_SAMPLES.map((sample) => (
              <button
                key={sample.industry}
                onClick={() => { setInputs(sample); setSelectedIndustry(sample.industry); }}
                className={cn("w-full text-left px-4 py-3 rounded-xl mb-2 flex items-center justify-between", 
                selectedIndustry === sample.industry ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5")}
              >
                <span className="font-medium">{sample.industry}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#141414]/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#141414]/40 mb-6">Financial Inputs</h2>
            <div className="space-y-4">
              <InputField label="Annual Production" name="annualProductionValue" value={inputs.annualProductionValue} onChange={handleInputChange} prefix={currencySymbol} />
              <InputField label="Failure Rate (%)" name="failureRate" value={inputs.failureRate} onChange={handleInputChange} suffix="%" />
              <InputField label="Inventory Value" name="inventoryValue" value={inputs.inventoryValue} onChange={handleInputChange} prefix={currencySymbol} />
              <InputField label="Software Cost" name="softwareCost" value={inputs.softwareCost} onChange={handleInputChange} prefix={currencySymbol} highlight />
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResultCard label="Annual Benefit" value={formatCurrency(results.totalAnnualBenefit, currency)} icon={<TrendingUp className="text-green-600" />} description="Yearly savings" />
            <ResultCard label="ROI" value={`${results.roi.toFixed(1)}%`} icon={<BarChart3 className="text-blue-600" />} description="Return on investment" />
            <ResultCard label="Payback" value={`${results.paybackPeriod.toFixed(1)} Mo`} icon={<Clock className="text-orange-600" />} description="Recovery time" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#141414]/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#141414]/40 mb-6 flex items-center gap-2">
                <PieChartIcon size={14} /> Savings Distribution
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#141414]/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#141414]/40 mb-6 flex items-center gap-2">
                <BarChart3 size={14} /> ROI Sensitivity
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="benefit" fill="#141414" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="roi" stroke="#4a4a4a" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({ label, name, value, onChange, prefix, suffix, highlight }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#141414]/60 uppercase">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">{prefix}</span>}
        <input type="number" name={name} value={value} onChange={onChange} 
        className={cn("w-full border-2 rounded-xl py-2 px-8 text-sm outline-none", highlight ? "bg-[#141414]/5 font-bold" : "bg-white")} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-40">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultCard({ label, value, icon, description }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#141414]/5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase text-[#141414]/40">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-[#141414]/50">{description}</div>
    </div>
  );
}