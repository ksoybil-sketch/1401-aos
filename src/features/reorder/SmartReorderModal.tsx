import React from 'react';
import { InventoryItem, FrozenItem, ReorderRecommendation, TransactionLogItem } from '../../types';
import { getDaysRemaining } from '../../utils/helpers';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import { areProductsMatching } from '../../utils/matching';
import { Icon } from '../../components/Icon';
import {
  badge, badgeCaution, badgeNegative, btn, btnLg, btnPrimary, btnSecondary,
  iconBtn, modalBody, modalGrabber, modalHeader, modalOverlay, modalPanel, modalTitle
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
        boxSize: boxQty,
        reason: currentQty === 0 ? 'Donuk stokta hiç kalmadı' : `Kritik stok seviyesi (${currentQty} adet kaldı)`,
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
        reason: days <= 0 ? 'Tarihi geçti, imha edilip yenisi söylenmeli' : `SKT son ${days} gün`,
        urgency: 'HIGH'
      });
    } else if (item.quantity < (targetStock / 2) && past30DaysConsumption > 0) {
      // Eğer mevcut stok, hedef stoğun yarısından azsa sipariş öner
      recommendations.push({
        productName: item.name,
        category: item.category,
        currentStock: item.quantity,
        recommendedOrder: targetStock - item.quantity,
        reason: `Son 30 günde ${past30DaysConsumption} adet tüketilmiş`,
        urgency: 'MEDIUM'
      });
    }
  });

  /**
   * Sipariş miktarını okunabilir birime çevirir. Kutu içi adedi bilinen
   * ürünler tedarikçiden kutu ile alındığı için "2 kutu" olarak gösterilir;
   * bilinmeyenler adet olarak kalır.
   */
  const orderLabel = (rec: ReorderRecommendation) =>
    rec.boxSize
      ? `${Math.max(1, Math.round(rec.recommendedOrder / rec.boxSize))} kutu`
      : `${rec.recommendedOrder} adet`;

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalGrabber} />
        <div className={modalHeader}>
          <h2 className={modalTitle}>Sipariş Önerisi</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Kapat">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className={modalBody}>
          <p className="text-[13px] text-fg-3 mb-4 leading-relaxed">
            Donuk stok seviyeleri ve yaklaşan SKT'ler analiz edilerek hazırlandı.
          </p>

          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-5 text-center rounded-xl border border-dashed border-line">
              <Icon name="check" size={26} className="text-positive mb-3" />
              <p className="text-fg-2 text-[14px] leading-relaxed">
                Tüm stok seviyeleri yeterli. Şu an sipariş vermeniz gereken kritik bir ürün yok.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recommendations.map((rec, idx) => {
                const isHigh = rec.urgency === 'HIGH';
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-3.5 flex flex-col gap-2 border border-l-2 ${
                      isHigh ? 'border-line border-l-negative' : 'border-line border-l-caution'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <span className="font-medium text-[15px] text-crema min-w-0">{rec.productName}</span>
                      <span className={`${badge} ${isHigh ? badgeNegative : badgeCaution}`}>
                        {isHigh ? 'Acil' : 'Önerilen'}
                      </span>
                    </div>

                    <div className="text-[12px] text-fg-3">
                      {rec.category} · Mevcut <span className="text-fg-2 tnum">{rec.currentStock}</span> adet
                      {rec.boxSize && <> · Kutu içi <span className="text-fg-2 tnum">{rec.boxSize}</span></>}
                    </div>

                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-[13px] text-fg-2">Önerilen sipariş</span>
                      <span className="text-[17px] font-semibold text-crema tnum">{orderLabel(rec)}</span>
                    </div>
                    <div className="text-[12px] text-fg-3 leading-relaxed">{rec.reason}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex gap-2.5">
            <button onClick={onClose} className={`${btn} ${btnSecondary} ${btnLg} flex-1`}>
              Kapat
            </button>
            <button
              onClick={() => {
                // Karşı tarafa gereken tek bilgi ne, ne kadar — gerekçe ve
                // mevcut stok bilgisi mesajı okunmaz hâle getiriyordu.
                let text = '*1401 Coffee — Sipariş Listesi*\n\n';
                recommendations.forEach(r => {
                  text += `${r.productName} — ${orderLabel(r)}\n`;
                });
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className={`${btn} ${btnPrimary} ${btnLg} flex-[1.4]`}
            >
              <Icon name="send" size={16} />
              WhatsApp ile gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
