import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useAuthStore } from '../store/useStore';
import { getDaysRemaining } from '../utils/helpers';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { useRegionBranchesData } from '../hooks/useRegionBranchesData';
import {
  actionTile, card, cardInteractive, eyebrow, fullscreenLoader, spinner, tileBadge
} from '../constants/ui';

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
    return (
      <div className={fullscreenLoader}>
        <div className={`${spinner} w-11 h-11`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Bölge başlığı */}
      <div className={`${card} p-5`}>
        <div className="flex justify-between items-center gap-3">
          <span className={eyebrow}>Bölge Müdürü</span>
          <button
            onClick={handleExportCSV}
            className="text-gold cursor-pointer font-bold text-xs transition-opacity hover:opacity-75 shrink-0"
          >
            Özeti CSV İndir
          </button>
        </div>
        <h2 className="text-xl font-extrabold text-content mt-2 tracking-tight">
          Tüm Şubeler Canlı Durum
        </h2>
        <p className="text-[13px] text-content-muted mt-1.5 leading-relaxed">
          Şubelerin anlık stok durumlarını inceleyin ve detaylar için şubeye tıklayın.
        </p>
      </div>

      <button onClick={() => navigate('/reports')} className={actionTile('violet')}>
        <span className={tileBadge('violet')}>📊</span>
        <span className="flex-1 font-bold text-[15px] text-content">Raporlar ve Analizler</span>
        <span className="text-content-muted">›</span>
      </button>

      <div className={`${eyebrow} mt-1`}>Şubeler</div>

      <div className="flex flex-col gap-3">
        {branchesStats.length === 0 && (
          <div className="text-center py-6 text-content-muted text-sm">Bu bölgeye ait şube bulunamadı.</div>
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
              className={`${cardInteractive} p-5 flex flex-col gap-3.5`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="text-base font-extrabold text-content truncate">
                    {stats.name}
                  </div>
                  <div className="text-[11px] text-content-muted mt-0.5">
                    {stats.city}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] text-content-muted uppercase font-bold tracking-[0.08em]">Eğitim Ort.</span>
                  <span className={`text-sm font-bold ${stats.averageScore >= 80 ? 'text-success' : 'text-warning'}`}>
                    %{stats.averageScore}
                  </span>
                </div>
              </div>

              {stats.expiredCount > 0 && (
                <div className="py-2 px-3 bg-danger-bg rounded-xl border border-danger-border text-xs text-danger font-semibold">
                  ⚠️ {stats.expiredCount} tarihi geçen ürün var!
                </div>
              )}

              <div>
                <div className="flex justify-between text-[11px] mb-1.5 font-semibold">
                  <span className="text-content-muted">Teşhir Dolabı</span>
                  <span className="text-content">{stats.teshirStock} çeşit</span>
                </div>
                <div className="h-1.5 bg-glass-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold transition-all duration-500"
                    style={{ width: `${teshirWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
