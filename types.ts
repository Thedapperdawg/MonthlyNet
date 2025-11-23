export interface Balances {
  cash: number;
  savings: number;
  investments: number;
  realEstate: number;
  creditCards: number;
  loans: number;
  mortgage: number;
}

export interface HistoryEntry {
  id: string;
  date: string;
  timestamp: number;
  balances: Balances;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  isPaid: boolean;
}

export type ViewState = 'dashboard' | 'update' | 'bills';

export interface InsightResponse {
  summary: string;
  projection: string;
  actionableTip: string;
}

export interface ParsedBalances {
  cash?: number;
  savings?: number;
  investments?: number;
  realEstate?: number;
  creditCards?: number;
  loans?: number;
  mortgage?: number;
}
