import React, { useEffect } from 'react';

export const Splash: React.FC = () => {
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashEl = document.getElementById('premium-splash');
      if (splashEl) {
        splashEl.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          if (splashEl) splashEl.style.display = 'none';
        }, 600);
      }
    }, 900);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div
      id="premium-splash"
      className="fixed inset-0 z-[99999] flex flex-col justify-center items-center bg-espresso transition-opacity duration-[600ms] ease-out"
    >
      <img src="./icons/logo_goat.svg" alt="1401 Coffee" className="w-16 h-16 opacity-90" />
      <h1 className="mt-5 text-[17px] font-medium text-crema tracking-tight">1401 Coffee</h1>
      <p className="mt-1 text-[12px] text-fg-3">Akıllı Operasyon Sistemi</p>
      <div className="mt-9 w-6 h-6 rounded-full border-2 border-line border-t-crema [animation:rotation_0.7s_linear_infinite]" />
    </div>
  );
};
