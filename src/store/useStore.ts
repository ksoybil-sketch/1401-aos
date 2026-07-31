import { useAuthStore } from './useAuthStore';
import { useInventoryStore } from './useInventoryStore';
import { useAppStore } from './useAppStore';
import { useSyncStore } from './useSyncStore';
import { useBranchesStore } from './useBranchesStore';

export const useStore = () => {
  const auth = useAuthStore();
  const inventory = useInventoryStore();
  const app = useAppStore();
  
  return {
    ...auth,
    ...inventory,
    ...app,
    ...useBranchesStore()
  };
};

export { useAuthStore, useInventoryStore, useAppStore, useSyncStore, useBranchesStore };
