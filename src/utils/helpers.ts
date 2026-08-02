import { StatusDetails, TransactionLogItem } from '../types';

export interface WeeklyTrend {
  thisWeek: number;
  lastWeek: number;
  /** Geçen hafta 0 idiyse yüzde hesabı anlamsız — null döner. */
  deltaPercent: number | null;
}

/**
 * Son 7 gün ile ondan önceki 7 günü karşılaştırır (takvim haftası değil,
 * kayan pencere — böylece haftanın hangi günü olursa olsun eksik/yarım
 * hafta yanıltıcı bir kıyas üretmez).
 */
export function computeWeeklyTrend(logs: TransactionLogItem[], type: TransactionLogItem['type']): WeeklyTrend {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const thisWeekStart = now - 7 * DAY_MS;
  const lastWeekStart = now - 14 * DAY_MS;

  let thisWeek = 0;
  let lastWeek = 0;

  logs.forEach((log) => {
    if (log.type !== type) return;
    const t = new Date(log.date).getTime();
    if (Number.isNaN(t)) return;
    if (t >= thisWeekStart) thisWeek += log.quantity;
    else if (t >= lastWeekStart) lastWeek += log.quantity;
  });

  const deltaPercent = lastWeek === 0 ? null : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  return { thisWeek, lastWeek, deltaPercent };
}

export function getDaysRemaining(expirationDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDateStr);
  expDate.setHours(0, 0, 0, 0);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusDetails(daysRemaining: number, category?: string): StatusDetails {
  const warningThreshold = category === 'Teşhir Dolabı' ? 1 : 3;
  if (daysRemaining <= 0) {
    return {
      statusClass: "bg-negative-bg text-negative border-negative-line",
      statusBorderClass: "border-l-negative",
      label: daysRemaining === 0 ? "Bugün son gün" : `${Math.abs(daysRemaining)} gün geçti`,
    };
  } else if (daysRemaining <= warningThreshold) {
    return {
      statusClass: "bg-caution-bg text-caution border-caution-line",
      statusBorderClass: "border-l-caution",
      label: `${daysRemaining} gün kaldı`,
    };
  } else {
    return {
      statusClass: "bg-positive-bg text-positive border-positive-line",
      statusBorderClass: "border-l-positive",
      label: "Güvenli",
    };
  }
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function parseDateFromTR(dateStr?: string): string {
  if (!dateStr || dateStr === '-') return new Date().toISOString().split('T')[0];
  const parts = dateStr.split(/[\.\-\/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }
  return new Date().toISOString().split('T')[0];
}

export function playBeepSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 1000;
    
    gain.gain.setValueAtTime(0.30, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.18);
  } catch (e) {
    console.error("Audio beep failed:", e);
  }
}
