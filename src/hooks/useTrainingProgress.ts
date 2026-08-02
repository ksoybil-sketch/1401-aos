import { useMemo } from 'react';
import { QuizResult } from '../types';
import { TRAINING_LEVELS, TrainingLevel, MAX_EXAMS_PER_WEEK } from '../constants/trainingLevels';

export interface TrainingProgress {
  currentLevel: TrainingLevel;
  isMaxLevel: boolean;
  examsThisWeek: number;
  weeklyLimitReached: boolean;
  /** Kotanın açılacağı an — en eski denemenin 7 günlük pencereden çıkacağı zaman. */
  nextSlotAt: Date | null;
}

/**
 * Bir baristanın reçete/eğitim sınav geçmişinden mevcut seviyesini ve
 * haftalık sınav hakkını hesaplar. Sunucu tarafında ayrı bir "progress"
 * kaydı tutmuyoruz — her şey zaten senkronize olan quizResults'tan türetiliyor.
 */
export function useTrainingProgress(baristaName: string | undefined, quizResults: QuizResult[]): TrainingProgress {
  return useMemo(() => {
    const myResults = quizResults.filter((r) => r.baristaName === baristaName);

    // Sıralı seviye kilidi: 1. seviyeden başlayarak geçilmemiş ilk seviye
    // mevcut seviyedir. Eski kayıtlarda levelId yoksa 'recipes' varsayılır.
    let currentLevel = TRAINING_LEVELS[TRAINING_LEVELS.length - 1];
    let isMaxLevel = true;
    for (const level of TRAINING_LEVELS) {
      const passed = myResults.some((r) => (r.levelId || 'recipes') === level.id && r.score >= level.passScore);
      if (!passed) {
        currentLevel = level;
        isMaxLevel = false;
        break;
      }
    }

    const DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const windowStart = now - 7 * DAY_MS;
    const recentAttempts = myResults
      .map((r) => new Date(r.date).getTime())
      .filter((t) => !Number.isNaN(t) && t >= windowStart)
      .sort((a, b) => a - b);

    const examsThisWeek = recentAttempts.length;
    const weeklyLimitReached = examsThisWeek >= MAX_EXAMS_PER_WEEK;
    const nextSlotAt = weeklyLimitReached ? new Date(recentAttempts[0] + 7 * DAY_MS) : null;

    return { currentLevel, isMaxLevel, examsThisWeek, weeklyLimitReached, nextSlotAt };
  }, [baristaName, quizResults]);
}
