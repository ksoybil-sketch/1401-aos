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
    <div className="flex flex-col gap-4">
      <div className="bg-surface-1 rounded-lg p-[18px]">
        <div className="text-[11px] font-bold tracking-wide text-gold uppercase mb-1.5">
          ŞUBE MÜDÜRÜ RAPORU
        </div>
        <h2 className="text-[17px] font-extrabold text-content mb-2">
          🎓 Barista Eğitim ve Sınav Performansı
        </h2>
        <p className="text-[13px] text-content-secondary leading-relaxed">
          Şubenizde görev yapan baristaların reçete bilgisi sınav sonuçları ve başarı oranları.
        </p>
      </div>

      {/* Ortalama Başarı Kartı */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-1 rounded-lg p-4 text-center">
          <div className={`text-2xl font-extrabold mb-1 ${averageScore >= 80 ? 'text-success' : 'text-warning'}`}>
            %{averageScore}
          </div>
          <div className="text-[11px] text-content-muted font-semibold uppercase">
            Şube Ortalama Puanı
          </div>
        </div>

        <div className="bg-surface-1 rounded-lg p-4 text-center">
          <div className="text-2xl font-extrabold mb-1 text-ink">
            {safeResults.length}
          </div>
          <div className="text-[11px] text-content-muted font-semibold uppercase">
            Tamamlanan Sınav
          </div>
        </div>
      </div>

      {/* Sınav Dereceleri Listesi */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-0.5">
          <span className="text-[15px] font-bold text-ink tracking-tight">Barista Sınav Sonuçları</span>
        </div>

        {safeResults.length === 0 ? (
          <div className="text-center py-12 px-5 bg-surface-1 border-[1.5px] border-dashed border-surface-border rounded-lg flex flex-col items-center gap-3">
            <p className="text-[13px] text-content-muted max-w-[240px] leading-relaxed">Henüz baristalar tarafından tamamlanmış sınav bulunmuyor.</p>
          </div>
        ) : (
          safeResults.map((result) => (
            <div
              key={result.id}
              className={`bg-surface-1 border border-surface-border rounded-lg py-3.5 px-3.5 pl-[18px] flex flex-col gap-2.5 transition cursor-pointer border-l-4 ${result.score >= 80 ? 'border-l-success' : 'border-l-warning'}`}
              onClick={() => setSelectedResult(result)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[15px] font-semibold text-content tracking-tight">{result.baristaName}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-content-muted mt-1">
                    <span>Tarih: {formatDate(result.date)}</span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap flex-shrink-0 ${result.score >= 80 ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                  {result.score} Puan ({result.correctAnswers}/{result.totalQuestions})
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedResult && (
        <div className="fixed inset-0 bg-black/65 z-[200] flex justify-center items-end animate-[fadeIn_0.2s_ease]" onClick={() => setSelectedResult(null)}>
          <div className="w-full max-w-[480px] bg-surface-1 rounded-t-xl pt-4 shadow-[0_20px_48px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto animate-[slideUp_0.35s_cubic-bezier(0.175,0.885,0.32,1.1)]" onClick={(e) => e.stopPropagation()}>
            <div className="w-9 h-1 rounded-full bg-surface-border mx-auto mb-4" />
            <div className="flex justify-between items-center px-5 pb-4 border-b border-surface-border-2 mb-5">
              <h2 className="text-[17px] font-bold text-ink tracking-tight">{selectedResult.baristaName} — Yanlış Cevaplar</h2>
              <button onClick={() => setSelectedResult(null)} className="bg-surface-2 border-none cursor-pointer text-content-muted flex items-center justify-center w-[30px] h-[30px] rounded-full transition active:bg-surface-border">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-10">
              <p className="text-[13px] text-content-muted mb-4">
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
                    <li key={idx} className="p-3 bg-danger-bg border border-danger-border rounded-md">
                      <div className="text-[13px] font-bold text-content mb-1.5">{wa.recipeName}</div>
                      <div className="text-[13px] text-content-muted mb-2">{wa.questionText}</div>
                      <div className="text-[13px]">
                        <span className="text-danger">Verdiği cevap: <strong>{wa.userAnswer}</strong></span>
                        {' — '}
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
