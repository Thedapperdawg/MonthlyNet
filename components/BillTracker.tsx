import React, { useState, useCallback } from 'react';
import { Bill } from '../types';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface BillTrackerProps {
  bills: Bill[];
  onUpdateBills: (bills: Bill[]) => void;
}

const BillTracker: React.FC<BillTrackerProps> = ({ bills, onUpdateBills }) => {
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDay, setNewBillDay] = useState('');

  const sortedBills = [...bills].sort((a, b) => a.dueDay - b.dueDay);

  const handleAddBill = useCallback(() => {
    if (!newBillName || !newBillAmount || !newBillDay) return;
    
    const newBill: Bill = {
      id: crypto.randomUUID(),
      name: newBillName,
      amount: parseFloat(newBillAmount),
      dueDay: parseInt(newBillDay),
      isPaid: false
    };

    onUpdateBills([...bills, newBill]);
    setNewBillName('');
    setNewBillAmount('');
    setNewBillDay('');
  }, [bills, newBillName, newBillAmount, newBillDay, onUpdateBills]);

  const togglePaid = (id: string) => {
    const updated = bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b);
    onUpdateBills(updated);
  };

  const deleteBill = (id: string) => {
    onUpdateBills(bills.filter(b => b.id !== id));
  };

  const resetMonth = () => {
    if(confirm("Reset all bills to 'Unpaid' for the new month?")) {
      onUpdateBills(bills.map(b => ({ ...b, isPaid: false })));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Monthly Bills</h2>
        <button 
          onClick={resetMonth}
          className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-500 font-medium"
        >
          Start New Month
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {sortedBills.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No bills tracked yet. Add your recurring bills below.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedBills.map(bill => (
              <div key={bill.id} className={`p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${bill.isPaid ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => togglePaid(bill.id)} className="text-slate-400 hover:text-brand-500 transition-colors">
                    {bill.isPaid ? (
                      <CheckCircle2 className="w-6 h-6 text-brand-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div>
                    <p className={`font-medium ${bill.isPaid ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                      {bill.name}
                    </p>
                    <p className="text-xs text-slate-500">Due on day {bill.dueDay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    ${bill.amount.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => deleteBill(bill.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Bill Form */}
      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Add Recurring Bill</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Bill Name (e.g. Rent)" 
            value={newBillName}
            onChange={e => setNewBillName(e.target.value)}
            className="flex-grow px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={newBillAmount}
            onChange={e => setNewBillAmount(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input 
            type="number" 
            placeholder="Day (1-31)" 
            min="1"
            max="31"
            value={newBillDay}
            onChange={e => setNewBillDay(e.target.value)}
            className="w-full sm:w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button 
            onClick={handleAddBill}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillTracker;
