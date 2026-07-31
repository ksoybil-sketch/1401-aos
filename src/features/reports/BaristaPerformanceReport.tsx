import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { useStore } from '../../store/useStore';
import { QuizResult } from '../../types';
import {
  card, cardInteractive, emptyState, emptyText, eyebrow, iconBtn,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

export const BaristaPerformanceReport: React.FC = () => {
  const { quizResults } = useStore();
  const safeResults = quizResults || [];
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  const averageScore = safeResults.length > 0
    ? Math.round(safeResults.reduce((acc, r) => acc + r.score, 0) / safeResults.length)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className={`${card} p-5`}>
        <div className={eyebrow}>Şube Müdürü Raporu</div>
        <h2 className="text-lg font-extrabold text-content mt-2 tracking-tight">
          🎓 Barista Eğitim ve Sınav Performansı
        </h2>
        <p className="text-[13px] text-content-secondary leading-relaxed mt-2">
          Şubenizde görev yapan baristaların reçete bilgisi sınav sonuçları ve başarı oranları.
        </p>
      </div>

      {/* Ortalama Başarı Kartı */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${card} p-5 text-center`}>
          <div className={`text-3xl font-extrabold tracking-tight ${averageScore >= 80 ? 'text-success' : 'text-warning'}`}>
            %{averageScore}
          </div>
          <div className="text-[10px] text-content-muted font-bold uppercase tracking-[0.1em] mt-1.5">
            Şube Ortalama Puanı
          </div>
        </div>

        <div className={`${card} p-5 text-center`}>
          <div className="text-3xl font-extrabold tracking-tight text-gold">
            {safeResults.length}
          </div>
          <div className="text-[10px] text-content-muted font-bold uppercase tracking-[0.1em] mt-1.5">
            Tamamlanan Sınav
          </div>
        </div>
      </div>

      {/* Sınav Dereceleri Listesi */}
      <div className="flex flex-col gap-3">
        <div className={eyebrow}>Barista Sınav Sonuçları</div>

        {safeResults.length === 0 ? (
          <div className={emptyState}>
            <p className={emptyText}>Henüz baristalar tarafından tamamlanmış sınav bulunmuyor.</p>
          </div>
        ) : (
          safeResults.map((result) => (
            <div
              key={result.id}
              className={`${cardInteractive} p-4 pl-5 flex justify-between items-center gap-3 border-l-4 ${
                result.score >= 80 ? 'border-l-success' : 'border-l-warning'
              }`}
              onClick={() => setSelectedResult(result)}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold text-content truncate">{result.baristaName}</span>
                <span className="text-[11px] text-content-muted mt-1">Tarih: {formatDate(result.date)}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 border ${
                  result.score >= 80
                    ? 'bg-success-bg text-success border-success-border'
                    : 'bg-warning-bg text-warning border-warning-border'
                }`}
              >
                {result.score} Puan ({result.correctAnswers}/{result.totalQuestions})
              </span>
            </div>
          ))
        )}
      </div>

      {selectedResult && (
        <div className={modalOverlay} onClick={() => setSelectedResult(null)}>
          <div className={modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <h2 className={modalTitle}>{selectedResult.baristaName} — Yanlış Cevaplar</h2>
              <button onClick={() => setSelectedResult(null)} className={iconBtn} aria-label="Kapat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={modalBody}>
              <p className="text-[13px] text-content-muted mb-5">
                {formatDate(selectedResult.date)} tarihli sınav — {selectedResult.score} Puan ({selectedResult.correctAnswers}/{selectedResult.totalQuestions})
              </p>

              {!selectedResult.wrongAnswers ? (
                <p className="text-sm text-content-muted">
                  Bu sınav için detaylı kayıt bulunmuyor (eski bir sonuç olabilir).
                </p>
              ) : selectedResult.wrongAnswers.length === 0 ? (
                <p className="text-sm text-success font-semibold">
                  🎉 Hiç yanlış cevap yok, tam puan!
                </p>
              ) : (
                <ul className="p-0 m-0 list-none flex flex-col gap-3">
                  {selectedResult.wrongAnswers.map((wa, idx) => (
                    <li key={idx} className="p-4 bg-danger-bg border border-danger-border rounded-2xl">
                      <div className="text-[13px] font-bold text-content mb-1.5">{wa.recipeName}</div>
                      <div className="text-[13px] text-content-muted mb-2.5 leading-relaxed">{wa.questionText}</div>
                      <div className="text-[13px] flex flex-col gap-1">
                        <span className="text-danger">Verdiği cevap: <strong>{wa.userAnswer}</strong></span>
                        <span className="text-success">Doğrusu: <strong>{wa.correctAnswer}</strong></span>
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
