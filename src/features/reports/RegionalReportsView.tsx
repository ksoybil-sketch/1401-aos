import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegionBranchesData } from '../../hooks/useRegionBranchesData';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { card, fullscreenLoader, screenTitle, spinner } from '../../constants/ui';

interface BranchLogEntry {
  branchName: string;
  date: string;
  productName: string;
  quantity: number;
}

const logRow = 'flex justify-between items-center gap-3 py-2.5 border-b border-hairline last:border-b-0 text-sm';

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
        <div className={`${spinner} w-11 h-11`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
        <h2 className={screenTitle}>📊 Bölge Raporları</h2>
        <button
          onClick={() => navigate('/')}
          className="text-content-muted text-[13px] font-semibold cursor-pointer transition-colors hover:text-gold shrink-0"
        >
          Ana Ekran
        </button>
      </div>

      {/* Şube Bazlı Kırılım */}
      <div className={`${card} p-5`}>
        <div className="flex justify-between items-center gap-3 mb-3">
          <h3 className="text-content text-[15px] font-bold">🏢 Şube Bazlı Özet</h3>
          <button
            onClick={handleExportCSV}
            className="text-gold cursor-pointer font-bold text-xs transition-opacity hover:opacity-75 shrink-0"
          >
            CSV İndir
          </button>
        </div>
        {branchBreakdown.length === 0 ? (
          <p className="text-content-muted text-sm m-0">Bu bölgeye ait şube bulunamadı.</p>
        ) : (
          <ul className="p-0 m-0 list-none">
            {branchBreakdown.map((b) => (
              <li key={b.branchName} className={logRow}>
                <strong className="text-content min-w-0 truncate">{b.branchName}</strong>
                <span className="flex gap-3 shrink-0">
                  <span className="text-danger font-bold">Zayi: {b.expiredCount}</span>
                  <span className="text-success font-bold">Tüketilen: {b.consumedCount}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Zayi Raporu */}
      <div className={`${card} p-5 border-danger-border`}>
        <h3 className="text-danger text-[15px] font-bold mb-3">🔴 Çöpe Gidenler (Zayi)</h3>
        <ul className="p-0 m-0 list-none">
          {expiredLogs.length === 0 ? (
            <p className="text-content-muted text-sm m-0">Zayi kaydı bulunmuyor.</p>
          ) : (
            expiredLogs.map((log, idx) => (
              <li key={idx} className={logRow}>
                <span className="text-content-secondary min-w-0 truncate">
                  {new Date(log.date).toLocaleDateString('tr-TR')} — <strong className="text-content">{log.productName}</strong>
                  {' '}<span className="text-content-muted">({log.branchName})</span>
                </span>
                <span className="font-bold text-danger shrink-0">{log.quantity} Adet</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Satılanlar / Tüketilenler Raporu */}
      <div className={`${card} p-5 border-success-border`}>
        <h3 className="text-success text-[15px] font-bold mb-3">🟢 Tüketilenler / Satılanlar</h3>
        <ul className="p-0 m-0 list-none">
          {consumedLogs.length === 0 ? (
            <p className="text-content-muted text-sm m-0">Tüketim kaydı bulunmuyor.</p>
          ) : (
            consumedLogs.map((log, idx) => (
              <li key={idx} className={logRow}>
                <span className="text-content-secondary min-w-0 truncate">
                  {new Date(log.date).toLocaleDateString('tr-TR')} — <strong className="text-content">{log.productName}</strong>
                  {' '}<span className="text-content-muted">({log.branchName})</span>
                </span>
                <span className="font-bold text-success shrink-0">{log.quantity} Adet</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
