import { create } from 'zustand';
import { InventoryItem, FrozenItem, TransactionLogItem } from '../types';

interface InventoryState {
  inventory: InventoryItem[];
  frozenStock: FrozenItem[];
  transactionLog: TransactionLogItem[];
  setInventory: (data: InventoryItem[]) => void;
  setFrozenStock: (data: FrozenItem[]) => void;
  setTransactionLog: (data: TransactionLogItem[]) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [],
  frozenStock: [],
  transactionLog: [],
  setInventory: (data) => set({ inventory: data }),
  setFrozenStock: (data) => set({ frozenStock: data }),
  setTransactionLog: (data) => set({ transactionLog: data }),
}));
