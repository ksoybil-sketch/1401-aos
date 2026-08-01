import { StatusDetails } from '../types';

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

export async function saveInventoryToNative(inventoryArray: any[]): Promise<void> {
  try {
    const jsonStr = JSON.stringify(inventoryArray);
    const cap = (window as any).Capacitor;
    if (cap && cap.Plugins && cap.Plugins.InventoryBridge) {
      await cap.Plugins.InventoryBridge.saveInventory({ json: jsonStr });
    }
  } catch (e) {
    // web environment fallback
  }
}
