import { create } from 'zustand';
import { InventoryItem } from '../types';

interface UIState {
  showBranchModal: boolean;
  showAddModal: boolean;
  showDeleteModal: boolean;
  showCsvModal: boolean;
  showSmartReorderModal: boolean;
  showFrozenModal: boolean;

  scannedBarcode: string;
  itemToDelete: (InventoryItem & { isFrozen?: boolean }) | null;
  frozenFeedbackMsg: string;

  setModalState: (modalName: keyof Omit<UIState, 'setModalState' | 'openAddModal' | 'openDeleteModal' | 'setFrozenFeedback' | 'scannedBarcode' | 'itemToDelete' | 'frozenFeedbackMsg' | 'inventoryStatusFilter' | 'setInventoryStatusFilter'>, isOpen: boolean) => void;
  openAddModal: (barcode: string) => void;
  openDeleteModal: (item: InventoryItem, isFrozen?: boolean) => void;
  setFrozenFeedback: (msg: string) => void;
  inventoryStatusFilter: 'Hepsi' | 'danger' | 'warning' | 'success';
  setInventoryStatusFilter: (filter: 'Hepsi' | 'danger' | 'warning' | 'success') => void;
}

export const useUIStore = create<UIState>((set) => ({
  showBranchModal: false,
  showAddModal: false,
  showDeleteModal: false,
  showCsvModal: false,
  showSmartReorderModal: false,
  showFrozenModal: false,

  scannedBarcode: '',
  itemToDelete: null,
  frozenFeedbackMsg: '',

  setModalState: (modalName, isOpen) => set((state) => ({ ...state, [modalName]: isOpen })),
  
  openAddModal: (barcode) => set({ showAddModal: true, scannedBarcode: barcode }),
  
  openDeleteModal: (item, isFrozen = false) => set({ showDeleteModal: true, itemToDelete: { ...item, isFrozen } }),
  
  setFrozenFeedback: (msg) => {
    set({ frozenFeedbackMsg: msg });
    if (msg) {
      setTimeout(() => {
        set({ frozenFeedbackMsg: '' });
      }, 5000);
    }
  },

  inventoryStatusFilter: 'Hepsi',
  setInventoryStatusFilter: (filter) => set({ inventoryStatusFilter: filter })
}));
