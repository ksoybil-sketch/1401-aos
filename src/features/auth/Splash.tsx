import React, { useEffect } from 'react';

export const Splash: React.FC = () => {
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashEl = document.getElementById('premium-splash');
      if (splashEl) {
        splashEl.classList.add('splash-hidden');
        setTimeout(() => {
          if (splashEl) splashEl.style.display = 'none';
        }, 800);
      }
    }, 1000);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div id="premium-splash">
      <div className="splash-content">
        <img src="./icons/logo_goat.svg" alt="1401 Coffee Logo" className="splash-logo" />
        <h1 className="splash-text">1401 Coffee Akıllı Operasyon Sistemi</h1>
      </div>
    </div>
  );
};
