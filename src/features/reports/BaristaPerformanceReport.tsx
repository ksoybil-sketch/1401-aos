import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { useStore } from '../../store/useStore';
import { QuizResult } from '../../types';

export const BaristaPerformanceReport: React.FC = () => {
  const { quizResults } = useStore();
  const safeResults = quizResults || [];
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  
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
              style={{ borderLeft: `4px solid ${result.score >= 80 ? 'var(--success)' : 'var(--warning)'}`, cursor: 'pointer' }}
              onClick={() => setSelectedResult(result)}
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

      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedResult.baristaName} — Yanlış Cevaplar</h2>
              <button onClick={() => setSelectedResult(null)} className="btn-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-inner">
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {formatDate(selectedResult.date)} tarihli sınav — {selectedResult.score} Puan ({selectedResult.correctAnswers}/{selectedResult.totalQuestions})
              </p>

              {!selectedResult.wrongAnswers ? (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Bu sınav için detaylı kayıt bulunmuyor (eski bir sonuç olabilir).
                </p>
              ) : selectedResult.wrongAnswers.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--success)', fontWeight: 600 }}>
                  🎉 Hiç yanlış cevap yok, tam puan!
                </p>
              ) : (
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedResult.wrongAnswers.map((wa, idx) => (
                    <li key={idx} style={{ padding: '12px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{wa.recipeName}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{wa.questionText}</div>
                      <div style={{ fontSize: '13px' }}>
                        <span style={{ color: 'var(--danger)' }}>Verdiği cevap: <strong>{wa.userAnswer}</strong></span>
                        {' — '}
                        <span style={{ color: 'var(--success)' }}>Doğrusu: <strong>{wa.correctAnswer}</strong></span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
