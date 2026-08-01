import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegionBranchesData } from '../../hooks/useRegionBranchesData';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Icon } from '../../components/Icon';
import {
  btn, btnSecondary, btnSm, card, fullscreenLoader, screenTitle, sectionLabel, spinner
} from '../../constants/ui';

interface BranchLogEntry {
  branchName: string;
  date: string;
  productName: string;
  quantity: number;
}

const logRow = 'flex justify-between items-center gap-3 px-4 py-2.5 text-[14px]';

export const RegionalReportsView: React.FC = () => {
  const navigate = useNavigate();
  const { branches, loading } = useRegionBranchesData();

  const { expiredLogs, consumedLogs, branchBreakdown } = useMemo(() => {
    const expired: BranchLogEntry[] = [];
    const consumed: BranchLogEntry[] = [];
    const breakdown: { branchName: string; expiredCount: number; consumedCount: number }[] = [];

    branches.forEach((branch) => {
      let branchExpired = 0;
      let branchConsumed = 0;

      branch.transactionLog.forEach((log) => {
        const entry: BranchLogEntry = {
          branchName: branch.name,
          date: log.date,
          productName: log.productName,
          quantity: log.quantity
        };
        if (log.type === 'EXPIRED') {
          expired.push(entry);
          branchExpired++;
        } else if (log.type === 'CONSUMED') {
          consumed.push(entry);
          branchConsumed++;
        }
      });

      breakdown.push({ branchName: branch.name, expiredCount: branchExpired, consumedCount: branchConsumed });
    });

    expired.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    consumed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { expiredLogs: expired, consumedLogs: consumed, branchBreakdown: breakdown };
  }, [branches]);

  const handleExportCSV = async () => {
    let csv = '﻿Şube,Tür,Ürün,Miktar,Tarih\n';
    expiredLogs.forEach((log) => {
      csv += `"${log.branchName}","Zayi","${log.productName}",${log.quantity},"${new Date(log.date).toLocaleDateString('tr-TR')}"\n`;
    });
    consumedLogs.forEach((log) => {
      csv += `"${log.branchName}","Tüketildi","${log.productName}",${log.quantity},"${new Date(log.date).toLocaleDateString('tr-TR')}"\n`;
    });

    const fileName = `bolge_raporu_${new Date().toISOString().split('T')[0]}.csv`;
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: csv,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });
      await Share.share({
        title: 'Bölge Raporu',
        text: 'Ekteki bölge raporu CSV dosyasını bulabilirsiniz.',
        url: result.uri,
        dialogTitle: 'CSV Dosyasını Paylaş'
      });
    } catch (e) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
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
        <h2 className={screenTitle}>Bölge Raporu</h2>
        <button onClick={handleExportCSV} className={`${btn} ${btnSecondary} ${btnSm} shrink-0`}>
          <Icon name="download" size={14} />
          CSV
        </button>
      </div>

      {/* Şube bazlı kırılım */}
      <div className={sectionLabel}>Şube özeti</div>
      <div className={card}>
        <ul className="p-0 m-0 list-none divide-y divide-line">
          {branchBreakdown.length === 0 ? (
            <li className="px-4 py-3.5 text-[13px] text-fg-3">Bu bölgeye ait şube bulunamadı.</li>
          ) : (
            branchBreakdown.map((b) => (
              <li key={b.branchName} className={logRow}>
                <span className="text-crema min-w-0 truncate">{b.branchName}</span>
                <span className="flex gap-3 shrink-0 tnum">
                  <span className="text-negative">{b.expiredCount} zayi</span>
                  <span className="text-positive">{b.consumedCount} tüketim</span>
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Zayi */}
      <div className={sectionLabel}>Zayi</div>
      <div className={card}>
        <ul className="p-0 m-0 list-none divide-y divide-line">
          {expiredLogs.length === 0 ? (
            <li className="px-4 py-3.5 text-[13px] text-fg-3">Zayi kaydı bulunmuyor.</li>
          ) : (
            expiredLogs.map((log, idx) => (
              <li key={idx} className={logRow}>
                <span className="min-w-0 truncate">
                  <span className="text-crema">{log.productName}</span>
                  <span className="text-fg-3"> · {log.branchName}</span>
                </span>
                <span className="font-medium text-negative shrink-0 tnum">{log.quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Tüketilenler */}
      <div className={sectionLabel}>Tüketilenler</div>
      <div className={card}>
        <ul className="p-0 m-0 list-none divide-y divide-line">
          {consumedLogs.length === 0 ? (
            <li className="px-4 py-3.5 text-[13px] text-fg-3">Tüketim kaydı bulunmuyor.</li>
          ) : (
            consumedLogs.map((log, idx) => (
              <li key={idx} className={logRow}>
                <span className="min-w-0 truncate">
                  <span className="text-crema">{log.productName}</span>
                  <span className="text-fg-3"> · {log.branchName}</span>
                </span>
                <span className="font-medium text-positive shrink-0 tnum">{log.quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
