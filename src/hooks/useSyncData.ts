import { useEffect } from 'react';
import { useAuthStore, useInventoryStore, useAppStore } from '../store/useStore';
import { syncEngine } from '../api/syncEngine';
import { InventoryItem, FrozenItem, TransactionLogItem, Recipe } from '../types';

export const useSyncData = () => {
  const activeBranchId = useAuthStore(state => state.activeBranchId);
  const setInventory = useInventoryStore(state => state.setInventory);
  const setFrozenStock = useInventoryStore(state => state.setFrozenStock);
  const setTransactionLog = useInventoryStore(state => state.setTransactionLog);
  const setRecipes = useAppStore(state => state.setRecipes);
  const setProductMappings = useAppStore(state => state.setProductMappings);

  useEffect(() => {
    syncEngine.init();
    
    let unsubscribe: (() => void) | undefined;
    let unsubscribeBranches: (() => void) | undefined;
    if (activeBranchId) {
      unsubscribe = syncEngine.subscribeToFirebase(activeBranchId);
    }
    unsubscribeBranches = syncEngine.subscribeToBranches();
    
    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeBranches) unsubscribeBranches();
    };
  }, [activeBranchId, useAuthStore.getState().userRole]);

  return {
    updateInventory: (newData: InventoryItem[]) => {
      setInventory(newData);
      syncEngine.enqueueTask({ type: 'INVENTORY', action: 'SET', payload: newData });
    },
    updateFrozenStock: (newData: FrozenItem[]) => {
      setFrozenStock(newData);
      syncEngine.enqueueTask({ type: 'FROZEN', action: 'SET', payload: newData });
    },
    updateTransactionLog: (newData: TransactionLogItem[]) => {
      setTransactionLog(newData);
      syncEngine.enqueueTask({ type: 'TRANSACTION', action: 'SET', payload: newData });
    },
    updateRecipes: (newData: Recipe[]) => {
      setRecipes(newData);
      syncEngine.enqueueTask({ type: 'RECIPES', action: 'SET', payload: newData });
    },
    updateProductMappings: (newData: Record<string, { name: string; category: string }>) => {
      setProductMappings(newData);
      syncEngine.enqueueTask({ type: 'MAPPINGS', action: 'SET', payload: newData });
    }
  };
};
