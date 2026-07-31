import React, { useEffect } from 'react';

export const Splash: React.FC = () => {
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashEl = document.getElementById('premium-splash');
      if (splashEl) {
        splashEl.classList.add('opacity-0', 'scale-105', 'pointer-events-none');
        setTimeout(() => {
          if (splashEl) splashEl.style.display = 'none';
        }, 800);
      }
    }, 1000);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div
      id="premium-splash"
      className="fixed inset-0 z-[99999] flex justify-center items-center bg-void transition-all duration-[750ms] ease-out"
    >
      {/* Ambiyans hâlesi */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-gold/12 blur-[100px]" />

      <div className="relative flex flex-col items-center -translate-y-10 opacity-0 [animation:slideDownFadeIn_0.9s_ease_0.15s_forwards]">
        <img src="./icons/logo_goat.svg" alt="1401 Coffee Logo" className="w-28 h-28 mb-6" />
        <h1 className="font-extrabold text-xl text-content text-center px-8 leading-relaxed tracking-tight">
          1401 Coffee Akıllı Operasyon Sistemi
        </h1>
        <div className="mt-8 w-10 h-10 rounded-full border-2 border-hairline border-t-gold [animation:rotation_0.8s_linear_infinite]" />
      </div>
    </div>
  );
};
