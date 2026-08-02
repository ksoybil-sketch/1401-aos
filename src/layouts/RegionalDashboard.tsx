import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useAuthStore } from '../store/useStore';
import { getDaysRemaining } from '../utils/helpers';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { useRegionBranchesData } from '../hooks/useRegionBranchesData';
import { Icon } from '../components/Icon';
import {
  btn, btnSecondary, btnSm, cardInteractive, fullscreenLoader, iconChip,
  listGroup, listRow, rowChevron, screenTitle, sectionLabel, spinner
} from '../constants/ui';

interface BranchStats {
  id: string;
  name: string;
  city: string;
  totalItems: number;
  teshirStock: number;
  expiredCount: number;
  averageScore: number;
  /** Tamamlanan sınav sayısı — 0 ise ortalama puan anlamsızdır. */
  quizCount: number;
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
        averageScore,
        quizCount: branch.quizResults.length
      };
    });

    // Sort descending by expiredCount
    statsArray.sort((a, b) => b.expiredCount - a.expiredCount);
    return statsArray;
  }, [branches]);

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
        <div className={`${spinner} w-8 h-8`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex justify-between items-center gap-3 mt-0.5">
        <h2 className={screenTitle}>Bölge</h2>
        <button onClick={handleExportCSV} className={`${btn} ${btnSecondary} ${btnSm} shrink-0`}>
          <Icon name="download" size={14} />
          CSV
        </button>
      </div>

      <div className={listGroup}>
        <button onClick={() => navigate('/reports')} className={listRow}>
          <span className={iconChip()}>
            <Icon name="chart" size={16} />
          </span>
          <span className="flex-1 text-[15px] font-medium text-crema">Raporlar ve Analizler</span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>
        <button onClick={() => navigate('/recipes')} className={listRow}>
          <span className={iconChip()}>
            <Icon name="book" size={16} />
          </span>
          <span className="flex-1 text-[15px] font-medium text-crema">Reçeteler</span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>
        <button onClick={() => navigate('/broadcast')} className={listRow}>
          <span className={iconChip()}>
            <Icon name="bell" size={16} />
          </span>
          <span className="flex-1 text-[15px] font-medium text-crema">Duyuru Gönder</span>
          <Icon name="chevronRight" size={16} className={rowChevron} />
        </button>
      </div>

      <div className={`${sectionLabel} mt-1`}>Şubeler</div>

      <div className="flex flex-col gap-2.5">
        {branchesStats.length === 0 && (
          <div className="text-center py-6 text-fg-3 text-[13px]">Bu bölgeye ait şube bulunamadı.</div>
        )}
        {branchesStats.map((stats) => (
          <div
            key={stats.id}
            onClick={() => {
              setBranch(stats.id);
              localStorage.setItem('skt_branch_id', stats.id);
            }}
            className={`${cardInteractive} p-4 flex flex-col gap-3`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-crema truncate">{stats.name}</div>
                {stats.city && <div className="text-[12px] text-fg-3 mt-0.5">{stats.city}</div>}
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[11px] text-fg-3">Eğitim</span>
                {/* Hiç sınav yapılmamışsa 0 puan göstermek "şube kötü" gibi
                    okunuyor; veri yokluğunu nötr bir tire ile ayırıyoruz. */}
                <span
                  className={`text-[14px] font-semibold tnum ${
                    stats.quizCount === 0
                      ? 'text-fg-3'
                      : stats.averageScore >= 80
                        ? 'text-positive'
                        : 'text-caution'
                  }`}
                >
                  {stats.quizCount === 0 ? '—' : stats.averageScore}
                </span>
              </div>
            </div>

            {stats.expiredCount > 0 && (
              <div className="flex items-center gap-2 py-2 px-2.5 bg-negative-bg rounded-lg border border-negative-line">
                <Icon name="alert" size={14} className="text-negative" />
                <span className="text-[12px] text-negative font-medium">
                  {stats.expiredCount} tarihi geçen ürün
                </span>
              </div>
            )}

            <div className="flex gap-5 border-t border-line pt-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-fg-3">Toplam stok</span>
                <span className="text-[14px] font-medium text-crema tnum">{stats.totalItems}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-fg-3">Teşhir dolabı</span>
                <span className="text-[14px] font-medium text-crema tnum">{stats.teshirStock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
