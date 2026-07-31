import React from 'react';
import { formatDate } from '../../utils/helpers';
import { useStore } from '../../store/useStore';

export const BaristaPerformanceReport: React.FC = () => {
  const { quizResults } = useStore();
  const safeResults = quizResults || [];
  
  const averageScore = safeResults.length > 0
    ? Math.round(safeResults.reduce((acc, r) => acc + r.score, 0) / safeResults.length)
    : 0;

  return (
    <div className="report-container">
      <div className="report-header-card">
        <div className="report-subtitle">
          ŞUBE MÜDÜRÜ RAPORU
        </div>
        <h2 className="report-title">
          🎓 Barista Eğitim ve Sınav Performansı
        </h2>
        <p className="report-desc">
          Şubenizde görev yapan baristaların reçete bilgisi sınav sonuçları ve başarı oranları.
        </p>
      </div>

      {/* Ortalama Başarı Kartı */}
      <div className="report-stats-row">
        <div className="report-stat-card">
          <div 
            className="report-stat-value"
            style={{ color: averageScore >= 80 ? 'var(--success)' : 'var(--warning)' }}
          >
            %{averageScore}
          </div>
          <div className="report-stat-label">
            Şube Ortalama Puanı
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-value" style={{ color: 'var(--primary)' }}>
            {safeResults.length}
          </div>
          <div className="report-stat-label">
            Tamamlanan Sınav
          </div>
        </div>
      </div>

      {/* Sınav Dereceleri Listesi */}
      <div className="inventory-list">
        <div className="list-header">
          <span className="list-title">Barista Sınav Sonuçları</span>
        </div>

        {safeResults.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Henüz baristalar tarafından tamamlanmış sınav bulunmuyor.</p>
          </div>
        ) : (
          safeResults.map((result) => (
            <div
              key={result.id}
              className="inventory-item"
              style={{ borderLeft: `4px solid ${result.score >= 80 ? 'var(--success)' : 'var(--warning)'}` }}
            >
              <div className="item-top">
                <div className="item-info">
                  <span className="item-name">{result.baristaName}</span>
                  <div className="item-meta">
                    <span>Tarih: {formatDate(result.date)}</span>
                  </div>
                </div>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: result.score >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                    color: result.score >= 80 ? 'var(--success)' : 'var(--warning)'
                  }}
                >
                  {result.score} Puan ({result.correctAnswers}/{result.totalQuestions})
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
