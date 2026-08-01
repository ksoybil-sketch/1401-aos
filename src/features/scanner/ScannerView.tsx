import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { playBeepSound } from '../../utils/helpers';
import { Capacitor } from '@capacitor/core';
import { useUIStore } from '../../store/useUIStore';
import { Icon } from '../../components/Icon';

export const ScannerView: React.FC = () => {
  const navigate = useNavigate();
  const { openAddModal } = useUIStore();
  
  const [scannerError, setScannerError] = useState('');
  const [scanStatusText, setScanStatusText] = useState('Kamera Başlatılıyor...');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const isWeb = Capacitor.getPlatform() === 'web';

  const handleCancel = () => {
    navigate('/');
  };

  const handleToggleTorch = async () => {
    try {
      if (torchOn) {
        await BarcodeScanner.disableTorch();
        setTorchOn(false);
      } else {
        await BarcodeScanner.enableTorch();
        setTorchOn(true);
      }
    } catch (err) {
      console.error('Fener açılıp kapatılamadı:', err);
    }
  };

  const handleScanSuccess = (barcode: string) => {
    openAddModal(barcode);
    navigate('/');
  };

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        if (isWeb) {
          setScannerError("Native barkod okuyucu web tarayıcısında desteklenmiyor. Lütfen mobil cihazda deneyin veya manuel giriş yapın.");
          // Dev modunda test için fake barcode
          setTimeout(() => {
            if (isMounted && window.confirm("Web modunda test barkodu üretilsin mi?")) {
              handleScanSuccess("1234567890123");
            }
          }, 1500);
          return;
        }

        // Kamera izni iste
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted' && camera !== 'limited') {
          if (isMounted) setScannerError("Kamera izni verilmedi.");
          return;
        }

        if (isMounted) setScanStatusText("Barkod Aranıyor...");

        // Arka planı transparan yap (Capacitor için gerekli olabilir)
        document.body.classList.add('scanner-active');
        document.documentElement.classList.add('scanner-active');

        await BarcodeScanner.addListener('barcodesScanned', async (result) => {
          if (!isMounted) return;
          playBeepSound();
          
          await BarcodeScanner.stopScan();
          document.body.classList.remove('scanner-active');
          document.documentElement.classList.remove('scanner-active');
          if (result.barcodes && result.barcodes.length > 0) {
            handleScanSuccess(result.barcodes[0].displayValue);
          }
        });

        await BarcodeScanner.startScan({ formats: [BarcodeFormat.Ean13, BarcodeFormat.Ean8, BarcodeFormat.Code128, BarcodeFormat.Code39, BarcodeFormat.UpcA, BarcodeFormat.UpcE, BarcodeFormat.QrCode] });

        try {
          const { available } = await BarcodeScanner.isTorchAvailable();
          if (isMounted) setHasTorch(available);
        } catch {
          // Fener desteği sorgulanamadıysa buton gösterilmez
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Scanner error:", err);
          setScannerError("Tarayıcı başlatılamadı: " + err.message);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      document.body.classList.remove('scanner-active');
      document.documentElement.classList.remove('scanner-active');
      BarcodeScanner.disableTorch().catch(() => {});
      BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.stopScan().catch(() => {});
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Üst Kısım: İptal Butonu ve Başlık */}
      <div className="flex items-center justify-between px-4 pb-3.5 bg-black/45 backdrop-blur-md text-white pt-[max(14px,env(safe-area-inset-top))]">
        <button
          className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white/10 border border-white/15 hover:bg-white/15 active:opacity-80 transition-colors"
          onClick={handleCancel}
          aria-label="Kapat"
        >
          <Icon name="close" size={17} />
        </button>
        <span className="text-[15px] font-semibold">Ürün Tarama</span>
        <div className="w-9" />
      </div>

      {/* Hata Mesajı */}
      {scannerError && (
        <div className="absolute top-20 left-4 right-4 flex items-start gap-2.5 bg-negative/90 text-white p-3.5 rounded-xl z-20 backdrop-blur-md text-[13px] leading-relaxed border border-white/15">
          <Icon name="alert" size={16} className="mt-px" />
          {scannerError}
        </div>
      )}

      {/* Kamera Alanı (Barkod Tarayıcı için Şeffaf Kutu) */}
      <div className="flex-1 relative flex items-center justify-center pointer-events-none">
        {/* Odak Çerçevesi */}
        <div className="relative w-60 h-60 rounded-2xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
          {/* Köşe İşaretçileri */}
          <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-white/85 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-white/85 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-white/85 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-white/85 rounded-br-2xl" />

          {/* Tarama Çizgisi (Animasyonlu) */}
          <div className="absolute top-0 left-0 w-full h-px bg-white/70 [animation:scan_2.2s_ease-in-out_infinite]" />
        </div>

        {/* El Feneri Butonu (sadece cihaz destekliyorsa) */}
        {hasTorch && (
          <button
            onClick={handleToggleTorch}
            className={`absolute bottom-6 right-6 w-11 h-11 inline-flex items-center justify-center rounded-xl backdrop-blur-md border transition-colors pointer-events-auto z-20 active:opacity-80 ${
              torchOn
                ? 'bg-white text-espresso border-white'
                : 'bg-black/45 text-white border-white/20'
            }`}
            aria-label="El feneri"
          >
            <Icon name="flash" size={19} />
          </button>
        )}
      </div>

      {/* Durum Metni */}
      <div className="absolute bottom-24 left-0 right-0 text-center text-white/90 text-[14px] font-medium z-20">
        {scanStatusText}
      </div>

      {/* Alt Bilgi */}
      <div className="absolute bottom-0 w-full px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] bg-black/55 backdrop-blur-md text-white/60 text-center text-[12px] z-20">
        Manuel giriş için barkodu form üzerinden girebilirsiniz.
      </div>
    </div>
  );
};
