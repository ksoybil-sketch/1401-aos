import React, { useEffect } from 'react';

export const Splash: React.FC = () => {
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashEl = document.getElementById('premium-splash');
      if (splashEl) {
        splashEl.classList.add('translate-y-[100vh]', 'opacity-0', 'pointer-events-none');
        setTimeout(() => {
          if (splashEl) splashEl.style.display = 'none';
        }, 800);
      }
    }, 1000);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div id="premium-splash" className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-[#F5F0E8] to-[#EAE0D0] z-[99999] flex justify-center items-center transition-[transform,opacity] duration-[750ms] ease">
      <div className="flex flex-col items-center -translate-y-10 opacity-0 [animation:slideDownFadeIn_0.9s_ease_0.15s_forwards]">
        <img src="./icons/logo_goat.svg" alt="1401 Coffee Logo" className="w-[110px] h-[110px] mb-5" />
        <h1 className="font-extrabold text-xl text-[#1A1210] text-center px-5 leading-relaxed tracking-wide">1401 Coffee Akıllı Operasyon Sistemi</h1>
      </div>
    </div>
  );
};
