import localforage from 'localforage';
import { ref, set, remove, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { useAuthStore, useInventoryStore, useSyncStore, useAppStore, useBranchesStore } from '../store/useStore';
import { InventoryItem, FrozenItem, TransactionLogItem, Recipe } from '../types';
import { syncInventoryToNative } from '../native/inventoryBridge';

// Configure localforage for Sync Queue
localforage.config({
  name: '1401AOS',
  storeName: 'sync_queue'
});

interface SyncTask {
  id: string;
  type: 'INVENTORY' | 'FROZEN' | 'TRANSACTION' | 'RECIPE' | 'MAPPINGS';
  action: 'SET' | 'DELETE';
  payload: any;
  recipeId?: string;
  timestamp: number;
}

export const syncEngine = {
  init: () => {
    window.addEventListener('online', syncEngine.processQueue);
    window.addEventListener('offline', () => useSyncStore.getState().setOnlineStatus(false));

    if (navigator.onLine) {
      useSyncStore.getState().setOnlineStatus(true);
      syncEngine.processQueue();
    }
  },

  enqueueTask: async (task: Omit<SyncTask, 'id' | 'timestamp'>) => {
    const queue = (await localforage.getItem<SyncTask[]>('offline_queue')) || [];
    const newTask: SyncTask = {
      ...task,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    queue.push(newTask);
    await localforage.setItem('offline_queue', queue);
    useSyncStore.getState().setPendingCount(queue.length);

    if (navigator.onLine) {
      syncEngine.processQueue();
    }
  },

  processQueue: async () => {
    useSyncStore.getState().setOnlineStatus(true);
    if (!navigator.onLine || useSyncStore.getState().isSyncing) return;

    useSyncStore.getState().setSyncing(true);
    const queue = (await localforage.getItem<SyncTask[]>('offline_queue')) || [];
    const activeBranchId = useAuthStore.getState().activeBranchId;

    if (queue.length === 0 || !activeBranchId || !db) {
      useSyncStore.getState().setSyncing(false);
      return;
    }

    try {
      const newQueue = [...queue];
      for (const task of queue) {
        let refPath = `branches/${activeBranchId}/`;
        if (task.type === 'INVENTORY') refPath += 'inventory';
        if (task.type === 'FROZEN') refPath += 'frozenStock';
        if (task.type === 'TRANSACTION') refPath += 'transactionLog';
        if (task.type === 'RECIPE') refPath = `recipes/${task.recipeId}`;
        if (task.type === 'MAPPINGS') refPath = 'productMappings';

        if (task.action === 'SET') {
          await set(ref(db, refPath), task.payload);
        } else if (task.action === 'DELETE') {
          await remove(ref(db, refPath));
        }

        newQueue.shift();
        await localforage.setItem('offline_queue', newQueue);
        useSyncStore.getState().setPendingCount(newQueue.length);
      }
    } catch (error) {
      console.error('Senkronizasyon hatası:', error);
    } finally {
      useSyncStore.getState().setSyncing(false);
    }
  },

  subscribeToFirebase: (branchId: string) => {
    if (!db || !branchId) return;

    const inventoryRef = ref(db, `branches/${branchId}/inventory`);
    const frozenStockRef = ref(db, `branches/${branchId}/frozenStock`);
    const transactionLogRef = ref(db, `branches/${branchId}/transactionLog`);
    const quizResultsRef = ref(db, `branches/${branchId}/training/quizResults`);
    const recipesRef = ref(db, `recipes`);
    const productMappingsRef = ref(db, `productMappings`);

    onValue(inventoryRef, async (snapshot) => {
      const val = snapshot.exists() ? snapshot.val() : [];
      useInventoryStore.getState().setInventory(val);
      await localforage.setItem(`cache_${branchId}_inventory`, val);
      // 08:00/17:00 SKT bildirimleri bu cihazın SharedPreferences'ından okur —
      // envanter boşalırsa (son ürün tüketildi) da güncel kalması gerekiyor.
      await syncInventoryToNative(val);
    });

    onValue(frozenStockRef, async (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        useInventoryStore.getState().setFrozenStock(val);
        await localforage.setItem(`cache_${branchId}_frozenStock`, val);
      }
    });

    onValue(transactionLogRef, async (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        useInventoryStore.getState().setTransactionLog(val);
        await localforage.setItem(`cache_${branchId}_transactionLog`, val);
      }
    });

    onValue(quizResultsRef, async (snapshot) => {
      if (snapshot.exists()) {
        // Data is pushed as object { pushId: { ...data } }
        // We need an array for store
        const val = snapshot.val();
        const arr = Object.values(val) as any[];
        useAppStore.getState().setQuizResults(arr);
        await localforage.setItem(`cache_${branchId}_quizResults`, arr);
      }
    });

    onValue(recipesRef, async (snapshot) => {
      // recipes/{id} şeklinde anahtarlı kayıtlar (tıpkı quizResults gibi) — tek bir
      // cihaz senkronize olmadan bir reçete ekleyip/silip tüm diziyi ezmesin diye.
      if (snapshot.exists()) {
        const val = snapshot.val();
        const arr = (Array.isArray(val) ? val : Object.values(val)) as Recipe[];
        useAppStore.getState().setRecipes(arr);
        await localforage.setItem(`cache_recipes`, arr);
      } else {
        useAppStore.getState().setRecipes([]);
        await localforage.setItem(`cache_recipes`, []);
      }
    });

    onValue(productMappingsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        useAppStore.getState().setProductMappings(val);
        await localforage.setItem(`cache_productMappings`, val);
      }
    });

    return () => {
      off(inventoryRef);
      off(frozenStockRef);
      off(transactionLogRef);
      off(quizResultsRef);
      off(recipesRef);
      off(productMappingsRef);
    };
  },

  subscribeToBranches: () => {
    if (!db) return;
    const userRole = useAuthStore.getState().userRole;
    const activeBranchId = useAuthStore.getState().activeBranchId;

    if (userRole === ('admin' as any) || userRole === 'Bölge Müdürü') {
      const branchesRef = ref(db, 'branches');
      onValue(branchesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Map object to array
          const branchesArr = Object.keys(data).map(key => ({
            id: key,
            name: data[key].name || key,
            city: data[key].city || '',
            regionId: data[key].regionId,
            notifyEmail: data[key].notifyEmail
          }));
          useBranchesStore.getState().setBranches(branchesArr);
        }
      });
      return () => off(ref(db, 'branches'));
    } else if (activeBranchId) {
      const branchRef = ref(db, `branches/${activeBranchId}`);
      onValue(branchRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          useBranchesStore.getState().setBranches([{
            id: activeBranchId,
            name: data.name || activeBranchId,
            city: data.city || '',
            regionId: data.regionId,
            notifyEmail: data.notifyEmail
          }]);
        }
      });
      return () => off(ref(db, `branches/${activeBranchId}`));
    }
  }
};
