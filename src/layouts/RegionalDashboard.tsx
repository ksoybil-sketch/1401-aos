import React, { useEffect, useState } from 'react';
import { useStore, useAuthStore } from '../store/useStore';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../api/firebase';
import { getDaysRemaining } from '../utils/helpers';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

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
  const { setBranch } = useStore();
  const regionId = useAuthStore(state => state.regionId);
  const [branchesStats, setBranchesStats] = useState<BranchStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!regionId || !db) return;
      
      try {
        const branchesRef = ref(db, 'branches');
        const q = query(branchesRef, orderByChild('regionId'), equalTo(regionId));
        const snapshot = await get(q);
        
        if (snapshot.exists()) {
          const branchesData = snapshot.val();
          const statsArray: BranchStats[] = [];

          for (const [branchId, branch] of Object.entries<any>(branchesData)) {
            let totalItems = 0;
            let teshirStock = 0;
            let expiredCount = 0;
            
            if (branch.inventory) {
              const invArray = Array.isArray(branch.inventory) ? branch.inventory : Object.values(branch.inventory);
              totalItems = invArray.length;
              
              invArray.forEach((item: any) => {
                if (item.category === 'Teşhir Dolabı') teshirStock++;
                if (getDaysRemaining(item.expirationDate) <= 0) expiredCount++;
              });
            }

            // Average score calculation (assuming training results might be stored under branch.training or similar, 
            // but since it's not strictly defined in Firebase yet, we'll try to find it or default to 0)
            let averageScore = 0;
            if (branch.training && branch.training.quizResults) {
               const results = Array.isArray(branch.training.quizResults) ? branch.training.quizResults : Object.values(branch.training.quizResults);
               if (results.length > 0) {
                 const sum = results.reduce((acc: number, r: any) => acc + (r.score || 0), 0);
                 averageScore = Math.round(sum / results.length);
               }
            } else {
               // Fallback if not found, use a mock or 0
               averageScore = 0; 
            }

            statsArray.push({
              id: branchId,
              name: branch.name || 'Bilinmeyen Şube',
              city: branch.city || 'Belirtilmedi',
              totalItems,
              teshirStock,
              expiredCount,
              averageScore
            });
          }

          // Sort descending by expiredCount
          statsArray.sort((a, b) => b.expiredCount - a.expiredCount);
          setBranchesStats(statsArray);
        }
      } catch (error) {
        console.error("Firebase bölge verisi çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [regionId]);

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
