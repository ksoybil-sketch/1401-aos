import { useEffect, useState } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../api/firebase';
import { useAuthStore } from '../store/useStore';
import { TransactionLogItem, QuizResult } from '../types';

export interface RegionBranchData {
  id: string;
  name: string;
  city: string;
  inventory: any[];
  transactionLog: TransactionLogItem[];
  quizResults: QuizResult[];
}

export const useRegionBranchesData = () => {
  const regionId = useAuthStore((state) => state.regionId);
  const [branches, setBranches] = useState<RegionBranchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!regionId || !db) {
        setLoading(false);
        return;
      }

      try {
        const branchesRef = ref(db, 'branches');
        const q = query(branchesRef, orderByChild('regionId'), equalTo(regionId));
        const snapshot = await get(q);

        if (snapshot.exists()) {
          const branchesData = snapshot.val();
          const result: RegionBranchData[] = [];

          for (const [branchId, branch] of Object.entries<any>(branchesData)) {
            const inventory = branch.inventory
              ? (Array.isArray(branch.inventory) ? branch.inventory : Object.values(branch.inventory))
              : [];
            const transactionLog = branch.transactionLog
              ? (Array.isArray(branch.transactionLog) ? branch.transactionLog : Object.values(branch.transactionLog))
              : [];
            const quizResults = branch.training?.quizResults
              ? (Array.isArray(branch.training.quizResults) ? branch.training.quizResults : Object.values(branch.training.quizResults))
              : [];

            result.push({
              id: branchId,
              name: branch.name || 'Bilinmeyen Şube',
              city: branch.city || 'Belirtilmedi',
              inventory,
              transactionLog,
              quizResults
            });
          }

          setBranches(result);
        }
      } catch (error) {
        console.error('Firebase bölge verisi çekilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [regionId]);

  return { branches, loading };
};
