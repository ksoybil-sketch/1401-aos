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
    let csv = "\uFEFFŞube,Şehir,Toplam Stok,Teşhir Dolabı,Tarihi Geçen,Eğitim Ortalaması\n";
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '16px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>BÖLGE MÜDÜRÜ</span>
          <button onClick={handleExportCSV} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>
            Özeti CSV İndir
          </button>
        </div>
        <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginTop: '4px', fontWeight: 800 }}>
          Tüm Şubeler Canlı Durum
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Şubelerin anlık stok durumlarını inceleyin ve detaylar için şubeye tıklayın.
        </p>
      </div>

      <button
        onClick={() => navigate('/reports')}
        className="flex items-center justify-center gap-3 w-full bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl py-4 px-4 font-bold shadow-sm hover:bg-purple-100 active:scale-95 transition-transform"
      >
        <span className="text-2xl">📊</span> Raporlar ve Analizler
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {branchesStats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Bu bölgeye ait şube bulunamadı.</div>
        )}
        {branchesStats.map((stats) => {
          const totalWidth = Math.min((stats.totalItems / maxTotalItems) * 100, 100);
          const teshirWidth = Math.min((stats.teshirStock / maxTotalItems) * 100, 100);

          return (
            <div
              key={stats.id}
              onClick={() => {
                setBranch(stats.id);
                localStorage.setItem('skt_branch_id', stats.id);
              }}
              style={{
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                    {stats.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {stats.city}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Eğitim Ort.</span>
                    <span style={{ color: stats.averageScore >= 80 ? 'var(--success)' : 'var(--warning)' }}>%{stats.averageScore}</span>
                  </div>
                </div>
              </div>

              {stats.expiredCount > 0 && (
                <div style={{ padding: '8px', backgroundColor: 'var(--danger-bg)', borderRadius: '8px', border: '1px solid var(--danger-border)', fontSize: '12px', color: 'var(--danger)', fontWeight: 600 }}>
                  ⚠️ {stats.expiredCount} tarihi geçen ürün var!
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Toplam Stok</span>
                    <span style={{ color: 'var(--text-main)' }}>{stats.totalItems} çeşit</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--surface-2)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${totalWidth}%`, backgroundColor: 'var(--primary)', borderRadius: '100px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Teşhir Dolabı</span>
                    <span style={{ color: 'var(--text-main)' }}>{stats.teshirStock} çeşit</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--surface-2)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${teshirWidth}%`, backgroundColor: 'var(--accent)', borderRadius: '100px' }}></div>
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
