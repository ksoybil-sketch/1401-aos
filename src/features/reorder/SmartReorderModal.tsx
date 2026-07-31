import React from 'react';
import { InventoryItem, FrozenItem, ReorderRecommendation, TransactionLogItem } from '../../types';
import { getDaysRemaining } from '../../utils/helpers';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import { areProductsMatching } from '../../utils/matching';
import {
  btn, btnLg, btnSecondary, iconBtn, modalBody, modalGrabber,
  modalHeader, modalOverlay, modalPanel, modalTitle
} from '../../constants/ui';

interface SmartReorderModalProps {
  inventory: InventoryItem[];
  frozenStock: FrozenItem[];
  transactionLog: TransactionLogItem[];
  onClose: () => void;
}

export const SmartReorderModal: React.FC<SmartReorderModalProps> = ({ inventory, frozenStock, transactionLog, onClose }) => {
  // Akıllı Sipariş Öneri Hesaplayıcısı
  const recommendations: ReorderRecommendation[] = [];

  // Son 30 günlük tüketimi hesapla
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const consumptionMap: Record<string, number> = {};
  transactionLog.forEach(log => {
    if (log.type === 'CONSUMED' && new Date(log.date) >= thirtyDaysAgo) {
      consumptionMap[log.productName] = (consumptionMap[log.productName] || 0) + log.quantity;
    }
  });

  // 1. Donuk Stok Kontrolü (Tükenen veya kritik olan donuk tatlılar)
  TESHIR_URUNLERI.forEach((teshirName) => {
    const matchedFrozen = frozenStock.find(f => areProductsMatching(f.name, teshirName));
    const boxQty = KUTU_ICI_ADETLER[teshirName] || 12;

    if (!matchedFrozen || matchedFrozen.quantity <= 3) {
      const currentQty = matchedFrozen ? matchedFrozen.quantity : 0;
      recommendations.push({
        productName: teshirName,
        category: 'Teşhir / Donuk Stok',
        currentStock: currentQty,
        recommendedOrder: Math.ceil(boxQty * 2), // 2 kutu öner
        reason: currentQty === 0 ? 'Donuk stokta hiç kalmadı!' : `Kritik stok seviyesi (${currentQty} adet kaldı)`,
        urgency: currentQty === 0 ? 'HIGH' : 'MEDIUM'
      });
    }
  });

  // 2. Kritik SKT Uyarısı Olan ve Yenilenmesi Gereken Envanter Ürünleri & Tüketim Bazlı Sipariş
  inventory.forEach((item) => {
    const days = getDaysRemaining(item.expirationDate);
    const past30DaysConsumption = consumptionMap[item.name] || 0;
    const dailyAvg = past30DaysConsumption / 30;

    // Güvenlik stoğu (örn: 14 günlük stok tutmak isteyelim)
    const targetStock = Math.ceil(dailyAvg * 14) || 5;

    if (days <= 2) {
      recommendations.push({
        productName: item.name,
        category: item.category,
        currentStock: item.quantity,
        recommendedOrder: Math.max(item.quantity, targetStock),
        reason: days <= 0 ? 'Tarihi geçti, imha edilip yenisi söylenmeli' : `SKT son ${days} gün!`,
        urgency: 'HIGH'
      });
    } else if (item.quantity < (targetStock / 2) && past30DaysConsumption > 0) {
      // Eğer mevcut stok, hedef stoğun yarısından azsa sipariş öner
      recommendations.push({
        productName: item.name,
        category: item.category,
        currentStock: item.quantity,
        recommendedOrder: targetStock - item.quantity,
        reason: `Son 30 günde ${past30DaysConsumption} adet tüketilmiş. Ortalama gidişata göre stok azalıyor.`,
        urgency: 'MEDIUM'
      });
    }
  });

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>📦 Ne Sipariş Vermeliyim?</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={modalBody}>
          <p className="text-[13px] text-content-muted mb-5 leading-relaxed">
            Akıllı tahminleme sistemi, şubenizdeki donuk stok seviyeleri ve yaklaşan SKT'leri analiz ederek sipariş ihtiyaçlarınızı listeler.
          </p>

          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-5 text-center rounded-3xl border border-dashed border-hairline bg-glass/50">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-content-secondary font-semibold text-sm leading-relaxed">
                Tüm stok seviyeleriniz yeterli! Şu an sipariş vermeniz gereken kritik bir ürün bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, idx) => {
                const isHigh = rec.urgency === 'HIGH';
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 flex flex-col gap-2.5 border border-l-4 ${
                      isHigh
                        ? 'bg-danger-bg border-danger-border border-l-danger'
                        : 'bg-warning-bg border-warning-border border-l-warning'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <span className="font-bold text-sm text-content min-w-0">{rec.productName}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                          isHigh ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {isHigh ? 'ACİL SİPARİŞ' : 'ÖNERİLEN'}
                      </span>
                    </div>

                    <div className="text-xs text-content-muted font-medium">
                      Kategori: {rec.category} <span className="mx-1">•</span> Mevcut Stok:{' '}
                      <strong className="text-content">{rec.currentStock}</strong> adet
                    </div>

                    <div className={`text-sm font-bold mt-0.5 ${isHigh ? 'text-danger' : 'text-warning'}`}>
                      👉 Önerilen Sipariş: <strong className="text-lg">{rec.recommendedOrder} Adet</strong>
                      <div className="text-xs font-semibold opacity-80 mt-1 leading-relaxed">({rec.reason})</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
              Kapat
            </button>
            <button
              onClick={() => {
                let text = '*📦 1401 AOS Akıllı Sipariş Önerisi*\n\n';
                recommendations.forEach(r => {
                  text += `▪️ *${r.productName}*\n`;
                  text += `Mevcut Stok: ${r.currentStock}\n`;
                  text += `👉 Sipariş Önerisi: *${r.recommendedOrder} Adet*\n`;
                  text += `Nedeni: ${r.reason}\n\n`;
                });
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className={`${btn} ${btnLg} flex-[2] bg-gradient-to-b from-success to-[#2FB37E] text-night border border-success/40 shadow-[0_8px_24px_-8px_rgba(62,213,152,0.6)] hover:brightness-110`}
            >
              <span className="text-lg">📲</span> WhatsApp ile Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
