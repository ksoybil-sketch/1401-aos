import { useEffect } from 'react';
import { useAuthStore, useInventoryStore, useAppStore } from '../store/useStore';
import { syncEngine } from '../api/syncEngine';
import { InventoryItem, FrozenItem, TransactionLogItem, Recipe } from '../types';
import { syncInventoryToNative } from '../native/inventoryBridge';

export const useSyncData = () => {
  const activeBranchId = useAuthStore(state => state.activeBranchId);
  const setInventory = useInventoryStore(state => state.setInventory);
  const setFrozenStock = useInventoryStore(state => state.setFrozenStock);
  const setTransactionLog = useInventoryStore(state => state.setTransactionLog);
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
      // Firebase'e ulaşmadan (çevrimdışıyken) da 08:00/17:00 bildirimleri
      // bu cihazdaki en güncel envanteri görsün diye anında yazıyoruz.
      syncInventoryToNative(newData);
    },
    updateFrozenStock: (newData: FrozenItem[]) => {
      setFrozenStock(newData);
      syncEngine.enqueueTask({ type: 'FROZEN', action: 'SET', payload: newData });
    },
    updateTransactionLog: (newData: TransactionLogItem[]) => {
      setTransactionLog(newData);
      syncEngine.enqueueTask({ type: 'TRANSACTION', action: 'SET', payload: newData });
    },
    // Reçeteler artık recipes/{id} şeklinde tek tek anahtarlı kayıtlar olarak
    // saklanıyor (bkz. syncEngine.ts) — bu yüzden sadece DEĞİŞEN reçeteyi
    // yazıyoruz/siliyoruz, hâlâ senkronize olmamış yerel state'teki diğer
    // reçetelerin üzerine yazma riski yok. useAppStore.setState fonksiyonel
    // güncelleme kullanır, bileşenin closure'ındaki (stale olabilecek)
    // `recipes` dizisine hiç bağımlı değildir.
    saveRecipe: (recipe: Recipe) => {
      useAppStore.setState((state) => {
        const exists = state.recipes.some((r) => r.id === recipe.id);
        return {
          recipes: exists
            ? state.recipes.map((r) => (r.id === recipe.id ? recipe : r))
            : [recipe, ...state.recipes]
        };
      });
      syncEngine.enqueueTask({ type: 'RECIPE', action: 'SET', payload: recipe, recipeId: recipe.id });
    },
    deleteRecipe: (id: string) => {
      useAppStore.setState((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id)
      }));
      syncEngine.enqueueTask({ type: 'RECIPE', action: 'DELETE', payload: null, recipeId: id });
    },
    updateProductMappings: (newData: Record<string, { name: string; category: string }>) => {
      setProductMappings(newData);
      syncEngine.enqueueTask({ type: 'MAPPINGS', action: 'SET', payload: newData });
    }
  };
};
