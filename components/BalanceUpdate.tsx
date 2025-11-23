import React, { useState } from 'react';
import { Balances } from '../types';
import { Sparkles, Save, Wand2, Loader2 } from 'lucide-react';
import { parseNaturalLanguageInput } from '../services/geminiService';

interface BalanceUpdateProps {
  currentBalances: Balances;
  onSave: (newBalances: Balances) => void;
  onCancel: () => void;
}

const BalanceUpdate: React.FC<BalanceUpdateProps> = ({ currentBalances, onSave, onCancel }) => {
  const [balances, setBalances] = useState<Balances>(currentBalances);
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleChange = (field: keyof Balances, value: string) => {
    const num = parseFloat(value) || 0;
    setBalances(prev => ({ ...prev, [field]: num }));
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsing(true);
    const result = await parseNaturalLanguageInput(aiInput);
    
    if (result) {
      setBalances(prev => ({
        ...prev,
        ...result
      }));
    }
    setIsParsing(false);
  };

  const totalAssets = balances.cash + balances.savings + balances.investments + balances.realEstate;
  const totalLiabilities = balances.creditCards + balances.loans + balances.mortgage;
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Update Balances</h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            Cancel
          </button>
          <button onClick={() => onSave(balances)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium shadow-md shadow-brand-500/20 transition-all">
            <Save className="w-4 h-4" /> Save Snapshot
          </button>
        </div>
      </div>

      {/* AI Quick Fill */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">Magic Fill</h3>
        </div>
        <p className="text-sm text-indigo-700 dark:text-indigo-200 mb-3">
          Paste your notes here (e.g., "Checking is 5000, paid down visa to 200, savings up to 15k")
        </p>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Type or paste your monthly update..."
            className="flex-grow px-4 py-3 rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900"
          />
          <button 
            onClick={handleAiParse}
            disabled={isParsing || !aiInput}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Fill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Assets Column */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-emerald-600 flex items-center gap-2 border-b border-slate-200 pb-2">
            Assets <span className="ml-auto text-emerald-700 dark:text-emerald-400">${totalAssets.toLocaleString()}</span>
          </h3>
          
          {[
            { label: 'Cash & Checking', key: 'cash' as keyof Balances },
            { label: 'Savings Accounts', key: 'savings' as keyof Balances },
            { label: 'Investments (Stocks, 401k)', key: 'investments' as keyof Balances },
            { label: 'Real Estate / Vehicle Value', key: 'realEstate' as keyof Balances },
          ].map((item) => (
            <div key={item.key} className="group">
              <label className="block text-sm font-medium text-slate-500 mb-1">{item.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input 
                  type="number" 
                  value={balances[item.key] || ''}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Liabilities Column */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-rose-600 flex items-center gap-2 border-b border-slate-200 pb-2">
            Liabilities <span className="ml-auto text-rose-700 dark:text-rose-400">${totalLiabilities.toLocaleString()}</span>
          </h3>

          {[
            { label: 'Credit Card Debt', key: 'creditCards' as keyof Balances },
            { label: 'Personal Loans', key: 'loans' as keyof Balances },
            { label: 'Mortgage Balance', key: 'mortgage' as keyof Balances },
          ].map((item) => (
            <div key={item.key} className="group">
              <label className="block text-sm font-medium text-slate-500 mb-1">{item.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input 
                  type="number" 
                  value={balances[item.key] || ''}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 mb-1 uppercase tracking-wider text-xs font-semibold">Projected Net Worth</p>
        <p className={`text-4xl font-bold ${netWorth >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
          ${netWorth.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BalanceUpdate;
