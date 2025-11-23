import React, { useState, useEffect } from 'react';
import { HistoryEntry, Balances, Bill, ViewState } from './types';
import Dashboard from './components/Dashboard';
import BalanceUpdate from './components/BalanceUpdate';
import BillTracker from './components/BillTracker';
import { LayoutDashboard, LineChart, Receipt, Moon, Sun } from 'lucide-react';

const DEFAULT_BALANCES: Balances = {
  cash: 0,
  savings: 0,
  investments: 0,
  realEstate: 0,
  creditCards: 0,
  loans: 0,
  mortgage: 0
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load data from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('monthlynet_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedBills = localStorage.getItem('monthlynet_bills');
    if (savedBills) setBills(JSON.parse(savedBills));

    // Check system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Persist data on changes
  useEffect(() => {
    localStorage.setItem('monthlynet_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('monthlynet_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveBalances = (balances: Balances) => {
    const totalAssets = balances.cash + balances.savings + balances.investments + balances.realEstate;
    const totalLiabilities = balances.creditCards + balances.loans + balances.mortgage;
    const netWorth = totalAssets - totalLiabilities;

    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      balances,
      netWorth,
      totalAssets,
      totalLiabilities
    };

    setHistory(prev => [...prev, newEntry]);
    setView('dashboard');
  };

  // Get most recent balances for the form
  const latestBalances = history.length > 0 
    ? [...history].sort((a, b) => b.timestamp - a.timestamp)[0].balances 
    : DEFAULT_BALANCES;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <LineChart className="w-5 h-5" />
            </div>
            MonthlyNet
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button 
              onClick={() => setView('bills')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'bills' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Bills</span>
            </button>
          </nav>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {view === 'dashboard' && (
          <Dashboard history={history} onNavigate={setView} />
        )}
        
        {view === 'update' && (
          <BalanceUpdate 
            currentBalances={latestBalances} 
            onSave={handleSaveBalances}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'bills' && (
          <BillTracker bills={bills} onUpdateBills={setBills} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} MonthlyNet. Minimal finance tracking.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
