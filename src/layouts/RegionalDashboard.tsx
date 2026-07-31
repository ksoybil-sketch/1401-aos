import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useAuthStore } from '../store/useStore';
import { getDaysRemaining } from '../utils/helpers';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { useRegionBranchesData } from '../hooks/useRegionBranchesData';

interface BranchStats {
  id: string;
  name: string;
  city: string;
  totalItems: number;
  teshirStock: number;
  expiredCount: number;
  averageScore: number;
}

export const RegionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setBranch } = useStore();
  const regionId = useAuthStore(state => state.regionId);
  const { branches, loading } = useRegionBranchesData();

  const branchesStats = useMemo<BranchStats[]>(() => {
    const statsArray = branches.map((branch) => {
      let teshirStock = 0;
      let expiredCount = 0;

      branch.inventory.forEach((item: any) => {
        if (item.category === 'Teşhir Dolabı') teshirStock++;
        if (getDaysRemaining(item.expirationDate) <= 0) expiredCount++;
      });

      let averageScore = 0;
      if (branch.quizResults.length > 0) {
        const sum = branch.quizResults.reduce((acc, r) => acc + (r.score || 0), 0);
        averageScore = Math.round(sum / branch.quizResults.length);
      }

      return {
        id: branch.id,
        name: branch.name,
        city: branch.city,
        totalItems: branch.inventory.length,
        teshirStock,
        expiredCount,
        averageScore
      };
    });

    // Sort descending by expiredCount
    statsArray.sort((a, b) => b.expiredCount - a.expiredCount);
    return statsArray;
  }, [branches]);

  const maxTotalItems = Math.max(...branchesStats.map(s => s.totalItems), 60);

  const handleExportCSV = async () => {
    let csv = "﻿Şube,Şehir,Toplam Stok,Teşhir Dolabı,Tarihi Geçen,Eğitim Ortalaması\n";
    branchesStats.forEach(stat => {
      csv += `"${stat.name}","${stat.city}",${stat.totalItems},${stat.teshirStock},${stat.expiredCount},${stat.averageScore}%\n`;
    });

    const fileName = `bolge_ozeti_${regionId}_${new Date().toISOString().split('T')[0]}.csv`;
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: csv,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });
      await Share.share({
        title: 'Bölge Özeti',
        text: 'Ekteki bölge özeti CSV dosyasını bulabilirsiniz.',
        url: result.uri,
        dialogTitle: 'CSV Dosyasını Paylaş'
      });
    } catch (e) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-surface-1 rounded-lg border border-surface-border">
        <div className="text-[11px] uppercase text-gold font-bold tracking-wide flex justify-between">
          <span>BÖLGE MÜDÜRÜ</span>
          <button onClick={handleExportCSV} className="bg-transparent border-none text-ink cursor-pointer font-bold">
            Özeti CSV İndir
          </button>
        </div>
        <h2 className="text-xl text-content mt-1 font-extrabold">
          Tüm Şubeler Canlı Durum
        </h2>
        <p className="text-[13px] text-content-muted mt-1">
          Şubelerin anlık stok durumlarını inceleyin ve detaylar için şubeye tıklayın.
        </p>
      </div>

      <button
        onClick={() => navigate('/reports')}
        className="flex items-center justify-center gap-3 w-full bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl py-4 px-4 font-bold shadow-sm hover:bg-purple-100 active:scale-95 transition-transform"
      >
        <span className="text-2xl">📊</span> Raporlar ve Analizler
      </button>

      <div className="flex flex-col gap-3">
        {branchesStats.length === 0 && (
          <div className="text-center py-5 text-content-muted">Bu bölgeye ait şube bulunamadı.</div>
        )}
        {branchesStats.map((stats) => {
          const teshirWidth = Math.min((stats.teshirStock / maxTotalItems) * 100, 100);

          return (
            <div
              key={stats.id}
              onClick={() => {
                setBranch(stats.id);
                localStorage.setItem('skt_branch_id', stats.id);
              }}
              className="bg-surface-1 border border-surface-border rounded-lg p-4 cursor-pointer flex flex-col gap-3 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-base font-extrabold text-ink">
                    {stats.name}
                  </div>
                  <div className="text-[11px] text-content-muted">
                    {stats.city}
                  </div>
                </div>
                <div className="flex gap-2.5 text-xs font-semibold">
                  <div className="flex flex-col items-end">
                    <span className="text-content-muted">Eğitim Ort.</span>
                    <span className={stats.averageScore >= 80 ? 'text-success' : 'text-warning'}>%{stats.averageScore}</span>
                  </div>
                </div>
              </div>

              {stats.expiredCount > 0 && (
                <div className="p-2 bg-danger-bg rounded-lg border border-danger-border text-xs text-danger font-semibold">
                  ⚠️ {stats.expiredCount} tarihi geçen ürün var!
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-semibold">
                    <span className="text-content-muted">Teşhir Dolabı</span>
                    <span className="text-content">{stats.teshirStock} çeşit</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${teshirWidth}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
