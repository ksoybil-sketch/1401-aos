import React from 'react';
import { InventoryItem, FrozenItem, ReorderRecommendation, TransactionLogItem } from '../../types';
import { getDaysRemaining } from '../../utils/helpers';
import { TESHIR_URUNLERI, KUTU_ICI_ADETLER } from '../../constants';
import { areProductsMatching } from '../../utils/matching';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">📦 Ne Sipariş Vermeliyim?</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 active:scale-95 transition text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium">
            Akıllı tahminleme sistemi, şubenizdeki donuk stok seviyeleri ve yaklaşan SKT'leri analiz ederek sipariş ihtiyaçlarınızı listeler.
          </p>

          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-gray-600 font-bold">Tüm stok seviyeleriniz yeterli! Şu an sipariş vermeniz gereken kritik bir ürün bulunmuyor.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`border-l-4 rounded-xl p-4 flex flex-col gap-2 shadow-sm ${rec.urgency === 'HIGH' ? 'bg-red-50/50 border-red-500' : 'bg-amber-50/50 border-amber-500'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-gray-900">{rec.productName}</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${rec.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {rec.urgency === 'HIGH' ? 'ACİL SİPARİŞ' : 'ÖNERİLEN'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 font-medium">
                    Kategori: {rec.category} <span className="mx-1">•</span> Mevcut Stok: <strong className="text-gray-900">{rec.currentStock}</strong> adet
                  </div>

                  <div className={`text-sm font-bold mt-1 ${rec.urgency === 'HIGH' ? 'text-red-700' : 'text-amber-700'}`}>
                    👉 Önerilen Sipariş: <strong className="text-lg">{rec.recommendedOrder} Adet</strong>
                    <div className="text-xs font-semibold opacity-80 mt-0.5">({rec.reason})</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-200 active:scale-95 transition">
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
              className="flex-[2] flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 active:scale-95 transition text-base"
            >
              <span className="text-xl">📲</span> WhatsApp ile Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
