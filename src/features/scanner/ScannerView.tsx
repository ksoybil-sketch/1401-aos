import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { playBeepSound } from '../../utils/helpers';
import { Capacitor } from '@capacitor/core';
import { useUIStore } from '../../store/useUIStore';

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
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm text-white pt-[max(16px,env(safe-area-inset-top))]">
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition" onClick={handleCancel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-lg font-bold tracking-wide drop-shadow-md">Ürün Tarama</span>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Hata Mesajı */}
      {scannerError && (
        <div className="absolute top-24 left-4 right-4 bg-danger/90 text-white p-4 rounded-2xl shadow-lg z-20 backdrop-blur-md font-semibold text-sm border border-white/15">
          {scannerError}
        </div>
      )}

      {/* Kamera Alanı (Barkod Tarayıcı için Şeffaf Kutu) */}
      <div className="flex-1 relative flex items-center justify-center pointer-events-none">
        {/* Karartılmış arka plan katmanı */}
        <div className="absolute inset-0 border-[40px] border-black/40 backdrop-blur-[2px]"></div>
        
        {/* Odak Çerçevesi */}
        <div className="relative w-64 h-64 border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          {/* Köşe İşaretçileri */}
          <div className="absolute top-0 left-0 w-9 h-9 border-t-[3px] border-l-[3px] border-gold rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-9 h-9 border-t-[3px] border-r-[3px] border-gold rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-9 h-9 border-b-[3px] border-l-[3px] border-gold rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-9 h-9 border-b-[3px] border-r-[3px] border-gold rounded-br-3xl"></div>

          {/* Tarama Çizgisi (Animasyonlu) */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_2px_rgba(217,182,95,0.6)] [animation:scan_2.2s_ease-in-out_infinite]"></div>
        </div>

        {/* El Feneri Butonu (sadece cihaz destekliyorsa) */}
        {hasTorch && (
          <button
            onClick={handleToggleTorch}
            className={`absolute bottom-6 right-6 p-3 rounded-full backdrop-blur-sm active:scale-95 transition pointer-events-auto z-20 ${torchOn ? 'bg-gold' : 'bg-black/40'}`}
            aria-label="El feneri"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={torchOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </button>
        )}
      </div>

      {/* Durum Metni */}
      <div className="absolute bottom-32 left-0 right-0 text-center text-white font-bold text-lg drop-shadow-lg z-20 tracking-wide">
        {scanStatusText}
      </div>

      {/* Alt Bilgi */}
      <div className="absolute bottom-0 w-full p-6 pb-safe bg-black/60 backdrop-blur-md text-white/80 text-center text-sm font-medium z-20 rounded-t-3xl">
        Manuel giriş için barkodu form üzerinden girebilirsiniz.
      </div>
    </div>
  );
};
