import React, { useState, useEffect } from 'react';
import { HistoryEntry, InsightResponse } from '../types';
import NetWorthChart from './NetWorthChart';
import { TrendingUp, TrendingDown, BrainCircuit, ArrowRight } from 'lucide-react';
import { generateFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  history: HistoryEntry[];
  onNavigate: (view: 'update' | 'bills') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onNavigate }) => {
  const [insights, setInsights] = useState<InsightResponse | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const currentEntry = history.length > 0 
    ? [...history].sort((a, b) => b.timestamp - a.timestamp)[0] 
    : null;

  const currentNetWorth = currentEntry?.netWorth || 0;
  const previousEntry = history.length > 1 
    ? [...history].sort((a, b) => b.timestamp - a.timestamp)[1]
    : null;

  const diff = currentNetWorth - (previousEntry?.netWorth || 0);
  const isPositive = diff >= 0;

  // Effect to load insights if we have data and haven't loaded them yet
  useEffect(() => {
    if (history.length >= 2 && !insights) {
      setLoadingInsights(true);
      generateFinancialInsights(history)
        .then(setInsights)
        .finally(() => setLoadingInsights(false));
    }
  }, [history, insights]);

  const EmptyState = () => (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Welcome to MonthlyNet</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Track your net worth with monthly check-ins. No noise, just the big picture.
      </p>
      <button 
        onClick={() => onNavigate('update')}
        className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-brand-500/30"
      >
        Start Your First Month
      </button>
    </div>
  );

  if (!currentEntry) return <EmptyState />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Current Net Worth</p>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            ${currentNetWorth.toLocaleString()}
          </h1>
          {previousEntry && (
            <div className={`flex items-center gap-2 mt-3 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{diff.toLocaleString()} this month
              </span>
            </div>
          )}
        </div>
        <button 
          onClick={() => onNavigate('update')}
          className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Update Balances
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <NetWorthChart data={history} />
        </div>

        {/* Stats / AI Insight Column */}
        <div className="space-y-6">
          {/* Assets vs Liabilities Mini Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <p className="text-emerald-600/80 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Assets</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                ${currentEntry.totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
              <p className="text-rose-600/80 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">Liabilities</p>
              <p className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">
                ${currentEntry.totalLiabilities.toLocaleString()}
              </p>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">Smart Analysis</h3>
            </div>
            
            {loadingInsights ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded w-3/4"></div>
                <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded w-full"></div>
                <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded w-2/3"></div>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <p className="text-indigo-900/80 dark:text-indigo-200/80 text-sm leading-relaxed">
                  {insights.summary}
                </p>
                <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase mb-1">Tip</p>
                  <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">{insights.actionableTip}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-indigo-400">
                Add more monthly snapshots to unlock AI insights about your financial trend.
              </p>
            )}
          </div>

          {/* Quick Action */}
          <button 
            onClick={() => onNavigate('bills')}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300">Check Monthly Bills</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
