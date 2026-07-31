import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegionBranchesData } from '../../hooks/useRegionBranchesData';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

interface BranchLogEntry {
  branchName: string;
  date: string;
  productName: string;
  quantity: number;
}

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
    return <div className="p-5 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center px-0.5 mb-4">
        <span className="text-[15px] font-bold text-ink tracking-tight">📊 Bölge Analiz ve Raporları</span>
        <button
          onClick={() => navigate('/')}
          className="bg-transparent border-none text-content-secondary text-[13px] cursor-pointer font-semibold"
        >
          Ana Ekran
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Şube Bazlı Kırılım */}
        <div className="bg-surface-1 p-4 rounded-lg border border-surface-border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="m-0 text-content text-base">🏢 Şube Bazlı Özet</h3>
            <button onClick={handleExportCSV} className="bg-transparent border-none text-ink cursor-pointer font-bold text-xs">
              CSV İndir
            </button>
          </div>
          {branchBreakdown.length === 0 ? (
            <p className="text-content-secondary text-sm m-0">Bu bölgeye ait şube bulunamadı.</p>
          ) : (
            <ul className="p-0 m-0 list-none">
              {branchBreakdown.map((b) => (
                <li key={b.branchName} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
                  <span><strong>{b.branchName}</strong></span>
                  <span className="flex gap-3">
                    <span className="text-danger font-bold">Zayi: {b.expiredCount}</span>
                    <span className="text-success font-bold">Tüketilen: {b.consumedCount}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Zayi Raporu */}
        <div className="bg-surface-1 p-4 rounded-lg border border-[rgba(255,107,107,0.2)]">
          <h3 className="mt-0 text-danger text-base mb-3">🔴 Çöpe Gidenler (Zayi)</h3>
          <ul className="p-0 m-0 list-none">
            {expiredLogs.length === 0 ? (
              <p className="text-content-secondary text-sm m-0">Zayi kaydı bulunmuyor.</p>
            ) : (
              expiredLogs.map((log, idx) => (
                <li key={idx} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong> <span className="text-content-muted">({log.branchName})</span></span>
                  <span className="font-bold text-danger">{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Satılanlar / Tüketilenler Raporu */}
        <div className="bg-surface-1 p-4 rounded-lg border border-[rgba(52,201,135,0.2)]">
          <h3 className="mt-0 text-success text-base mb-3">🟢 Tüketilenler / Satılanlar</h3>
          <ul className="p-0 m-0 list-none">
            {consumedLogs.length === 0 ? (
              <p className="text-content-secondary text-sm m-0">Tüketim kaydı bulunmuyor.</p>
            ) : (
              consumedLogs.map((log, idx) => (
                <li key={idx} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong> <span className="text-content-muted">({log.branchName})</span></span>
                  <span className="font-bold text-success">{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
