import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { useStore } from '../../store/useStore';
import { QuizResult } from '../../types';
import { Icon } from '../../components/Icon';
import {
  card, emptyState, emptyText, iconBtn, iconChip, listGroup, listRow,
  modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle,
  rowChevron, sectionLabel
} from '../../constants/ui';

export const BaristaPerformanceReport: React.FC = () => {
  const { quizResults } = useStore();
  const safeResults = quizResults || [];
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  const averageScore = safeResults.length > 0
    ? Math.round(safeResults.reduce((acc, r) => acc + r.score, 0) / safeResults.length)
    : 0;

  return (
    <div className="flex flex-col gap-3.5">
      <div className={sectionLabel}>Barista Performansı</div>

      {/* Özet */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className={`${card} p-4 text-center`}>
          <div className={`text-[26px] font-semibold tnum tracking-tight ${averageScore >= 80 ? 'text-positive' : 'text-caution'}`}>
            {averageScore}
          </div>
          <div className="text-[11px] text-fg-3 mt-0.5">Şube ortalaması</div>
        </div>

        <div className={`${card} p-4 text-center`}>
          <div className="text-[26px] font-semibold tnum tracking-tight text-crema">
            {safeResults.length}
          </div>
          <div className="text-[11px] text-fg-3 mt-0.5">Tamamlanan sınav</div>
        </div>
      </div>

      {/* Sonuç listesi */}
      {safeResults.length === 0 ? (
        <div className={emptyState}>
          <Icon name="cap" size={26} className="text-fg-3" />
          <p className={emptyText}>Henüz tamamlanmış sınav bulunmuyor.</p>
        </div>
      ) : (
        <div className={listGroup}>
          {safeResults.map((result) => (
            <button key={result.id} className={listRow} onClick={() => setSelectedResult(result)}>
              <span className={iconChip(result.score >= 80 ? 'positive' : 'caution')}>
                <Icon name="user" size={16} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-medium text-crema truncate">{result.baristaName}</span>
                <span className="block text-[12px] text-fg-3 mt-0.5 tnum">{formatDate(result.date)}</span>
              </span>
              <span className={`text-[14px] font-semibold tnum shrink-0 ${result.score >= 80 ? 'text-positive' : 'text-caution'}`}>
                {result.score}
              </span>
              <Icon name="chevronRight" size={16} className={rowChevron} />
            </button>
          ))}
        </div>
      )}

      {selectedResult && (
        <div className={modalOverlay} onClick={() => setSelectedResult(null)}>
          <div className={modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={modalGrabber} />
            <div className={modalHeader}>
              <h2 className={modalTitle}>{selectedResult.baristaName}</h2>
              <button onClick={() => setSelectedResult(null)} className={iconBtn} aria-label="Kapat">
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className={modalBody}>
              <p className="text-[13px] text-fg-3 mb-4 tnum">
                {formatDate(selectedResult.date)} · {selectedResult.score} puan
                {' '}({selectedResult.correctAnswers}/{selectedResult.totalQuestions})
              </p>

              {!selectedResult.wrongAnswers ? (
                <p className="text-[14px] text-fg-3 leading-relaxed">
                  Bu sınav için detaylı kayıt bulunmuyor (eski bir sonuç olabilir).
                </p>
              ) : selectedResult.wrongAnswers.length === 0 ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-positive-line bg-positive-bg px-3.5 py-3">
                  <Icon name="check" size={16} className="text-positive" />
                  <span className="text-[14px] text-positive font-medium">Hiç yanlış cevap yok</span>
                </div>
              ) : (
                <>
                  <div className={`${sectionLabel} mb-2 px-0`}>Yanlış cevaplar</div>
                  <ul className="p-0 m-0 list-none flex flex-col gap-2.5">
                    {selectedResult.wrongAnswers.map((wa, idx) => (
                      <li key={idx} className="p-3.5 rounded-xl border border-line bg-panel">
                        <div className="text-[14px] font-medium text-crema">{wa.recipeName}</div>
                        <div className="text-[13px] text-fg-3 mt-1 mb-2.5 leading-relaxed">{wa.questionText}</div>
                        <div className="flex flex-col gap-1 text-[13px]">
                          <span className="text-negative">Verdiği: {wa.userAnswer}</span>
                          <span className="text-positive">Doğrusu: {wa.correctAnswer}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
