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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="list-header" style={{ marginBottom: '16px' }}>
        <span className="list-title">📊 Bölge Analiz ve Raporları</span>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
        >
          Ana Ekran
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Şube Bazlı Kırılım */}
        <div style={{ backgroundColor: 'var(--surface-1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '16px' }}>🏢 Şube Bazlı Özet</h3>
            <button onClick={handleExportCSV} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
              CSV İndir
            </button>
          </div>
          {branchBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Bu bölgeye ait şube bulunamadı.</p>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {branchBreakdown.map((b) => (
                <li key={b.branchName} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                  <span><strong>{b.branchName}</strong></span>
                  <span style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Zayi: {b.expiredCount}</span>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Tüketilen: {b.consumedCount}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Zayi Raporu */}
        <div style={{ backgroundColor: 'var(--surface-1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--danger)', fontSize: '16px', marginBottom: '12px' }}>🔴 Çöpe Gidenler (Zayi)</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {expiredLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Zayi kaydı bulunmuyor.</p>
            ) : (
              expiredLogs.map((log, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong> <span style={{ color: 'var(--text-muted)' }}>({log.branchName})</span></span>
                  <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Satılanlar / Tüketilenler Raporu */}
        <div style={{ backgroundColor: 'var(--surface-1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52, 201, 135, 0.2)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--success)', fontSize: '16px', marginBottom: '12px' }}>🟢 Tüketilenler / Satılanlar</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {consumedLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Tüketim kaydı bulunmuyor.</p>
            ) : (
              consumedLogs.map((log, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                  <span>{new Date(log.date).toLocaleDateString('tr-TR')} - <strong>{log.productName}</strong> <span style={{ color: 'var(--text-muted)' }}>({log.branchName})</span></span>
                  <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{log.quantity} Adet</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
